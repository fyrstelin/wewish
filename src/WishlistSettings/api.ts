import * as Api from '../Api'
import { Patch, Id } from '../Utils';
import { useDatabase } from '../Firebase/Database'
import { useFunction } from '../Firebase/Functions'
import { useUser } from '../User/UserProvider'
import { useHistory } from 'react-router';
import { useShare } from '../Utils/Share';

export type WishlistUpdate = {
  title?: string
  themeColor?: string
  secondaryThemeColor?: string
  access?: Api.Access
}

export const useApi = (id: string) => {
  const db = useDatabase()
  const resetWishlist = useFunction('resetWishlist')
  const { user } = useUser()
  const history = useHistory()
  const share = useShare()
  
  return {
    save: async (update: WishlistUpdate) => {
      await db.ref().update(Patch({
        [`/wishlists/${id}/title`]: update.title,
        [`/wishlists/${id}/themeColor`]: update.themeColor,
        [`/wishlists/${id}/secondaryThemeColor`]: update.secondaryThemeColor,
        [`/wishlists/${id}/access`]: update.access,
      }));
    },
    
    delete: async () => {
      const userId = user!.id;
      await db.ref().update({
        [`/wishlists/${id}/members/${userId}`]: null,
        [`/users/${userId}/wishlists/${id}`]: null
      });
      history.replace('/');
    },

    addCoOwner: async () => {
      const inviteId = Id(48);
      await db.ref().update({
        [`/invites/${inviteId}`]: id
      });
      share(`/invites/${id}`);
    },

    reset: async () => {
      await resetWishlist({ listId: id })
    },

    removeMember: async (id: string) => {
      await db.ref().update({
        [`/wishlists/${id}/members/${id}`]: null
      });
    }
  }
}
