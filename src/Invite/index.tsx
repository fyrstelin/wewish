import { FC } from 'react';
import { QueryInvite } from './Provider';
import { Page } from '../Page';
import { useTranslation } from '../Localization';
import { useHistory } from '../Utils/History';
import { useFunction } from '../Firebase';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonProgressBar } from '@ionic/react';
import { useStream } from '../Utils/useStream';

type Props = {
  code: string
};

export const Invite: FC<Props> = ({ code }) => {
  const state = useStream(QueryInvite(code))
  const { invite } = useTranslation()
  const redeemInvite = useFunction('redeemInvite')
  const history = useHistory()

  const accept = async () => {
    await redeemInvite({ code });
    history.up('/');
  }

  return state
    ? <Page title={invite['page-title']} parent='/'>{state.title !== undefined
      ? <IonCard>
        <IonCardHeader>
          <IonCardTitle>{state.title}</IonCardTitle>
          <IonCardSubtitle>{state.owners.join(', ')}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            color='primary'
            fill='clear'
            onClick={accept}
          >{invite.accept}</IonButton>
        </IonCardContent>
      </IonCard>
      : <h4>{invite['not-found']}</h4>
    } </Page>
    : <Page>
      <IonProgressBar type='indeterminate' color='secondary' />
    </Page>
}
