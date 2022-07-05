import { FC } from 'react';
import { Wishes } from './Wishes';
import { useUser } from '../User/UserProvider';
import { Fab } from '../Controls/Fab';
import { useShare } from '../Utils/Share';
import { PrintableWishlist } from './PrintableWishlist'
import { ThemeColor } from '../Controls/ThemeColor';
import { useTranslation } from '../Localization';
import * as Models from './Models';
import { Skill, Requires } from '../Skills';
import { Description } from './Description';
import { Wish, WishUpdate } from './Wish';
import { Error } from '../Controls/Error';
import { IonButton, IonAlert } from '@ionic/react';
import { AccessRequests } from './AccessRequests';
import { shareSocialSharp } from 'ionicons/icons';
import { useApi } from './Api';
import { useHash } from '../Utils/Hash';
import { useModalController } from '../Controls/Modal';

type Props = {
  wishlist: Models.Wishlist
  openWishId?: string
};

export const Wishlist: FC<Props> = ({
  wishlist
}) => {
  const [openWishId] = useHash<string>('wish')
  const [, closeWish] = useModalController('wish')
  const { user, getUser } = useUser()
  const translation = useTranslation()
  const wishlistTranslation = translation.wishlist
  const api = useApi()
  const share = useShare()

  const markAsBought = async (wish: Models.Wish, amount: number) => {
    await getUser(translation.wishlist.login['to-mark-as-bought']);
    await api.markAsBought(wish.id, amount);
  }

  const markAsUnbought = async (wish: Models.Wish) => {
    await api.markAsUnbought(wish.id);
  }

  const shareList = async () => {
    await share(window.location.pathname);
    api.shared();
  }

  const deleteWish = async ({ id }: Models.Wish) => {
    await api.deleteWish(id);
  }

  const updateWish = async (update: WishUpdate) => {
    if (openWishId) {
      await api.updateWish(openWishId, update);
    }
  }

  const uploadImage = async (image: Blob) => {
    if (openWishId) {
      await api.uploadImage(openWishId, image);
    }
  }

  const updateDescription = async (description: string) => {
    await api.updateDescription(description);
  }

  const requestAccess = async () => {
    await api.requestAccess()
  }

  const acceptAccessRequest = async (uid: string) => {
    await api.acceptAccessRequest(uid);
  }

  const rejectAccessRequest = async (uid: string) => {
    await api.rejectAccessRequest(uid);
  }

  if (wishlist.$type === 'draft') {
    return (
      <Error>
        <h1>{wishlistTranslation.draft}</h1>
      </Error>
    );
  }

  if (wishlist.$type === 'private') {
    return (
      <Error>
        <h1>{wishlistTranslation.private}</h1>
        {wishlist.accessRequested
          ? <h2>{wishlistTranslation['access-requested']}</h2>
          : user && <IonButton fill='clear' onClick={requestAccess}>
            {wishlistTranslation['request-access']}
          </IonButton>}
      </Error>
    );
  }

  const requiredSkills = {
    owned: ['add-wish', 'share-wish-list'] as ReadonlyArray<Skill>,
    public: ['star'] as ReadonlyArray<Skill>,
  }[wishlist.$type];

  const wishes = wishlist.wishes as ReadonlyArray<Models.Wish>;

  return (
    <Requires skills={requiredSkills}>
      <ThemeColor primary={wishlist.themeColor} secondary={wishlist.secondaryThemeColor}>
        <PrintableWishlist
          owners={wishlist.owners}
          title={wishlist.title}
          wishes={wishlist.wishes}
          description={wishlist.description}
        />
        <Wish
          wish={wishes.find(x => x.id === openWishId)}
          onClose={closeWish}
          isOwner={wishlist.$type === 'owned'}
          onSave={updateWish}
          onUploadImage={uploadImage}
          onMarkAsBought={markAsBought}
          onMarkAsUnbought={markAsUnbought}
          onDelete={deleteWish}
        />
        <IonAlert
          isOpen={!user}
          onDidDismiss={() => { }}
          header={wishlistTranslation['not-logged-in'].title}
          message={wishlistTranslation['not-logged-in'].message}
          buttons={[
            {
              text: translation.controls.popups.ok,
            }, {
              text: wishlistTranslation['not-logged-in'].login,
              handler: () => getUser()
            }
          ]}
        />
        {wishlist.$type === 'owned' && wishlist.access === 'private' &&
          <AccessRequests
            onAccept={acceptAccessRequest}
            onReject={rejectAccessRequest}
            accessRequests={wishlist.accessRequests}
          />
        }
        <div className='wishlist__description'>
          {wishlist.$type === 'owned'
            ? wishlist.wishes.length > 0 && <Description onNewDescription={updateDescription}>
              {wishlist.description}
            </Description>
            : (wishlist.description || '').split('\n')
              .map((line, i) => <p key={i}>{line}</p>)
          }
        </div>
        <Wishes
          wishlistId={wishlist.id}
          wishes={wishlist.wishes}
          onMarkAsBought={markAsBought}
          onMarkAsUnbought={markAsUnbought}
          onDeleteWish={deleteWish}
        />
        {wishlist.$type === 'owned' &&
          <Fab onClick={shareList} teaches={wishlist.wishes.length > 3 ? 'share-wish-list' : undefined}>
            {shareSocialSharp}
          </Fab>
        }
      </ThemeColor>
    </Requires>
  );
}
