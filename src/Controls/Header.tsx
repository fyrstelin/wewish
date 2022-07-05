import { IonHeader, IonToolbar } from "@ionic/react";
import { FC, PropsWithChildren } from "react";

export const Header: FC<PropsWithChildren> = ({ children}) => {
  return <IonHeader>
    <IonToolbar color='primary'>
      {children}
    </IonToolbar>
  </IonHeader>
}
