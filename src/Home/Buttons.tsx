import { FC, useState, useRef, MouseEvent } from 'react';
import { useUser } from '../User/UserProvider';
import { useTranslation } from '../Localization';
import { IonButton, IonIcon, IonPopover, IonList, IonContent, IonLabel, IonItem, IonButtons } from '@ionic/react';
import { personSharp, settingsSharp, exitSharp, informationSharp } from 'ionicons/icons';

type Props = {
  onLogout: () => void
};

export const Buttons: FC<Props> = ({ onLogout }) => {
  const { user } = useUser()
  const { home } = useTranslation()

  const [event, setEvent] = useState<Event>()

  const popoverRef = useRef<HTMLIonPopoverElement | null>(null)

  const closeMenu = () => {
    setEvent(undefined)
  };

  const openMenu = (e: MouseEvent) => {
    e.persist();
    setEvent(e.nativeEvent)
  };

  return (
    user && <IonButtons slot='end'>
      <IonButton onClick={openMenu}>
        <IonIcon icon={personSharp} slot='icon-only'/>
      </IonButton>
      <IonPopover
        ref={popoverRef}
        isOpen={!!event}
        onWillDismiss={closeMenu}
        event={event}
        showBackdrop={false}
      >
        <IonContent>
          <IonList lines='none'>
            <IonItem routerLink='/user-settings' detail={false} onClick={closeMenu}>
              <IonIcon icon={settingsSharp} slot='start' />
              <IonLabel>{home.settings}</IonLabel>
            </IonItem>
            <IonItem routerLink='/about' detail={false} onClick={closeMenu}>
              <IonIcon icon={informationSharp} slot='start' />
              <IonLabel>{home.about}</IonLabel>
            </IonItem>
            <IonItem onClick={() => {
              closeMenu()
              onLogout()
            }}>
              <IonIcon icon={exitSharp} slot='start' />
              <IonLabel>{home['sign-out']}</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </IonButtons>
  )
}
