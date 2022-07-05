import * as App from './App';
import { getMessaging } from 'firebase/messaging';

export const useMessaging = () => getMessaging(App.useApp())
