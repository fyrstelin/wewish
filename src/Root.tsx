import React from 'react';
import * as Firebase from './Firebase/App';
import { Analytics } from './Firebase/Analytics'
import { Performance } from './Firebase/Performance'

import { App } from './App';
import { IonApp } from '@ionic/react';

export class Root extends React.PureComponent {
    render() {
        return (
            <Firebase.App
                apiKey='AIzaSyBS8xeJ-azSfr6PStW-TD3I0aOGCc651Zk'
                authDomain='wewish.app'
                databaseURL='https://wewish-158417.firebaseio.com'
                projectId='wewish-158417'
                storageBucket='wewish-158417.appspot.com'
                messagingSenderId='607064698105'
                measurementId='G-PB23B3R7ZY'
                appId='1:607064698105:web:5dbd24190ab323a89a8628'
            >
                <Analytics/>
                <Performance/>
                <IonApp>
                    <App/>
                </IonApp>
            </Firebase.App>
        );
    }
}