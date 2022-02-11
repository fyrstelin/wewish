import React, { useContext } from 'react';
import { Observer, Subject } from 'rxjs';
import { Toast } from './Toast';

const toaster: Observer<Toast> = new Subject<Toast>();
export const Context = React.createContext(toaster);

export const useToaster = () => useContext(Context)
