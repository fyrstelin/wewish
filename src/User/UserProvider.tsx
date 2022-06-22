import { useState, useEffect, createContext, FC, useMemo, useContext, ComponentType, ReactNode, PropsWithChildren } from 'react';
import { User, Provider } from '.';
import * as Firebase from '../Firebase';
import { Login } from './Login';
import { useToaster } from '../Controls/Toaster';
import { User as FirebaseUser } from 'firebase/auth'

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

  const [user, setUser] = useState<User | null>(newUser(auth.currentUser))

  const [task, setTask] = useState<Task>()

  useEffect(() => auth.onAuthStateChanged(user => {
    setUser(newUser(user))
  }), [auth])

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

  return task
    ? <Login onLogin={task.callback} />
    : <Context.Provider value={value}>
      {children}
    </Context.Provider>
}

export type WithUser = { user: User | null, getUser: (message?: string) => Promise<User> };
export function WithUser(login?: true) {
  return function WithUser<TProps>(Component: ComponentType<TProps & WithUser>) {
    return (props: TProps) =>
      <OldUserprovider login={login}>{(user, getUser) =>
        <Component user={user} getUser={getUser} {...props} />
      }</OldUserprovider>;
  }
}

const OldUserprovider: FC<{
  login?: true,
  children: (user: User | null, getUser: () => Promise<User>) => ReactNode
}> = ({ login, children }) => {
  const { user, getUser } = useUser(login)
  return <>{children(user, getUser)}</>
}


export const useUser = (forceLogin?: true) => {
  const ctx = useContext(Context)

  useEffect(() => {
    if (forceLogin) {
      ctx.getUser()
    }
  }, [forceLogin, ctx])

  return ctx
}
