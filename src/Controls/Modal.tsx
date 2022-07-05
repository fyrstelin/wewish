import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { IonModal, IonToolbar, IonHeader, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core';
import { Hash, useHash, useHashController } from '../Utils/Hash';
import { closeSharp } from 'ionicons/icons';

type Props = {
  id: string
  color?: 'primary' | 'secondary' | 'tertiary'
  header?: ReactNode
  children: ReactNode
  onDismiss?: () => void
};

export const useModalController = (modal: string): [(args?: Hash) => void, () => void] => {
  const hashController = useHashController()

  return [
    useCallback((args: Hash = {}) => {
      hashController.patch({
        ...args,
        modal
      })
    }, [hashController, modal]),
    useCallback(() => {
      window.history.back()
    }, [])
  ]
}


export const Modal: FC<Props> = ({ id, children, header, color, onDismiss }) => {
  const [initialized, setInitialized] = useState(false);
  const [openModalId] = useHash<string>('modal')
  
  // nasty hack
  const blocked = useRef(false)

  const dismiss = (e: CustomEvent<OverlayEventDetail>) => {
    if (blocked.current) {
      return
    }
    if (e.detail.role) {
      window.history.back()
    }
    if (onDismiss) {
      onDismiss();
    }

    blocked.current = true
    setTimeout(() => {
      blocked.current = false
    }, 100)
  };

  useEffect(() => {
    setInitialized(true);
  }, []);

  return (
    <IonModal isOpen={initialized && openModalId === id} onDidDismiss={dismiss}>
      <IonHeader>
        <IonToolbar color={color ?? 'secondary'}>
          <IonButtons slot='start'>
            <IonButton onClick={() => window.history.back()}>
              <IonIcon icon={closeSharp} slot='icon-only'/>
            </IonButton>
          </IonButtons>
          {header}
        </IonToolbar>
      </IonHeader>
      {children}
    </IonModal>
  );
}
