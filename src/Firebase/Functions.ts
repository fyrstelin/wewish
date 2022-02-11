import { useCallback } from 'react';
import * as App from './App';
import 'firebase/functions';

export const useFunction = (name: string) => {
  const functions = App.useApp().functions()
  return useCallback(functions.httpsCallable(name), [name, functions])
}
