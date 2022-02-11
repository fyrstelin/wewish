import React from 'react';
import { Provider } from './Provider';
import { UserSettings, UserUpdate } from './UserSettings';
import { Patch } from '../Utils';
import { WithAuth } from '../Firebase/Auth';
import { WithDatabase } from '../Firebase/Database';
import { Provider as AuthProvider } from '../User';
import { detect } from 'detect-browser';
import * as Firebase from 'firebase/app';
import 'firebase/auth';
import { WithToaster } from '../Controls/Toaster';
import { WithTranslation } from '../Localization';
import { MicrosoftProvider } from '../Utils/MicrosoftProvider';

const browser = detect();

const Providers: Dictionary<new () => Firebase.auth.AuthProvider> = {
    'google.com': Firebase.auth.GoogleAuthProvider,
    'facebook.com': Firebase.auth.FacebookAuthProvider,
    'microsoft.com': MicrosoftProvider
};

export const Root = 
    WithDatabase<{}>(
    WithToaster(
    WithTranslation(
    WithAuth(
        class Root extends React.PureComponent<WithDatabase & WithAuth & WithToaster & WithTranslation> {
        private save = async (update: UserUpdate) => {
            const userId = this.props.auth.currentUser!.uid;
            await this.props.database.ref().update(Patch({
                [`users/${userId}/name`]: update.name,
                [`users/${userId}/birthday`]: update.birthday,
                [`users/${userId}/lang`]: update.lang,
                [`users/${userId}/pushEnabled`]: update.enablePush
            }));
        };

        private resetTutorial = async () => {
            const userId = this.props.auth.currentUser!.uid;
            await this.props.database.ref().update({
                [`/users/${userId}/skills`]: null
            });
        }

        private connect = async (providerId: AuthProvider, email?: string, password?: string) => {
            const errors: any = this.props.translation.errors;

            try {
                if (providerId === 'password') {
                    if (email && password) {
                        const user = this.props.auth.currentUser!;
                        await user.linkAndRetrieveDataWithCredential(Firebase.auth.EmailAuthProvider.credential(email, password));
                    }
                } else {
                    const Provider = Providers[providerId];
                    const provider = new Provider();
                    const user = this.props.auth.currentUser!;
                    if (browser && browser.os && browser.os !== 'iOS') {
                        await user.linkWithPopup(provider);
                    } else {
                        await user.linkWithRedirect(provider);
                    }
                }
            } catch (e) {
                this.props.toaster.next({
                    message: errors[e.code] || e.message,
                    variant: 'danger'
                });
            }
            this.forceUpdate();
        }

        private disconnect = async (provider: AuthProvider) => {
            await this.props.auth.currentUser!.unlink(provider)
            this.forceUpdate();
        }

        render() {
            return (
                <Provider render={user =>
                    <UserSettings user={user} 
                        onSave={this.save} 
                        onResetTutorial={this.resetTutorial}
                        onConnect={this.connect}
                        onDisconnect={this.disconnect}
                    />
                }/>
            );
        }
    }
))));