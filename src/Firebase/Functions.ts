import { getFunctions, httpsCallable } from 'firebase/functions';

export const useFunction = (name: string) => {
  const functions = getFunctions()
  return httpsCallable(functions, name)
}
