import { useState } from 'react';
import { WishItem } from './WishItem';
import * as Models from './Models';
import { IonItemGroup, IonItemDivider, IonLabel, IonButton, IonIcon } from '@ionic/react';
import { addSharp, removeSharp } from 'ionicons/icons';

type Props = {
  category: string
  wishes: ReadonlyArray<Models.Wish>
  userId: UserId
  onMarkAsBought: (wish: Models.Wish, amount: number) => void
  onMarkAsUnbought: (wish: Models.Wish) => void
  onDeleteWish: (wish: Models.Wish) => void
};
type State = 'all' | 'none' | 'interesting';

const icons = {
  all: addSharp,
  none: removeSharp,
  interesting: addSharp
};

export const WishGroup = ({ category, wishes, onMarkAsBought, onMarkAsUnbought, userId, onDeleteWish }: Props) => {
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

  return <IonItemGroup class='wish-group'>
    <IonItemDivider color='light' sticky>
      <IonLabel>{category}</IonLabel>
      <IonButton slot='end' fill='clear' color='medium' onClick={() => setState(nextState)}>
        <IonIcon icon={icons[nextState]} />
        {nextState === 'all' &&
          <div className='counter'>{uninterestingWishes.length}</div>
        }
      </IonButton>
    </IonItemDivider>
    {state !== 'none' && interestingWishes
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((wish) =>
        <WishItem
          key={wish.id}
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
          wish={wish}
          onMarkAsBought={onMarkAsBought}
          onMarkAsUnbought={onMarkAsUnbought}
          onDeleteWish={onDeleteWish}
        />
      )
    }
  </IonItemGroup>;
}
