import React, { FC } from 'react';
import { IonCardContent } from '@ionic/react';

export const Section: FC = ({ children }) =>
  <IonCardContent>
    {children}
  </IonCardContent>
  