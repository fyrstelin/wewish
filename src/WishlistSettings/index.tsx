import { useState } from './Provider';
import { Content } from './Content';
import { useApi } from './api';
import { Loader } from '../Controls/Loader';
import { IonButtons, IonContent, IonPage, IonTitle } from '@ionic/react';
import { Header } from '../Controls/Header';
import { BackButton } from '../Controls/BackButton';
import { useTranslation } from '../Localization';
import { SimpleMenuButton } from '../Utils/SimpleMenuButton';
import { trashSharp } from 'ionicons/icons';
import { usePopupManager } from '../Controls/Popups';

type Props = {
  id: string
};

export const WishlistSettings = ({ id }: Props) => {
  const popupManager = usePopupManager()

  const { wishlistSettings } = useTranslation()
  const state = useState(id)
  const api = useApi(id)

  const deleteWishlist = async () => {
    const confirmed = await popupManager.confirm({
      title: wishlistSettings['delete-wishlist']['popup-title'],
      message: wishlistSettings['delete-wishlist'].content(state?.title ?? 'No title'),
      yes: wishlistSettings['delete-wishlist'].delete
    });
    if (confirmed) {
      await api.delete()
    }
  }

  return (
    <IonPage>
      <Header>
        <BackButton>{`/wishlists/${id}`}</BackButton>
        <IonTitle>
          {wishlistSettings['page-title']}
        </IonTitle>
        <IonButtons slot='end'>
          <SimpleMenuButton icon={trashSharp}
            onClick={deleteWishlist}
          />
        </IonButtons>
      </Header>
      <IonContent>{
        state ? <Content
          wishlist={state}
          onSave={api.save}
          onAddCoOwner={api.addCoOwner}
          onReset={api.reset}
          onRemoveMember={api.removeMember}
        /> : <Loader />
      }</IonContent>
    </IonPage>
  )
}
