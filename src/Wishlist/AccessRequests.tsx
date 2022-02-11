import React from 'react';
import * as Models from './Models';
import { IonModal, IonToolbar, IonTitle, IonButtons, IonIcon, IonButton, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { Id } from '../Utils';
import { WithTranslation } from '../Localization';
import { close, checkmark } from 'ionicons/icons';

type Props = {
    isOpen: boolean
    onClose: () => void,
    onAccept: (uid: string) => Promise<void>
    onReject: (uid: string) => Promise<void>
    accessRequests: ReadonlyArray<Models.AccessRequest>
}

export const AccessRequests = 
    WithTranslation(({isOpen, onClose, translation, accessRequests, onAccept, onReject}: Props & WithTranslation) => {
    const [ titleId ] = React.useState(Id);
    const { wishlist } = translation;
    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onClose}
            aria-labelledby={titleId}
        >
            <IonToolbar color='secondary'>
                <IonTitle id={titleId}>{wishlist['access-requests']}</IonTitle>

                <IonButtons slot='secondary'>
                    <IonButton onClick={onClose}>
                        <IonIcon slot='icon-only' icon={close}/>
                    </IonButton>
                </IonButtons>
            </IonToolbar>

            <IonContent>
                <IonList>{accessRequests.map(request => 
                    <IonItem key={request.id}>
                        <IonLabel>{request.name}</IonLabel>
                        <IonButtons slot='end'>
                            <IonButton onClick={() => onReject(request.id)}>
                                <IonIcon 
                                    slot='icon-only' 
                                    icon={close}
                                    color='danger'
                                />
                            </IonButton>
                            <IonButton onClick={() => onAccept(request.id)}>
                                <IonIcon
                                    slot='icon-only'
                                    icon={checkmark}
                                    color='success'
                                />
                            </IonButton>
                        </IonButtons>
                    </IonItem>)
                }</IonList>
            </IonContent>
        </IonModal>
    );
})