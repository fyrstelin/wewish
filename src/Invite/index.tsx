import { FC } from 'react';
import { QueryInvite } from './Provider';
import { useTranslation } from '../Localization';
import { useFunction } from '../Firebase';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, useIonRouter, IonPage, IonTitle, IonContent } from '@ionic/react';
import { useStream } from '../Utils/useStream';
import { Header } from '../Controls/Header';
import { BackButton } from '../Controls/BackButton';
import { Loader } from '../Controls/Loader';

type Props = {
  code: string
};

export const Invite: FC<Props> = ({ code }) => {
  const state = useStream(QueryInvite(code))
  const { invite } = useTranslation()
  const redeemInvite = useFunction('redeemInvite')
  const router = useIonRouter()

  const accept = async () => {
    await redeemInvite({ code });
    router.push('/', 'root', 'replace')
  }

  return (
    <IonPage>
      <Header>
        <BackButton>/</BackButton>
        <IonTitle>{invite['page-title']}</IonTitle>
      </Header>
      <IonContent>
        {
          state
            ? state.title !== undefined
              ? <IonCard>
                <IonCardHeader>
                  <IonCardTitle>{state.title}</IonCardTitle>
                  <IonCardSubtitle>{state.owners.join(', ')}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton expand='full'onClick={accept}>{invite.accept}</IonButton>
                </IonCardContent>
              </IonCard>
              : <h4>{invite['not-found']}</h4>
            : <Loader/>
        }
      </IonContent>
    </IonPage>
  )
}
