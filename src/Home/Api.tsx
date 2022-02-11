import React, { useContext, FC, useMemo } from 'react';
import { useDatabase, useAuth } from '../Firebase';
import { Id } from '../Utils';

export type Api = {
  signout: () => Promise<void>
  addWishlist: (title: string) => Promise<void>
}

const EmptyApi: Api = {
  signout: async () => console.log('signout'),
  addWishlist: async (title: string) => console.log('addWishlist', title)
}

export const Context = React.createContext<Api>(EmptyApi);

export const useApi = () => useContext(Context)

export const Api: FC = ({ children }) => {
  const db = useDatabase()
  const auth = useAuth()

  const api = useMemo<Api>(() => ({
    signout: async () => auth.signOut(),

    addWishlist: async (title: string) => {
      const id = Id();
      const userId = auth.currentUser!.uid;
      const update = {
        [`users/${userId}/wishlists/${id}`]: true,
        [`users/${userId}/skills/add-wish-list`]: true,
        [`wishlists/${id}`]: {
          members: { [userId]: 'owner' },
          title
        },
      };
      db.ref().update(update);
    }
  }), [db, auth])

  return (
    <Context.Provider value={api}>
      {children}
    </Context.Provider>
  );
}
