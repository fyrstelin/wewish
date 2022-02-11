import React from 'react';
import { IonContent, IonButton, IonIcon, IonInput, IonHeader, IonToolbar, IonTitle, IonSpinner, IonLoading } from "@ionic/react";
import { Auth } from '../Firebase'
import Firebase from 'firebase/app';
import 'firebase/auth';
import './index.css'

export const Signin = () => {
    const [ loading, setLoading ] = React.useState(false);
    const [ email, setEmail ] = React.useState('');
    const [ password, setPassword ] = React.useState('');

    const load = (task: Promise<any>) => {
        setLoading(true);
        task.finally(() => setLoading(false));
    }

    const signInWithProvider = (provider: Firebase.auth.AuthProvider) => () =>
        load(Auth.signInWithPopup(provider));

    const signIn = () =>
        load(Auth.signInWithEmailAndPassword(email, password));

    return <>
        <IonHeader>
            <IonToolbar color='primary'>
                <IonTitle>Sign in to WeWish</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen padding class='sign-in'>
            <IonInput 
                type='email'
                placeholder='E-mail'
                value={email}
                onIonChange={e => setEmail(e.detail.value || '')}
            />
            <IonInput
                type='password'
                placeholder='password'
                value={password}
                onIonChange={e => setPassword(e.detail.value || '')}
            />

            <IonButton size='small' expand='full' onClick={signIn} disabled={!email || !password}>
                Sign in
            </IonButton>

            <div className='or-with'>Or signin with:</div>

            <div className='providers'>
                <IonButton fill='clear' onClick={signInWithProvider(new Firebase.auth.GoogleAuthProvider())}>
                    <IonIcon icon='logo-google'/>
                </IonButton>
                <IonButton fill='clear' onClick={signInWithProvider(new Firebase.auth.FacebookAuthProvider())}>
                    <IonIcon icon='logo-facebook'/>
                </IonButton>
            </div>
        </IonContent>
        <IonLoading
            isOpen={loading}
            onDidDismiss={() => {}}
        />
    </>
}