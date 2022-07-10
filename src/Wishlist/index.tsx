import { ApiProvider } from "./Api";
import { Process } from './Process';
import { QueryWishlist } from './Provider';
import { Wishlist } from './Wishlist';
import { useStream } from '../Utils/useStream';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Skeleton } from "./Skeleton";
import cx from 'classnames'
import { HeaderButtons } from "./HeaderButtons";
import { AddWish } from "./AddWish";
import { BackButton } from "../Controls/BackButton";

type Props = { id: WishlistId };
export const Root = ({ id }: Props) => {
  const wishlist = useStream(QueryWishlist(id))

  return (
    <IonPage className={cx(
      'wishlist',
      wishlist?.$type === 'owned' && wishlist.access
    )}>
      <ApiProvider wishlistId={id}>
      <IonHeader>
        <IonToolbar color='primary'>
          <BackButton>/</BackButton>
          <IonTitle>{wishlist?.title}</IonTitle>
          { wishlist && <HeaderButtons
            wishlist={wishlist}
          /> }
        </IonToolbar>
        {wishlist?.$type === 'owned' && <AddWish exisingCategories={[]}/>}
      </IonHeader>
      <IonContent>
        {wishlist
          ? <>
            <Process wishlistId={id} />
            <Wishlist wishlist={wishlist}/>
          </>
          : <Skeleton />
          }
      </IonContent>
      </ApiProvider>
    </IonPage>
  )
}
