import React from 'react';
import * as App from './App';
import Firebase from 'firebase/app';
import 'firebase/auth';

type ReactProps = {
  children?: React.ReactNode
}

export type WithAuth = { auth: Firebase.auth.Auth };
export function WithAuth<TProps>(Component: React.ComponentType<TProps & WithAuth>) {
  return (props: ReactProps & TProps) => <App.Consumer>{app =>
    <Component auth={app.auth()} {...props} />
  }</App.Consumer>
}

export const useAuth = () => App.useApp().auth()