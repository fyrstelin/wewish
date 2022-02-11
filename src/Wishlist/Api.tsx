import * as Firebase from 'firebase/app';
import React, { createContext, FC, useMemo, useContext } from 'react';
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

export const Api: FC<{ wishlistId: string }> = ({
  wishlistId,
  children
}) => {
  const db = useDatabase()
  const storage = useStorage()
  const auth = useAuth()
  const addWishFn = useFunction('addWish')

  const api = useMemo<Api>(() => {
    const handleAccessRequest = async (update: Dictionary, uid: string) => {
      const ref = await db
        .ref(`/requests`)
        .orderByChild('wishlistId').equalTo(wishlistId)
        .once('value');

      const requests = (ref.val() || {}) as Dictionary<{ requester: string }>;

      const patch = Object.entries(requests)
        .filter(([, req]) => req.requester === uid)
        .reduce((acc, [id]) => ({
          ...acc,
          [`/requests/${id}`]: null
        }), update);

      await db.ref().update(patch);
    }

    return ({
      addWish: async (name: string, category: null | string, amount: number | 'unlimited') => {
        const userId = auth.currentUser!.uid;
        const wishId = Id();
        await db.ref().update({
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
        await db.ref().update({
          [`/wishlists/${wishlistId}/wishes/${wishId}`]: null
        });
      },

      updateWish: async (wishId: string, update: WishUpdate) => {
        await db.ref().update(Patch({
          [`wishes/${wishId}/name`]: update.name,
          [`wishes/${wishId}/category`]: update.category,
          [`wishes/${wishId}/url`]: update.url,
          [`wishes/${wishId}/price`]: update.price,
          [`wishes/${wishId}/amount`]: update.amount,
          [`wishes/${wishId}/description`]: update.description
        }));
      },

      uploadImage: async (wishId: string, image: Blob) => {
        const imageRef = db.ref(`/wishes/${wishId}/image`);
        const currentImage = (await imageRef.once('value')).val();
        const path = `/uploads/${Id(32)}`;
        const storageRef = storage.ref(path);
        await storageRef.put(image, {
          contentType: image.type,
          customMetadata: {
            'wish-id': wishId
          }
        });

        await new Promise(r => {
          const cb = (s: Firebase.database.DataSnapshot | null) => {
            if (s && s.val() !== currentImage) {
              imageRef.off('value', cb);
              r();
            }
          }

          imageRef.on('value', cb);
        });
      },

      unstar: async () => {
        const userId = auth.currentUser!.uid;
        db.ref().update({
          [`/users/${userId}/wishlists/${wishlistId}`]: null
        });
      },

      star: async () => {
        const userId = auth.currentUser!.uid;
        db.ref().update({
          [`/users/${userId}/skills/star`]: true,
          [`/users/${userId}/wishlists/${wishlistId}`]: true
        });
      },

      markAsBought: async (wishId: string, amount: number) => {
        const userId = auth.currentUser!.uid;
        db.ref().update({
          [`/users/${userId}/skills/mark-as-bought`]: true,
          [`/bought-wishes/${wishId}/${userId}`]: amount
        });
      },

      markAsUnbought: async (wishId: string) => {
        const userId = auth.currentUser!.uid;
        db.ref().update({
          [`/bought-wishes/${wishId}/${userId}`]: null
        });
      },

      shared: async () => {
        const userId = auth.currentUser!.uid;
        db.ref().update({
          [`/users/${userId}/skills/share-wish-list`]: true
        });
      },

      updateDescription: async (description: string) => {
        db.ref().update({
          [`/wishlists/${wishlistId}/description`]: description
        })
      },

      requestAccess: async () => {
        const id = Id();
        db.ref().update({
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
