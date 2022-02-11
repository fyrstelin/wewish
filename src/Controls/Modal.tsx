import React from 'react';
import { IonModal, IonToolbar, IonHeader, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core';
import { WithHash, WithHashController } from '../Utils/Hash';
import { close } from 'ionicons/icons';

type Props = {
    id: string,
    color?: string,
    header?: React.ReactNode
    children: React.ReactNode
    onDismiss?: () => void
};

export const Modal = 
    WithHashController(
    WithHash(({ id, children, header, color, onDismiss, hash, hashController }: Props & WithHash & WithHashController) => {

    const [ initialized, setInitialized ] = React.useState(false);

    const dismiss = (e: CustomEvent<OverlayEventDetail>) => {
        if (e.detail.role) {
            hashController.remove('modal');
        }
        if (onDismiss) {
            onDismiss();
        }
    };

    React.useEffect(() => {
        setInitialized(true);
    }, []);

    const closeFn = () => hashController.remove('modal');
    return (
        <IonModal isOpen={initialized && hash['modal']===id} onDidDismiss={dismiss}>
            <IonHeader>
                <IonToolbar color={color}>
                    <IonButtons slot='start'>
                        <IonButton onClick={closeFn}>
                            <IonIcon icon={close}/>
                        </IonButton>
                    </IonButtons>
                    {header}
                </IonToolbar>
            </IonHeader>
            {children}
        </IonModal>
    );
}));