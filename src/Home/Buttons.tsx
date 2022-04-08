import { FC, useState, useRef, useLayoutEffect, MouseEvent } from 'react';
import { useUser } from '../User/UserProvider';
import { useTranslation } from '../Localization';
import { IonButton, IonIcon, IonPopover, IonList, IonContent, IonLabel } from '@ionic/react';
import { Item } from '../Controls/Item';
import { person, settings, exit, informationCircle } from 'ionicons/icons';

type Props = {
  onLogout: () => void
};

export const Buttons: FC<Props> = ({ onLogout }) => {
  const { user } = useUser()
  const { home } = useTranslation()

  const [event, setEvent] = useState<Event>()

  const popoverRef = useRef<HTMLIonPopoverElement | null>(null)
  const mountedRef = useRef(true)

  useLayoutEffect(() => () => {
    mountedRef.current = false
    popoverRef.current?.dismiss()
  }, [])

  const closeMenu = () => {
    if (!mountedRef.current) {
      return;
    }
    setEvent(undefined)
  };

  const openMenu = (e: MouseEvent) => {
    e.persist();
    setEvent(e.nativeEvent)
  };

  return (
    user && <>
      <IonButton
        onClick={openMenu}
      >
        <IonIcon icon={person} />
      </IonButton>
      <IonPopover
        ref={popoverRef}
        isOpen={!!event}
        onDidDismiss={closeMenu}
        event={event}
        showBackdrop={false}
      >
        <IonContent>
          <IonList lines='none'>
            <Item href='/user-settings' detail={false}>
              <IonIcon icon={settings} slot='start' />
              <IonLabel>{home.settings}</IonLabel>
            </Item>
            <Item href='/about' detail={false}>
              <IonIcon icon={informationCircle} slot='start' />
              <IonLabel>{home.about}</IonLabel>
            </Item>
            <Item onClick={onLogout}>
              <IonIcon icon={exit} slot='start' />
              <IonLabel>{home['sign-out']}</IonLabel>
            </Item>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  )
}