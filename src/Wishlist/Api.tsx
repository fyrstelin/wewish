import { equalTo, get, onValue, orderByChild, query, ref, update } from 'firebase/database';
import { ref as storageRef, uploadBytes } from 'firebase/storage'
import { createContext, FC, useMemo, useContext, PropsWithChildren } from 'react';
import { useStorage, useDatabase, useAuth, useFunction } from '../Firebase';
import { Id, Patch } from '../Utils';

export type WishUpdate = {
  name?: string
  category?: string
  url?: string
  price?: null | 1 | 2 | 3
  amount?: 'unlimited' | number,
  description?: string
}

export type Api = {
  addWish: (name: string, category: null | string, amount: number | 'unlimited') => Promise<void>
  addWishFromUrl: (url: string, category: null | string) => Promise<void>
  deleteWish: (wishId: WishId) => Promise<void>
  updateWish: (wishId: WishId, wish: WishUpdate) => Promise<void>

  uploadImage: (wishId: WishId, image: Blob) => Promise<void>

  star: () => Promise<void>
  unstar: () => Promise<void>

  markAsBought: (wishId: WishId, amount: number) => Promise<void>
  markAsUnbought: (wishId: WishId) => Promise<void>

  shared: () => Promise<void>

  updateDescription: (description: string) => Promise<void>

  requestAccess: () => Promise<void>
  acceptAccessRequest: (id: UserId) => Promise<void>
  rejectAccessRequest: (id: UserId) => Promise<void>
}

const log = (name: string) => (...args: any) => console.log(name, ...args) as any

const EmptyApi: Api = {
  addWish: log('add wish'),
  addWishFromUrl: log('addWishFromUrl'),
  deleteWish: log('delete wish'),
  updateWish: log('updateWish'),
  uploadImage: log('upload image'),
  star: log('star'),
  unstar: log('unstar'),
  markAsBought: log('markAsBought'),
  markAsUnbought: log('markAsUnbought'),
  shared: log('shared'),
  updateDescription: log('updateDescription'),
  requestAccess: log('requestAccess'),
  acceptAccessRequest: log('acceptAccessRequest'),
  rejectAccessRequest: log('rejectAccessRequest')
}

const Context = createContext<Api>(EmptyApi);

export const useApi = () => useContext(Context)

export const ApiProvider: FC<PropsWithChildren<{ wishlistId: WishlistId }>> = ({
  wishlistId,
  children
}) => {
  const db = useDatabase()
  const storage = useStorage()
  const auth = useAuth()
  const addWishFn = useFunction('addWish')

  const api = useMemo<Api>(() => {
    const handleAccessRequest = async (input: Dictionary, uid: string) => {
      const r = await get(
        query(ref(db, `/requests`),
          orderByChild('wishlistId'),
          equalTo(wishlistId)
        ))

      const requests = (r.val() || {}) as Dictionary<{ requester: string }>;

      const patch = Object.entries(requests)
        .filter(([, req]) => req.requester === uid)
        .reduce((acc, [id]) => ({
          ...acc,
          [`/requests/${id}`]: null
        }), input);

      await update(ref(db), patch);
    }

    return ({
      addWish: async (name, category, amount) => {
        const userId = auth.currentUser!.uid;
        const wishId = Id<WishId>();
        await update(ref(db), {
          [`wishlists/${wishlistId}/wishes/${wishId}`]: true,
          [`wishes/${wishId}`]: {
            name, category, amount,
            wishlistId
          },
          [`users/${userId}/skills/add-wish`]: true
        });
      },

      addWishFromUrl: async (url, category) => {
        await addWishFn({
          url, category,
          wishlistId
        });
      },

      deleteWish: async (wishId) => {
        await update(ref(db), {
          [`/wishlists/${wishlistId}/wishes/${wishId}`]: null
        });
      },

      updateWish: async (wishId, input) => {
        await update(ref(db), Patch({
          [`wishes/${wishId}/name`]: input.name,
          [`wishes/${wishId}/category`]: input.category,
          [`wishes/${wishId}/url`]: input.url,
          [`wishes/${wishId}/price`]: input.price,
          [`wishes/${wishId}/amount`]: input.amount,
          [`wishes/${wishId}/description`]: input.description
        }));
      },

      uploadImage: async (wishId, image) => {
        const imageRef = ref(db);
        const currentImage = (await get(imageRef)).val();
        const path = `/uploads/${Id(32)}`;
        const r = storageRef(storage, path);
        await uploadBytes(r, image, {
          contentType: image.type,
          customMetadata: {
            'wish-id': wishId
          }
        });

        await new Promise<void>(r => {
          const off = onValue(imageRef, s => {
            if (s && s.val() !== currentImage) {
              off()
              r();
            }
          })
        });
      },

      unstar: async () => {
        const userId = auth.currentUser!.uid;

        update(ref(db), {
          [`/users/${userId}/wishlists/${wishlistId}`]: null
        });
      },

      star: async () => {
        const userId = auth.currentUser!.uid;
        update(ref(db), {
          [`/users/${userId}/skills/star`]: true,
          [`/users/${userId}/wishlists/${wishlistId}`]: true
        });
      },

      markAsBought: async (wishId, amount) => {
        const userId = auth.currentUser!.uid;
        update(ref(db), {
          [`/users/${userId}/skills/mark-as-bought`]: true,
          [`/bought-wishes/${wishId}/${userId}`]: amount
        });
      },

      markAsUnbought: async (wishId) => {
        const userId = auth.currentUser!.uid;
        update(ref(db), {
          [`/bought-wishes/${wishId}/${userId}`]: null
        });
      },

      shared: async () => {
        const userId = auth.currentUser!.uid;
        update(ref(db), {
          [`/users/${userId}/skills/share-wish-list`]: true
        });
      },

      updateDescription: async (description) => {
        update(ref(db), {
          [`/wishlists/${wishlistId}/description`]: description
        })
      },

      requestAccess: async () => {
        const id = Id<AccessRequestId>();
        update(ref(db), {
          [`requests/${id}`]: {
            requester: auth.currentUser!.uid,
            wishlistId
          }
        })
      },


      acceptAccessRequest: uid =>
        handleAccessRequest({
          [`/wishlists/${wishlistId}/members/${uid}`]: 'guest',
        }, uid),

      rejectAccessRequest: uid => handleAccessRequest({}, uid)
    })
  }, [addWishFn, auth.currentUser, db, storage, wishlistId])

  return <Context.Provider value={api}>
    {children}
  </Context.Provider>
}
