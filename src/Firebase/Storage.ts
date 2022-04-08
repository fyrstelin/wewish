import * as App from './App';
import { getStorage } from 'firebase/storage';

export const useStorage = () => getStorage(App.useApp())
