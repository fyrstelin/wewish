import { ApiProvider } from "./Api";
import { Process } from './Process';
import { QueryWishlist } from './Provider';
import { Wishlist } from './Wishlist';
import { useStream } from '../Utils/useStream';
import { Page } from '../Page';
import { IonList } from '@ionic/react';
import { Divider, Item } from '../Controls/Skeletons';

type Props = { id: string, wishId?: string };
export const Root = ({ id, wishId }: Props) => {
  const wishlist = useStream(QueryWishlist(id))

  return wishlist
    ? <ApiProvider wishlistId={id}>
      <Process wishlistId={id} />
      <Wishlist
        wishlist={wishlist}
        openWishId={wishId}
      />
    </ApiProvider>
    : <Page parent='/'>
      <IonList>
        <Divider />
        <Item withAvatar />
        <Item withAvatar />
        <Item withAvatar />
        <Item withAvatar />
        <Divider />
        <Item withAvatar />
        <Item withAvatar />
        <Item withAvatar />
        <Item withAvatar />
        <Item withAvatar />
        <Divider />
        <Item withAvatar />
        <Item withAvatar />
        <Item withAvatar />
      </IonList>
    </Page>
}
