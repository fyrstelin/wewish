import { IonBackButton, IonButtons } from "@ionic/react";
import { FC } from "react";

export const BackButton: FC<{ children?: string }> = ({ children }) => {
  return (
    <IonButtons slot='start'>
      <IonBackButton defaultHref={children ?? '/'} text=''/>
    </IonButtons>
  )
}
