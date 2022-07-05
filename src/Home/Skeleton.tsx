import { IonList } from "@ionic/react"
import { Divider, Item } from "../Controls/Skeletons"

export const Skeleton = () => {
  return (
    <IonList>
      <Divider />
      <Item />
      <Item />
      <Divider />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </IonList>
  )
}
