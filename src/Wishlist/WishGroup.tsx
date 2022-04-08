import { useState } from 'react';
import { WishItem } from './WishItem';
import * as Models from './Models';
import { IonItemGroup, IonItemDivider, IonLabel, IonButton, IonIcon } from '@ionic/react';
import { add, remove } from 'ionicons/icons';

type Props = {
  wishlistId: string
  category: string
  wishes: ReadonlyArray<Models.Wish>
  userId: string
  onMarkAsBought: (wish: Models.Wish, amount: number) => void
  onMarkAsUnbought: (wish: Models.Wish) => void
  onDeleteWish: (wish: Models.Wish) => void
};
type State = 'all' | 'none' | 'interesting';

const icons = {
  all: add,
  none: remove,
  interesting: add
};

export const WishGroup = ({ category, wishes, onMarkAsBought, onMarkAsUnbought, userId, onDeleteWish, wishlistId }: Props) => {
  const [state, setState] = useState<State>('interesting')

  const interestingWishes = wishes
    .filter(x => x.$type === 'owned-wish' ||
      !(x.amountBought >= x.amount) || x.buyers[userId] !== undefined)

  const uninterestingWishes = wishes
    .filter(x => interestingWishes.indexOf(x) === -1);

  const nextState = ((): State => {
    if (state === 'all') {
      return 'none';
    }
    if (state === 'none') {
      return 'interesting';
    }
    if (uninterestingWishes.length > 0) {
      return 'all';
    }
    return 'none';
  })();

  const icon = category[0] || '';
  return <IonItemGroup class='wish-group'>
    <IonItemDivider color='light' sticky>
      <IonLabel>{category}</IonLabel>
      <IonButton slot='end' fill='clear' color='medium' onClick={() => setState(nextState)}>
        <IonIcon slot='icon-only' icon={icons[nextState]} />
        {nextState === 'all' &&
          <div className='counter'>{uninterestingWishes.length}</div>
        }
      </IonButton>
    </IonItemDivider>
    {state !== 'none' && interestingWishes
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((wish, i) =>
        <WishItem
          key={wish.id}
          wishlistId={wishlistId}
          icon={icon}
          wish={wish}
          onMarkAsBought={onMarkAsBought}
          onMarkAsUnbought={onMarkAsUnbought}
          onDeleteWish={onDeleteWish}
        />
      )
    }
    {state === 'all' && uninterestingWishes
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(wish =>
        <WishItem
          uninteresting
          key={wish.id}
          wishlistId={wishlistId}
          icon={icon}
          wish={wish}
          onMarkAsBought={onMarkAsBought}
          onMarkAsUnbought={onMarkAsUnbought}
          onDeleteWish={onDeleteWish}
        />
      )
    }
  </IonItemGroup>;
}
