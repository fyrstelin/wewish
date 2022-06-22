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
  deleteWish: (wishId: string) => Promise<void>
  updateWish: (wishId: string, wish: WishUpdate) => Promise<void>

  uploadImage: (wishId: string, image: Blob) => Promise<void>

  star: () => Promise<void>
  unstar: () => Promise<void>

  markAsBought: (wishId: string, amount: number) => Promise<void>
  markAsUnbought: (wishId: string) => Promise<void>

  shared: () => Promise<void>

  updateDescription: (description: string) => Promise<void>

  requestAccess: () => Promise<void>
  acceptAccessRequest: (id: string) => Promise<void>
  rejectAccessRequest: (id: string) => Promise<void>
}

const EmptyApi: Api = {
  addWish: async (name: string, category: null | string, amount: number | 'unlimited') =>
    console.log('add wish', name, category, amount),
  addWishFromUrl: async (url: string, category: null | string) =>
    console.log('addWishFromUrl', url, category),

  deleteWish: async (wishId: string) =>
    console.log('delete wish', wishId),
  updateWish: async (wishId: string, update: WishUpdate) =>
    console.log('updateWish', wishId, update),

  uploadImage: async (wishId: string, image: Blob) =>
    console.log('upload image', wishId, image),

  star: async () =>
    console.log('star'),
  unstar: async () =>
    console.log('unstar'),

  markAsBought: async (wishId: string, amount: number) =>
    console.log('markAsBought', wishId, amount),
  markAsUnbought: async (wishId: string) =>
    console.log('markAsUnbought', wishId),

  shared: async () =>
    console.log('shared'),

  updateDescription: async (description: string) =>
    console.log('updateDescription', description),

  requestAccess: async () =>
    console.log('requestAccess'),

  acceptAccessRequest: async (uid: string) =>
    console.log('acceptAccessRequest', uid),
  rejectAccessRequest: async (uid: string) =>
    console.log('rejectAccessRequest', uid)
}

const Context = createContext<Api>(EmptyApi);

export const useApi = () => useContext(Context)

export const ApiProvider: FC<PropsWithChildren<{ wishlistId: string }>> = ({
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
      addWish: async (name: string, category: null | string, amount: number | 'unlimited') => {
        const userId = auth.currentUser!.uid;
        const wishId = Id();
        await update(ref(db), {
          [`wishlists/${wishlistId}/wishes/${wishId}`]: true,
          [`wishes/${wishId}`]: {
            name, category, amount,
            wishlistId
          },
          [`users/${userId}/skills/add-wish`]: true
        });
      },

      addWishFromUrl: async (url: string, category: null | string) => {
        await addWishFn({
          url, category,
          wishlistId
        });
      },

      deleteWish: async (wishId: string) => {
        await update(ref(db), {
          [`/wishlists/${wishlistId}/wishes/${wishId}`]: null
        });
      },

      updateWish: async (wishId: string, input: WishUpdate) => {
        await update(ref(db), Patch({
          [`wishes/${wishId}/name`]: input.name,
          [`wishes/${wishId}/category`]: input.category,
          [`wishes/${wishId}/url`]: input.url,
          [`wishes/${wishId}/price`]: input.price,
          [`wishes/${wishId}/amount`]: input.amount,
          [`wishes/${wishId}/description`]: input.description
        }));
      },

      uploadImage: async (wishId: string, image: Blob) => {
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

      markAsBought: async (wishId: string, amount: number) => {
        const userId = auth.currentUser!.uid;
        update(ref(db), {
          [`/users/${userId}/skills/mark-as-bought`]: true,
          [`/bought-wishes/${wishId}/${userId}`]: amount
        });
      },

      markAsUnbought: async (wishId: string) => {
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

      updateDescription: async (description: string) => {
        update(ref(db), {
          [`/wishlists/${wishlistId}/description`]: description
        })
      },

      requestAccess: async () => {
        const id = Id();
        update(ref(db), {
          [`requests/${id}`]: {
            requester: auth.currentUser!.uid,
            wishlistId
          }
        })
      },


      acceptAccessRequest: (uid: string) =>
        handleAccessRequest({
          [`/wishlists/${wishlistId}/members/${uid}`]: 'guest',
        }, uid),

      rejectAccessRequest: (uid: string) => handleAccessRequest({}, uid)
    })
  }, [addWishFn, auth.currentUser, db, storage, wishlistId])

  return <Context.Provider value={api}>
    {children}
  </Context.Provider>
}
