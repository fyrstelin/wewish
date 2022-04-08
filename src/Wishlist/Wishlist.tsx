import { FC, useState } from 'react';
import { Page } from '../Page';
import { Wishes } from './Wishes';
import { useUser } from '../User/UserProvider';
import { Fab } from '../Controls/Fab';
import { useShare } from '../Utils/Share';
import { SimpleMenuButton } from '../Utils/SimpleMenuButton';
import { AddWish, WishData } from './AddWish';
import { PrintableWishlist } from './PrintableWishlist'
import { ThemeColor } from '../Controls/ThemeColor';
import { useTranslation } from '../Localization';
import * as Models from './Models';
import { Skill, Requires } from '../Skills';
import { Description } from './Description';
import { Wish, WishUpdate } from './Wish';
import history from '../Utils/History';
import { Error } from '../Controls/Error';
import { IonButton, IonAlert } from '@ionic/react';
import { AccessRequests } from './AccessRequests';
import cx from 'classnames';
import { mailUnread, settings, heart, heartOutline, share as shareIcon } from 'ionicons/icons';
import { useApi } from './Api';

type Props = {
  wishlist: Models.Wishlist
  openWishId?: string
};

export const Wishlist: FC<Props> = ({
  wishlist, openWishId
}) => {
  const { user, getUser } = useUser()
  const translation = useTranslation()
  const wishlistTranslation = translation.wishlist
  const api = useApi()
  const share = useShare()

  const [isAccessRequestsOpen, setIsAccessRequestsOpen] = useState(false)


  const addWish = async (wish: WishData) => {
    if (wish.type === 'url') {
      await api.addWishFromUrl(wish.url, wish.category);
    } else {
      await api.addWish(wish.name, wish.category, wish.amount);
    }
  }

  const unstar = async () => {
    await api.unstar();
  }

  const star = async () => {
    await getUser(translation.wishlist.login['to-mark-as-favorite']);
    await api.star();
  }

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

  const closeWish = () => history.up(`/wishlists/${wishlist.id}`)

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

  const openAccessRequests = () => setIsAccessRequestsOpen(true)

  const closeAccessRequests = () => setIsAccessRequestsOpen(false)

  const acceptAccessRequest = async (uid: string) => {
    await api.acceptAccessRequest(uid);
  }

  const rejectAccessRequest = async (uid: string) => {
    await api.rejectAccessRequest(uid);
  }

  if (wishlist.$type === 'draft') {
    return (
      <Page
        title={wishlist.title}
        parent='/'
      >
        <Error>
          <h1>{wishlistTranslation.draft}</h1>
        </Error>
      </Page>
    );
  }

  if (wishlist.$type === 'private') {
    return (
      <Page
        title={wishlist.title}
        parent='/'
      >
        <Error>
          <h1>{wishlistTranslation.private}</h1>
          {wishlist.accessRequested
            ? <h2>{wishlistTranslation['access-requested']}</h2>
            : user && <IonButton fill='clear' onClick={requestAccess}>
              {wishlistTranslation['request-access']}
            </IonButton>}
        </Error>
      </Page>
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
        <Page
          classNames={cx(
            'wishlist',
            wishlist.$type === 'owned' && wishlist.access
          )}
          title={wishlist.title}
          parent='/'
          buttons={wishlist.$type === 'owned'
            ? <>
              {wishlist.accessRequests.length > 0 &&
                wishlist.access === 'private' &&
                <SimpleMenuButton
                  icon={mailUnread}
                  onClick={openAccessRequests}
                />
              }
              <SimpleMenuButton
                href={`/wishlists/${wishlist.id}/settings`}
                icon={settings}
              />
            </>
            : wishlist.stared
              ? <SimpleMenuButton
                icon={heart}
                onClick={unstar}
              />
              : <SimpleMenuButton
                icon={heartOutline}
                teaches='star'
                onClick={star}
              />
          }
          headerContent={wishlist.$type === 'owned' &&
            <AddWish
              onAddWish={addWish}
              exisingCategories={wishlist.wishes
                .map(x => x.category!)
                .filter(x => !!x)
                .reduce((acc, x) => acc.indexOf(x) === -1 ? acc.concat(x) : acc, [] as string[])}
            />}
        >
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
          {wishlist.$type === 'owned' &&
            <AccessRequests
              isOpen={wishlist.access === 'private' && isAccessRequestsOpen}
              onClose={closeAccessRequests}
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
              {shareIcon}
            </Fab>
          }
        </Page>
      </ThemeColor>
    </Requires>
  );
}
