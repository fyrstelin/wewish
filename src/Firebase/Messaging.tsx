import React from 'react';
import * as App from './App';
import Firebase from 'firebase/app';
import 'firebase/messaging';

type ReactProps = { children?: React.ReactNode };

const fakeMessaging: Firebase.messaging.Messaging = {
    deleteToken: async () => false,
    getToken: async () => '',
    onMessage: () => () => {},
    onTokenRefresh: () => () => {},
    requestPermission: async () => {},
    setBackgroundMessageHandler: () => {},
    useServiceWorker: () => {},
    usePublicVapidKey: () => {},
    onBackgroundMessage: () => () => {} 
}

export type WithMessaging = { messaging: Firebase.messaging.Messaging };
export function WithMessaging<TProps>(Component: React.ComponentType<TProps & WithMessaging>) {
    if (Firebase.messaging.isSupported()) {
        return (props: ReactProps & TProps) => <App.Consumer>{app => 
            <Component messaging={app.messaging()} {...props}/>
        }</App.Consumer>
    } else {
        return (props: ReactProps & TProps) => <App.Consumer>{app => 
            <Component messaging={fakeMessaging} {...props}/>
        }</App.Consumer>
    }
}