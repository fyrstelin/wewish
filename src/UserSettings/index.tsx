import { useState } from 'react';
import { Provider } from './Provider';
import { UserSettings, UserUpdate } from './UserSettings';
import { Patch } from '../Utils';
import { useAuth, useDatabase } from '../Firebase';
import { Provider as AuthProvider } from '../User';
import { detect } from 'detect-browser';
import {
  AuthProvider as FirebaseAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  EmailAuthProvider,
  linkWithPopup,
  linkWithRedirect,
  unlink,
  linkWithCredential
} from 'firebase/auth';
import { useToaster } from '../Controls/Toaster';
import { useTranslation } from '../Localization';
import { ref, update } from 'firebase/database';

const browser = detect();

const Providers: Dictionary<new () => FirebaseAuthProvider> = {
  'google.com': GoogleAuthProvider,
  'facebook.com': FacebookAuthProvider,
};

export const Root = () => {
  const auth = useAuth()
  const db = useDatabase()
  const translation = useTranslation()
  const toaster = useToaster()

  const [updateCount, setUpdateCount] = useState(0)

  const forceUpdate = () => setUpdateCount(updateCount + 1)

  const save = async (input: UserUpdate) => {
    const userId = auth.currentUser!.uid;
    await update(ref(db), Patch({
      [`users/${userId}/name`]: input.name,
      [`users/${userId}/birthday`]: input.birthday,
      [`users/${userId}/lang`]: input.lang,
      [`users/${userId}/pushEnabled`]: input.enablePush
    }));
  };

  const resetTutorial = async () => {
    const userId = auth.currentUser!.uid;
    await update(ref(db), {
      [`/users/${userId}/skills`]: null
    });
  }

  const connect = async (providerId: AuthProvider, email?: string, password?: string) => {
    const errors: any = translation.errors;

    try {
      if (providerId === 'password') {
        if (email && password) {
          const user = auth.currentUser!;
          await linkWithCredential(user, EmailAuthProvider.credential(email, password))
        }
      } else {
        const Provider = Providers[providerId];
        const provider = new Provider();
        const user = auth.currentUser!;
        if (browser && browser.os && browser.os !== 'iOS') {
          await linkWithPopup(user, provider)
        } else {
          await linkWithRedirect(user, provider)
        }
      }
    } catch (e: any) {
      toaster.next({
        message: errors[e.code] || e.message,
        variant: 'danger'
      });
    }
    forceUpdate();
  }

  const disconnect = async (provider: AuthProvider) => {
    await unlink(auth.currentUser!, provider)
    forceUpdate();
  }

  return (
    <Provider render={user =>
      <UserSettings user={user}
        onSave={save}
        onResetTutorial={resetTutorial}
        onConnect={connect}
        onDisconnect={disconnect}
      />
    } />
  );
}
