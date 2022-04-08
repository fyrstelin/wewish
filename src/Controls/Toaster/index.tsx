import { FC, useMemo, useState, useEffect, ComponentType } from 'react';
import { Context } from './context';
import { Subject, Observable, Observer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Toast } from './Toast';
import { IonToast } from '@ionic/react';
export { useToaster } from './context'

const DISPLAY_TIME = 7500;
const DELAY_TIME = 500;

export type WithToaster = { toaster: Observer<Toast> };
export const WithToaster = <TProps extends any>(Component: ComponentType<TProps & WithToaster>) => {
  return (props: TProps) => <Context.Consumer>{toaster =>
    <Component toaster={toaster} {...props} />
  }</Context.Consumer>
}

export const Toaster: FC = ({ children }) => {
  const toasts = useMemo(() => new Subject<Toast>(), [])
  const [toast, setToast] = useState<Toast>()

  useEffect(() => {
    const s = toasts
      .pipe(concatMap(toast => new Observable<Toast | undefined>(stream => {

        stream.next(toast);

        const t1 = setTimeout(() => {
          stream.next(undefined);
        }, DISPLAY_TIME);
        const t2 = setTimeout(() => {
          stream.complete();
        }, DISPLAY_TIME + DELAY_TIME);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        }
      })))
      .subscribe(toast => setToast(toast));

    return () => s.unsubscribe()
  }, [toasts])

  return (
    <Context.Provider value={toasts}>
      {children}
      <IonToast
        isOpen={!!toast}
        color={(toast && toast.variant) || 'tertiary'}
        message={toast && toast.message}
        buttons={toast && toast.action
          ? [{
            side: 'end',
            icon: toast.action.icon as any as string,
            handler: toast.action.onClick
          }]
          : []}
      />
    </Context.Provider>
  );
}
