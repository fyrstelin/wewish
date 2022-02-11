import React, { FC } from 'react';
import { useHistory } from '../Utils/History';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import './index.css';
import { arrowBack } from 'ionicons/icons';

type Props = {
  title: string | undefined
  parent: string | undefined
  rightContent: React.ReactNode | undefined
};

export const Header: FC<Props> = ({ title, parent, rightContent, children }) => {
  const history = useHistory()

  const up = () => {
    if (parent) {
      history.up(parent);
    }
  }

  return (
    <IonHeader class='non-printable'>
      <IonToolbar color='primary'>
        {parent === undefined
          ? null
          : <IonButtons slot='start'>
            <IonButton onClick={up}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        }

        <IonTitle>
          {title}
        </IonTitle>
        <IonButtons slot='end'>
          {rightContent}
        </IonButtons>
      </IonToolbar>
      {children}
    </IonHeader>
  )
}
