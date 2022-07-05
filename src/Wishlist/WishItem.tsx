import { FC, useState, useRef, ReactNode } from 'react';
import * as Models from './Models';
import cx from 'classnames';
import { useUser } from '../User/UserProvider';
import { BoughtPopup } from './BoughtPopup';
import { IonAvatar, IonIcon, IonLabel, IonItemSliding, IonItem } from '@ionic/react';
import { useTranslation } from '../Localization';
import { Swipe } from '../Controls/Swipe';
import { usePopupManager } from '../Controls/Popups';
import { exitSharp, logoEuro, trashSharp, arrowUndoSharp, checkmarkSharp } from 'ionicons/icons';
import { useModalController } from '../Controls/Modal';

type Props = {
  wish: Models.Wish
  onMarkAsBought: (wish: Models.Wish, amount: number) => void
  onMarkAsUnbought: (wish: Models.Wish) => void
  onDeleteWish: (wish: Models.Wish) => void
  uninteresting?: true
}

export const WishItem: FC<Props> = ({ wish, onMarkAsBought, onMarkAsUnbought, onDeleteWish, uninteresting }) => {
  const { user } = useUser()
  const translation = useTranslation()
  const popupManager = usePopupManager()
  const [openWish] = useModalController('wish')

  const [popupOpen, setPopupOpen] = useState(false)

  const slidingItem = useRef<HTMLIonItemSlidingElement | null>(null)

  const markAsBought = (amount: number) => onMarkAsBought(wish, amount);

  const swipe = async () => {
    if (slidingItem.current) {
      await slidingItem.current.close()
    }

    if (wish.$type === 'owned-wish') {
      const confirmed = await popupManager.confirm({
        title: translation.wish['delete-wish']['popup-title'],
        message: translation.wish['delete-wish'].content(wish.name),
        yes: translation.wish['delete-wish'].delete
      });
      if (confirmed) {
        onDeleteWish(wish);
      }
    } else {
      const { buyers } = wish;
      const bought = buyers[user ? user.id : ''] !== undefined;
      if (bought) {
        onMarkAsUnbought(wish);
      } else {
        onMarkAsBoughtClick();
      }
    }
  }

  const onMarkAsBoughtClick = () => {
    if (wish.amount === 'unlimited' || wish.amount === 1) {
      onMarkAsBought(wish, 1);
    } else {
      setPopupOpen(true)
    }
  }

  const closePopup = async () => setPopupOpen(false)

  const { name, price, url } = wish
  const amount = wish.amount === 'unlimited' || wish.amount === 1
    ? ''
    : `${wish.amount}x`;

  const subheader: ReactNode[] = [];

  if (wish.$type === 'public-wish' && wish.amountBought > 0 && wish.amount !== 1) {
    subheader.push(`${wish.amountBought} ${wish.amount !== 'unlimited' ? `of ${wish.amount}` : ''} bought`);
  }

  const bought = wish.$type === 'public-wish' && wish.buyers[user ? user.id : ''] !== undefined;

  return (
    <>
      {wish.$type === 'public-wish' &&
        <BoughtPopup
          open={popupOpen}
          onClose={closePopup}
          onBought={markAsBought}
          wish={wish}
        />
      }
      <IonItemSliding ref={slidingItem} disabled={uninteresting}>
        <IonItem class='wish-item' onClick={() => openWish({ wish: wish.id })}>
          <IonAvatar slot='start'>
            {wish.thumbnailUrl
              ? <img src={wish.thumbnailUrl} alt={wish.name} />
              : wish.category ? wish.category[0].toLocaleUpperCase() : ''
            }

          </IonAvatar>
          <IonLabel>
            <h2 className={cx({ bought: bought || uninteresting })}>
              {url
                ? <a href={url} target='_blank' rel="noopener noreferrer">
                  {amount} {name}
                  <IonIcon icon={exitSharp} />
                </a>
                : <>{amount} {name}</>
              }
            </h2>
            {price &&
              <span className={`price-${price}`}>
                <IonIcon icon={logoEuro} />
                <IonIcon icon={logoEuro} />
                <IonIcon icon={logoEuro} />
              </span>
            }
          </IonLabel>
          <div slot='end'>
            {wish.$type === 'public-wish' && wish.amountBought > 0 && wish.amount !== 1 &&
              <>
                {wish.amountBought}
                {
                  wish.amount !== 'unlimited' &&
                  <>
                    /
                    {wish.amount}
                  </>
                }
              </>
            }
          </div>
        </IonItem>
        <Swipe
          icon={
            wish.$type === 'owned-wish'
              ? trashSharp
              : bought ? arrowUndoSharp : checkmarkSharp}
          color={bought || wish.$type === 'owned-wish' ? 'danger' : 'success'}
          onSwipe={swipe}
        />
      </IonItemSliding>
    </>
  )
}
