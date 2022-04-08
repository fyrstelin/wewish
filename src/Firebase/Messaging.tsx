import * as App from './App';
import { Messaging, getMessaging } from 'firebase/messaging';
import { ComponentType, ReactNode } from 'react';

type ReactProps = { children?: ReactNode };

export type WithMessaging = { messaging: Messaging };
export function WithMessaging<TProps>(Component: ComponentType<TProps & WithMessaging>) {
  return (props: ReactProps & TProps) => <App.Consumer>{app =>
    <Component messaging={getMessaging(app)} {...props} />
  }</App.Consumer>
}
