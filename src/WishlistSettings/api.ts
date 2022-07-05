import * as Api from '../Api'
import { Patch, Id } from '../Utils';
import { useDatabase } from '../Firebase/Database'
import { useFunction } from '../Firebase/Functions'
import { useUser } from '../User/UserProvider'
import { useShare } from '../Utils/Share';
import { ref, update } from 'firebase/database';
import { useIonRouter } from '@ionic/react';

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
  const router = useIonRouter()
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
      router.push('/', 'root', 'replace')
    },

    addCoOwner: async () => {
      const inviteId = Id(48);
      await update(ref(db), {
        [`/invites/${inviteId}`]: id
      });
      share(`/invites/${inviteId}`);
    },

    reset: async () => {
      await resetWishlist({ listId: id })
    },

    removeMember: async (userId: string) => {
      await update(ref(db), {
        [`/wishlists/${id}/members/${userId}`]: null
      });
    }
  }
}
