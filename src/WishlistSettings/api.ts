import * as Api from '../Api'
import { Patch, Id } from '../Utils';
import { useDatabase } from '../Firebase/Database'
import { useFunction } from '../Firebase/Functions'
import { useUser } from '../User/UserProvider'
import { useNavigate } from 'react-router';
import { useShare } from '../Utils/Share';
import { ref, update } from 'firebase/database';

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
  const navigate = useNavigate()
  const share = useShare()

  return {
    save: async (patch: WishlistUpdate) => {
      await update(ref(db), Patch({
        [`/wishlists/${id}/title`]: patch.title,
        [`/wishlists/${id}/themeColor`]: patch.themeColor,
        [`/wishlists/${id}/secondaryThemeColor`]: patch.secondaryThemeColor,
        [`/wishlists/${id}/access`]: patch.access,
      }));
    },

    delete: async () => {
      const userId = user!.id;
      await update(ref(db), {
        [`/wishlists/${id}/members/${userId}`]: null,
        [`/users/${userId}/wishlists/${id}`]: null
      });
      navigate('/', { replace: true })
    },

    addCoOwner: async () => {
      const inviteId = Id(48);
      await update(ref(db), {
        [`/invites/${inviteId}`]: id
      });
      share(`/invites/${id}`);
    },

    reset: async () => {
      await resetWishlist({ listId: id })
    },

    removeMember: async (id: string) => {
      await update(ref(db), {
        [`/wishlists/${id}/members/${id}`]: null
      });
    }
  }
}
