import { useState, useEffect, createContext, FC, useMemo, useContext, PropsWithChildren } from 'react';
import { User, Provider } from '.';
import * as Firebase from '../Firebase';
import { Login } from './Login';
import { useToaster } from '../Controls/Toaster';
import { User as FirebaseUser } from 'firebase/auth'
import { IonModal, useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router';

type Task = {
  callback: () => void
}

const Context = createContext<{
  user: null | User
  getUser: (message?: string) => Promise<User>
}>({
  user: null,
  getUser: () => Promise.reject('Not implemented')
})
const newUser = (user: FirebaseUser | null) => user
  ? {
    id: user.uid,
    email: user.email || undefined,
    providers: user.providerData
      .filter(x => !!x)
      .map(x => x!.providerId as Provider)
  }
  : null


export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const auth = Firebase.useAuth()
  const toaster = useToaster()
  const router = useHistory()

  const [user, setUser] = useState<User | null>(newUser(auth.currentUser))

  const [task, setTask] = useState<Task>()

  useEffect(() => auth.onAuthStateChanged(user => {
    setUser(newUser(user))
  }), [auth])

  useEffect(() => router.listen(() => {
    if (router.action === 'PUSH') {
      setTask(undefined);
    }
  }), [router])

  const value = useMemo(() => ({
    user,
    getUser: async (message?: string) => {
      if (user) {
        return user
      }
      if (message) {
        toaster.next({
          message
        })
      }
      return new Promise<User>((resolve, reject) => setTask({
        callback: () => {
          const user = newUser(auth.currentUser)
          setTask(undefined)
          if (user) {
            resolve(user)
          } else {
            reject()
          }
        }
      }))
    }
  }), [user, toaster, auth])

  return (
    <Context.Provider value={value}>
      <IonModal isOpen={!!task} backdropDismiss={false}>
        <Login onLogin={() => task?.callback()}/>
      </IonModal>
      {children}
    </Context.Provider>
  )
}

export const useUser = (forceLogin?: true) => {
  const ctx = useContext(Context)

  useEffect(() => {
    if (forceLogin) {
      ctx.getUser()
    }
  }, [forceLogin, ctx])

  useIonViewWillEnter(() => {
    if (forceLogin) {
      ctx.getUser()
    }
  }, [forceLogin, ctx])

  return ctx
}
