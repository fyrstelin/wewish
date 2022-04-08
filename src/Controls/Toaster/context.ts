import { createContext, useContext } from 'react';
import { Observer, Subject } from 'rxjs';
import { Toast } from './Toast';

const toaster: Observer<Toast> = new Subject<Toast>();
export const Context = createContext(toaster);

export const useToaster = () => useContext(Context)
