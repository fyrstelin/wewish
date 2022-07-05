import * as Models from './Models';
import * as StringInput from '../Controls/StringInput';
import * as SelectInput from '../Controls/SelectInput';
import { Lang, supportedLangs, WithTranslation } from '../Localization';
import { WithToaster } from '../Controls/Toaster';
import { Provider } from '../User';
import { ConnectPassword } from './ConnectPassword';
import { IonList, IonItem, IonLabel, IonToggle, IonPopover, IonListHeader } from '@ionic/react';
import { PureComponent } from 'react';

export type UserUpdate = {
  name?: string
  birthday?: string
  lang?: Lang
  enablePush?: boolean
};

type Props = {
  user: Models.User
  onSave: (user: UserUpdate) => Promise<void>
  onResetTutorial: () => Promise<void>
  onConnect: (provider: Provider, email?: string, password?: string) => void
  onDisconnect: (provider: Provider) => void
};
type State = {
  name: StringInput.Model
  birthday: StringInput.Model
  lang: SelectInput.Model
  dialog?: 'connect-password'
};

const format = (lang: string): string => ({
  'da': 'Dansk',
  'en': 'English'
} as any)[lang]

type ConnectionProps = {
  children: string
  id: Provider
  providers: ReadonlyArray<Provider>
  onConnect: (provider: Provider) => void
  onDisconnect: (provider: Provider) => void
};
class Connection extends PureComponent<ConnectionProps> {
  private change = () =>
    this.props.providers.indexOf(this.props.id) === -1
      ? this.props.onConnect(this.props.id)
      : this.props.onDisconnect(this.props.id)

  render() {
    const { children, id, providers } = this.props;
    return (
      <IonItem>
        <IonLabel>{children}</IonLabel>

        <IonToggle
          checked={providers.indexOf(id) !== -1}
          onIonChange={this.change}
          slot='end'
          disabled={providers.length === 1 && providers[0] === id}
        />
      </IonItem>
    );
  }
}

type PProps = Props & WithTranslation & WithToaster;

export const UserSettings =
  WithTranslation(
    WithToaster(
      class UserSettings extends PureComponent<PProps, State> {

        constructor(props: PProps) {
          super(props);

          this.state = {
            name: StringInput.Initialize(props.user.name),
            birthday: StringInput.Initialize(props.user.birthday),
            lang: SelectInput.Initialize(props.user.lang),
          };
        }

        UNSAFE_componentWillReceiveProps(nextProps: Props) {
          this.setState(state => ({
            name: StringInput.Update(state.name, nextProps.user.name),
            birthday: StringInput.Update(state.birthday, nextProps.user.birthday),
            lang: SelectInput.Update(state.lang, nextProps.user.lang)
          }));
        }

        private save = async () => {
          const { name, birthday } = this.state;
          await this.props.onSave({
            ...StringInput.Values({ name, birthday, }),
          });
          this.setState({
            name: StringInput.Flush(name),
            birthday: StringInput.Flush(birthday),
          });
        }

        private onNameChange = (name: StringInput.Model) => this.setState({ name })
        private onBithdayChange = (birthday: StringInput.Model) => this.setState({ birthday })
        private onLangChange = async (lang: SelectInput.Model) => {
          this.setState({ lang });
          await this.props.onSave({
            lang: SelectInput.Value(lang) as Lang
          });
          this.setState({
            lang: SelectInput.Flush(lang)
          });
        }

        private beginConnectPassword = () =>
          this.setState({
            dialog: 'connect-password'
          })

        private abortConnectPassord = () =>
          this.setState({
            dialog: undefined
          });

        private completeConnectPassword = (email: string, password: string) => {
          this.setState({
            dialog: undefined
          });
          this.props.onConnect('password', email, password);
        }

        render() {
          const { onResetTutorial, user, onConnect, onDisconnect } = this.props;
          const { name, birthday, lang, dialog } = this.state;
          const { userSettings } = this.props.translation;
          const { providers } = user;

          return (
            <>
              <IonList lines='none'>
                <IonItem>
                  <StringInput.StringInput
                    model={name}
                    onChange={this.onNameChange}
                    label={userSettings.name}
                    onBlur={this.save}
                  />
                </IonItem>
                <IonItem>
                  <StringInput.StringInput
                    model={birthday}
                    type='date'
                    onChange={this.onBithdayChange}
                    label={userSettings.birthday}
                    onBlur={this.save}
                  />
                </IonItem>

                <IonItem>
                  <SelectInput.SelectInput
                    fullWidth
                    model={lang}
                    onChange={this.onLangChange}
                    source={supportedLangs}
                    label={userSettings.lang}
                    format={format}
                  />
                </IonItem>

                <IonListHeader color='light'>{userSettings['connected-to']} {user.email ? `(${user.email})` : ''}</IonListHeader>
                <Connection
                  id='google.com'
                  providers={providers}
                  onConnect={onConnect}
                  onDisconnect={onDisconnect}
                >Google</Connection>
                <Connection
                  id='facebook.com'
                  providers={providers}
                  onConnect={onConnect}
                  onDisconnect={onDisconnect}
                >Facebook</Connection>
                <Connection
                  id='password'
                  providers={providers}
                  onConnect={this.beginConnectPassword}
                  onDisconnect={onDisconnect}
                >{userSettings['connect-password'].password}</Connection>



                <IonItem color='light'>
                  <IonLabel>{userSettings['push-enabled']}</IonLabel>
                  <IonToggle
                    checked={user.pushEnabled || false}
                    onIonChange={x => this.props.onSave({
                      enablePush: x.detail.checked
                    })}
                    slot='end'
                  />
                </IonItem>

                <IonListHeader color='light'>
                  {userSettings['danger-zone']}
                </IonListHeader>

                <IonItem button onClick={onResetTutorial}>
                  <IonLabel>{userSettings['reset-tutorial']}</IonLabel>
                </IonItem>
              </IonList>

              <IonPopover isOpen={dialog === 'connect-password'} onDidDismiss={this.abortConnectPassord}>
                <ConnectPassword
                  email={user.email}
                  onConnect={this.completeConnectPassword}
                />
              </IonPopover>
            </>
          );
        }
      }));
