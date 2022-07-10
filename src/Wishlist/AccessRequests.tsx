import * as Models from './Models';
import { IonTitle, IonButtons, IonIcon, IonButton, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useTranslation } from '../Localization';
import { closeSharp, checkmarkSharp } from 'ionicons/icons';
import { FC } from 'react';
import { Modal } from '../Controls/Modal';

type Props = {
  onAccept: (id: AccessRequestId) => Promise<void>
  onReject: (id: AccessRequestId) => Promise<void>
  accessRequests: ReadonlyArray<Models.AccessRequest>
}

export const AccessRequests: FC<Props> = ({
  onAccept,
  onReject,
  accessRequests
}) => {
    const { wishlist, utils } = useTranslation()
    return (
      <Modal
        id='access-requests' 
        header={<IonTitle>{wishlist['access-requests']}</IonTitle>}
      >
        <IonContent>
          <IonList>{accessRequests.map(request =>
            <IonItem key={request.id}>
              <IonLabel>{request.name ?? utils.noname}</IonLabel>
              <IonButtons slot='end'>
                <IonButton onClick={() => onReject(request.id)}>
                  <IonIcon
                    slot='icon-only'
                    icon={closeSharp}
                    color='danger'
                  />
                </IonButton>
                <IonButton onClick={() => onAccept(request.id)}>
                  <IonIcon
                    slot='icon-only'
                    icon={checkmarkSharp}
                    color='success'
                  />
                </IonButton>
              </IonButtons>
            </IonItem>)
          }</IonList>
        </IonContent>
      </Modal>
    )
}
