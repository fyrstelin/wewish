import { Id } from '../Utils';
import * as Models from './Models';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonIcon } from '@ionic/react';
import './style.css';
import { checkmark, close, add, remove } from 'ionicons/icons';
import { memo, useState } from 'react';

type Props = {
  open: boolean
  onClose: () => Promise<void>
  onBought: (amount: number) => void
  wish: Models.PublicWish
};

export const BoughtPopup =
  memo(({ onClose, open, wish, onBought }: Props) => {
    const [amount, setAmount] = useState(1);
    const [titleId] = useState(Id);

    const amountLeft = wish.amount === 'unlimited'
      ? 1
      : wish.amount - wish.amountBought;

    const dec = () => setAmount(x => x - 1);
    const inc = () => setAmount(x => x + 1);

    const handleOk = () => {
      onBought(amount);
      onClose();
    }

    const didDismiss = () => {
      setAmount(1);
      onClose();
    }

    return (
      <IonModal
        isOpen={open}
        onDidDismiss={didDismiss}
        aria-labelledby={titleId}
      >
        <IonHeader>
          <IonToolbar color='secondary'>
            <IonTitle id={titleId}>{wish.name}</IonTitle>

            <IonButtons slot='primary'>
              <IonButton onClick={handleOk}>
                <IonIcon slot='icon-only' icon={checkmark} />
              </IonButton>
            </IonButtons>
            <IonButtons slot='secondary'>
              <IonButton onClick={onClose}>
                <IonIcon slot='icon-only' icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent
          class='bought-popup'
        >
          <div className='controls'>
            <IonButton
              onClick={dec}
              disabled={amount === 1}
              fill='clear'
              color='dark'
              size='large'
            >
              <IonIcon slot='icon-only' icon={remove} />
            </IonButton>
            <div className='amount'>{amount}</div>
            <IonButton
              disabled={amount === amountLeft}
              onClick={inc}
              fill='clear'
              color='dark'
              size='large'
            >
              <IonIcon slot='icon-only' icon={add} />
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    );
  }
  );
