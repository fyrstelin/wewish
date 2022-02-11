import React from 'react';
import { IonApp, IonSpinner } from '@ionic/react'

import { Auth, User } from './Firebase';
import { Signin } from './Signin';

export const App = () => {

  const [ user, setUser ] = React.useState<User | null | undefined>(undefined);

  React.useEffect(() => Auth.onAuthStateChanged(setUser), []);

  return (
    <IonApp>
    { user === undefined && <IonSpinner/> }
    { user === null && <Signin/>}
    { user && <h1 onClick={() => Auth.signOut()}>Hurra</h1>}
    </IonApp>
  );
}
