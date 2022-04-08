import { FC, useContext, useMemo, createContext } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import 'firebase/messaging';
import 'firebase/analytics'
import 'firebase/performance'

type Props = {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  measurementId: string
  appId: string
};

export const Context = createContext<FirebaseApp>(null as any);
export const { Consumer, Provider } = Context

export const App: FC<Props> = ({
  children,
  ...props
}) => {
  const app = useMemo(() => initializeApp(props), [props])

  return <Provider value={app}>
    {children}
  </Provider>;
}

export const useApp = () => useContext(Context)
