import { FC, useState } from 'react';
import './styles.css';
import { useTranslation } from '../../Localization';
import { detect } from 'detect-browser';
import { useAuth, useDatabase } from '../../Firebase';
import { AuthProvider, signInWithPopup, signInWithRedirect, FacebookAuthProvider, GoogleAuthProvider, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { useToaster } from '../../Controls/Toaster';
import { usePopupManager } from '../../Controls/Popups';
import { Link } from 'react-router-dom';
import { IonContent, IonSpinner, IonButton, IonInput, IonItem, IonLabel, IonList, IonTitle, IonHeader, IonToolbar, IonButtons, IonIcon } from '@ionic/react';
import { InputChangeEventDetail } from '@ionic/core';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useHash } from '../../Utils/Hash';
import { closeSharp } from 'ionicons/icons';

const browser = detect();

type InputProps = {
  label: string
  value: string
  onChange: (e: CustomEvent<InputChangeEventDetail>) => void
  type?: 'email' | 'password'
};
const Input = ({ label, value, onChange, type }: InputProps) => <IonItem>
  <IonLabel position='floating'>{label}</IonLabel>
  <IonInput value={value} onIonChange={onChange} type={type} />
</IonItem>

type Props = {
  onLogin: () => void
}

export const Login: FC<Props> = ({ onLogin }) => {
  const [emailStep, setEmailStep] = useHash<'input' | 'register' | 'password'>('step')
  const { login, errors } = useTranslation()
  const popupManager = usePopupManager()
  const toaster = useToaster()
  const auth = useAuth()
  const db = useDatabase()

  const [loading, setLoading] = useState(false)
  const [emailState, setEmailState] = useState({
    email: '',
    password: '',
    name: ''
  })


  const signInWith = async (provider: AuthProvider) => {
    if (browser && browser.os && browser.os !== 'iOS') {
      setLoading(true)
      try {
        await signInWithPopup(auth, provider);
      } catch (e: any) {
        toaster.next({
          message: (errors as any)[e.code] || e.message,
          variant: 'danger'
        });
        setLoading(false)
      }
    } else {
      await signInWithRedirect(auth, provider)
    }
    onLogin();
  }

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    await signInWith(provider);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWith(provider);
  }

  const signInWithIncognito = async () => {
    const confirmed = await popupManager.confirm({
      title: login['sign-in-with-incognito'],
      message: login['sign-in-with-incognito-description'],
    })
    if (confirmed) {
      setLoading(true)
      try {
        await signInAnonymously(auth)
      } catch (e: any) {
        setLoading(false)
        toaster.next({
          message: (errors as any)[e.code] || e.message
        })
      }
    }
  }

  const signInWithEmail = async () => {
    setEmailStep(undefined)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, emailState.email, emailState.password);
    } catch (e: any) {
      toaster.next({
        message: (errors as any)[e.code] || e.message,
        variant: 'danger'
      });
      setLoading(false)
    }
    onLogin();
  }

  const registerUser = async () => {
    setLoading(true)
    const { email, password, name } = emailState;
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        await Promise.all([
          set(ref(db, `/users/${user.uid}/name`), name),
          updateProfile(user, {
            displayName: name,
            photoURL: null
          }),
          sendEmailVerification(user)
        ]);
      }
    } catch (e: any) {
      toaster.next({
        message: (errors as any)[e.code] || e.message,
        variant: 'danger'
      });
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, emailState.email);

      setEmailStep('input')
    } catch (e: any) {
      toaster.next({
        message: (errors as any)[e.code] || e.message,
        variant: 'danger'
      });
    } finally {
      setLoading(false)
    }
  }

  const beginEmailSignin = () => {
    setEmailStep('input')
  }

  const beginRegisterUser = () => setEmailStep('register')

  const beginResetPassword = () => setEmailStep('password')

  const changeEmail = (e: CustomEvent<InputChangeEventDetail>) => {
    const email = e.detail.value;
    if (email != null) {
      setEmailState(state => ({
        ...state, email
      }));
    }
  }

  const changePassword = (e: CustomEvent<InputChangeEventDetail>) => {
    const password = e.detail.value;
    if (password != null) {
      setEmailState(state => ({
        ...state, password
      }));
    }
  }

  const changeName = (e: CustomEvent<InputChangeEventDetail>) => {
    const name = e.detail.value;

    if (name != null) {
      setEmailState(state => ({
        ...state, name
      }));
    }
  }

  return emailStep
    ? <>
      <IonHeader>
        <IonToolbar color='secondary'>
          <IonButtons slot='start'>
            <IonButton onClick={() => window.history.back()}>
              <IonIcon icon={closeSharp}/>
            </IonButton>
          </IonButtons>
          <IonTitle>
            {login['sign-in-with-email']}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList inset>
          {emailStep === 'register' &&

            <Input
              label={login.name}
              value={emailState.name}
              onChange={changeName}
            />
          }
          <Input
            label={login.email}
            value={emailState.email}
            onChange={changeEmail}
            type='email'
          />
          {emailStep !== 'password' &&
            <Input
              label={login.password}
              value={emailState.password}
              onChange={changePassword}
              type='password'
            />
          }
        </IonList>
        {emailStep === 'input' &&
          <IonButton
            fill='clear'
            expand='full'
            disabled={!(emailState.password && emailState.email)}
            onClick={signInWithEmail}
          >
            {login['sign-in']}
          </IonButton>
        }
        {emailStep === 'register' &&
          <IonButton
            expand='full'
            fill='clear'
            disabled={!(emailState.password && emailState.email && emailState.name)}
            onClick={registerUser}
          >
            {login.register}
          </IonButton>
        }
        {emailStep === 'password' &&
          <IonButton
            expand='full'
            fill='clear'
            disabled={!emailState.email}
            onClick={resetPassword}
          >
            {login['reset-password']}
          </IonButton>
        }
        {emailStep === 'input' &&
          <>
            <IonButton
              fill='clear'
              expand='full'
              size='small'
              onClick={beginRegisterUser}
            >
              {login['register-user']}
            </IonButton>
            <IonButton
              fill='clear'
              expand='full'
              size='small'
              onClick={beginResetPassword}
            >
              {login['forgot-password']}
            </IonButton>
          </>

        }
      </IonContent>
    </>
    : <IonContent color='primary' class='login' fullscreen>
      <h1>WeWish</h1>
      <h2 color='inherit'>{login.slogan}</h2>
      {loading
        ? <IonSpinner color='secondary' />
        : <div className='content'>
          <IonButton
            disabled={loading}
            expand='full'
            class='with facebook'
            fill='solid'
            onClick={signInWithFacebook}
          >
            <div>
              <span>{login['sign-in-with-facebook']}</span>
            </div>
          </IonButton>

          <IonButton
            disabled={loading}
            expand='full'
            class='with google'
            fill='solid'
            onClick={signInWithGoogle}
          >
            <div>
              <span>{login['sign-in-with-google']}</span>
            </div>
          </IonButton>

          <IonButton
            disabled={loading}
            expand='full'
            color='secondary'
            class='with email'
            fill='solid'
            onClick={beginEmailSignin}
          >
            <div>
              <span>{login['sign-in-with-email']}</span>
            </div>
          </IonButton>
          <IonButton
            disabled={loading}
            expand='full'
            class='with incognito'
            fill='solid'
            onClick={signInWithIncognito}
          >
            <div>
              <span>{login['sign-in-with-incognito']}</span>
            </div>
          </IonButton>
          <div className='links'>
            <Link to='/policy'>{login.policy}</Link>
            <Link to='/terms'>{login.terms}</Link>
          </div>
        </div>
      }
    </IonContent>
}
