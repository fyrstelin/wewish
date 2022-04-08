import { WithTranslation } from '../Localization';
import { IonHeader, IonContent, IonButtons, IonInput, IonButton, IonItem, IonLabel } from '@ionic/react';
import { InputChangeEventDetail } from '@ionic/core';
import { PureComponent } from 'react';

type Props = {
  email: string | undefined
  onConnect: (email: string, password: string) => void
};
type State = {
  email: string | undefined
  password: string
};

export const ConnectPassword =
  WithTranslation(
    class ConnectPassword extends PureComponent<Props & WithTranslation, State> {
      state: State = {
        email: undefined,
        password: ''
      }

      private setEmail = (e: CustomEvent<InputChangeEventDetail>) => this.setState({
        email: e.detail.value || undefined
      });
      private setPassword = (e: CustomEvent<InputChangeEventDetail>) => this.setState({
        password: e.detail.value || ''
      });

      private connect = () => {
        this.props.onConnect(this.state.email || this.props.email!, this.state.password);
        this.setState({
          email: undefined,
          password: ''
        })
      }

      render() {
        const { controls } = this.props.translation;
        const connectPassword = this.props.translation.userSettings['connect-password'];
        const { email, password } = this.state;
        return (
          <>
            <IonHeader>{connectPassword.title}</IonHeader>
            <IonContent fullscreen>
              <IonItem>
                <IonLabel position='floating'>{connectPassword.email}</IonLabel>
                <IonInput
                  value={email || this.props.email || ''}
                  disabled={!!this.props.email}
                  onIonChange={this.setEmail}
                />
              </IonItem>
              <IonItem>
                <IonLabel position='floating'>{connectPassword.password}</IonLabel>
                <IonInput
                  type='password'
                  value={password}
                  onIonChange={this.setPassword}
                />
              </IonItem>
            </IonContent>
            <IonButtons>
              <IonButton
                color='primary'
                disabled={!((email || this.props.email) && password)}
                onClick={this.connect}
              >{controls.popups.ok}</IonButton>
            </IonButtons>
          </>
        );
      }
    }
  );
