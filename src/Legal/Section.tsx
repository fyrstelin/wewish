import { FC, PropsWithChildren } from 'react';
import { IonCardContent } from '@ionic/react';

export const Section: FC<PropsWithChildren> = ({ children }) =>
  <IonCardContent>
    {children}
  </IonCardContent>
