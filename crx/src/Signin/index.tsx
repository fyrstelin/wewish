import { useState } from 'react';
import { IonContent, IonButton, IonIcon, IonInput, IonHeader, IonToolbar, IonTitle, IonLoading } from "@ionic/react";
import { Auth } from '../Firebase'
import { AuthProvider, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import './index.css'

export const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const load = (task: Promise<any>) => {
    setLoading(true);
    task.finally(() => setLoading(false));
  }

  const signInWithProvider = (provider: AuthProvider) => () =>
    load(Auth.signInWithPopup(provider));

  const signIn = () =>
    load(Auth.signInWithEmailAndPassword(email, password));

  return <>
    <IonHeader>
      <IonToolbar color='primary'>
        <IonTitle>Sign in to WeWish</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen class='sign-in'>
      <IonInput
        type='email'
        placeholder='E-mail'
        value={email}
        onIonChange={e => setEmail(e.detail.value || '')}
      />
      <IonInput
        type='password'
        placeholder='password'
        value={password}
        onIonChange={e => setPassword(e.detail.value || '')}
      />

      <IonButton size='small' expand='full' onClick={signIn} disabled={!email || !password}>
        Sign in
      </IonButton>

      <div className='or-with'>Or signin with:</div>

      <div className='providers'>
        <IonButton fill='clear' onClick={signInWithProvider(new GoogleAuthProvider())}>
          <IonIcon icon='logo-google' />
        </IonButton>
        <IonButton fill='clear' onClick={signInWithProvider(new FacebookAuthProvider())}>
          <IonIcon icon='logo-facebook' />
        </IonButton>
      </div>
    </IonContent>
    <IonLoading
      isOpen={loading}
      onDidDismiss={() => { }}
    />
  </>
}
