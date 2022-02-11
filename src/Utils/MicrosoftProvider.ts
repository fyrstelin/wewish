import * as Firebase from 'firebase/app';
import 'firebase/auth';

const OAuthProvider: new(id: string) => Firebase.auth.OAuthProvider = Firebase.auth.OAuthProvider;

export class MicrosoftProvider extends OAuthProvider {
    constructor() {
        super('microsoft.com');
    }
}