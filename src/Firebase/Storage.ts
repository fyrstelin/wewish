import * as App from './App';
import 'firebase/storage';

export const useStorage = () => App.useApp().storage()
