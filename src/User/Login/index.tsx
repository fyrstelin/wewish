import { FC, useState } from 'react';
import './styles.css';
import { useTranslation } from '../../Localization';
import { detect } from 'detect-browser';
import { useAuth, useDatabase } from '../../Firebase';
import { AuthProvider, signInWithPopup, signInWithRedirect, FacebookAuthProvider, GoogleAuthProvider, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { useToaster } from '../../Controls/Toaster';
import { usePopupManager } from '../../Controls/Popups';
import { Link } from 'react-router-dom';
import { IonContent, IonSpinner, IonButton, IonInput, IonItem, IonLabel, IonList, IonTitle } from '@ionic/react';
import { InputChangeEventDetail } from '@ionic/core';
import { Modal } from '../../Controls/Modal';
import { useHashController } from '../../Utils/Hash';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, set } from 'firebase/database';

const browser = detect();

type Input = {
  label: string
  value: string
  onChange: (e: CustomEvent<InputChangeEventDetail>) => void
  type?: 'email' | 'password'
};
const Input = ({ label, value, onChange, type }: Input) => <IonItem>
  <IonLabel position='floating'>{label}</IonLabel>
  <IonInput value={value} onIonChange={onChange} type={type} />
</IonItem>

type Props = {
  onLogin: () => void
}


export const Login: FC<Props> = ({ onLogin }) => {
  const { login, errors } = useTranslation()
  const popupManager = usePopupManager()
  const toaster = useToaster()
  const auth = useAuth()
  const hashController = useHashController()
  const db = useDatabase()

  const [loading, setLoading] = useState(false)
  const [emailState, setEmailState] = useState({
    step: 'input' as 'input' | 'register' | 'password',
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
    hashController.remove('modal');
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

      setEmailState(state => ({
        ...state,
        step: 'input'
      }));
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
    setEmailState(state => ({
      ...state,
      step: 'input',
    }));
    hashController.set('modal', 'sign-in-with-email');
  }

  const beginRegisterUser = () => setEmailState(state => ({
    ...state,
    step: 'register',
  }));

  const beginResetPassword = () => setEmailState(state => ({
    ...state,
    step: 'password',
  }));

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

  const resetStep = () => setEmailState(state => ({
    ...state,
    step: 'input'
  }))

  return (
    <IonContent color='primary' class='login' fullscreen>
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
      <Modal
        id='sign-in-with-email'
        onDismiss={resetStep}
        color='secondary'
        header={
          <IonTitle>
            {login['sign-in-with-email']}
          </IonTitle>
        }
      >
        <IonContent>
          <IonList inset>
            {emailState.step === 'register' &&

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
            {emailState.step !== 'password' &&
              <Input
                label={login.password}
                value={emailState.password}
                onChange={changePassword}
                type='password'
              />
            }
          </IonList>
          {emailState.step === 'input' &&
            <IonButton
              fill='clear'
              expand='full'
              disabled={!(emailState.password && emailState.email)}
              onClick={signInWithEmail}
            >
              {login['sign-in']}
            </IonButton>
          }
          {emailState.step === 'register' &&
            <IonButton
              expand='full'
              fill='clear'
              disabled={!(emailState.password && emailState.email && emailState.name)}
              onClick={registerUser}
            >
              {login.register}
            </IonButton>
          }
          {emailState.step === 'password' &&
            <IonButton
              expand='full'
              fill='clear'
              disabled={!emailState.email}
              onClick={resetPassword}
            >
              {login['reset-password']}
            </IonButton>
          }
          {emailState.step === 'input' &&
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
      </Modal>
    </IonContent>
  )
}
