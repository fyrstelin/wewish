import * as App from './App';
import { Auth, getAuth } from 'firebase/auth';
import { ComponentType, ReactNode } from 'react';

type ReactProps = {
  children?: ReactNode
}

export type WithAuth = { auth: Auth };
export function WithAuth<TProps>(Component: ComponentType<TProps & WithAuth>) {
  return (props: ReactProps & TProps) => <App.Consumer>{app =>
    <Component auth={getAuth(app)} {...props} />
  }</App.Consumer>
}

export const useAuth = () => getAuth(App.useApp())
