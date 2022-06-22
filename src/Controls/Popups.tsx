import { createContext, useState, useRef, useCallback, useContext, FC, PropsWithChildren } from 'react';
import { useTranslation } from '../Localization';
import { IonAlert } from '@ionic/react';

type Confirm = {
  title: string
  message: string
  yes?: string
  no?: string
};

type Manager = {
  confirm: (options: Confirm) => Promise<boolean>
};

type Task = {
  title: string
  message: string
  yes?: string
  no?: string
  resolve: (accepts: boolean) => void
}

const Context = createContext<Manager>(null as any)

export const usePopupManager = () => useContext(Context)

export const Popups: FC<PropsWithChildren> = ({ children }) => {
  const [task, setTask] = useState<Task | null>(null)
  const { controls } = useTranslation()

  const handleClose = useCallback(() => {
    if (task) {
      task.resolve(false);
      setTask(null)
    }
  }, [task])

  const handleOk = useCallback(() => {
    if (task) {
      task.resolve(true);
      setTask(null)
    }
  }, [task])

  const { current: manager } = useRef<Manager>({
    confirm: (options: Confirm) => new Promise(resolve =>
      setTask({
        title: options.title,
        message: options.message,
        yes: options.yes,
        no: options.no,
        resolve: x => resolve(x)
      })
    )
  })

  return <Context.Provider value={manager}>
    <IonAlert
      isOpen={!!task}
      onDidDismiss={handleClose}
      header={task ? task.title : ''}
      message={task ? task.message : ''}
      buttons={[
        {
          text: (task && task.no) || controls.popups.cancel,
          role: 'cancel',
          handler: handleClose
        },
        {
          text: (task && task.yes) || controls.popups.ok,
          handler: handleOk
        }
      ]}
    />
    {children}
  </Context.Provider>
}
