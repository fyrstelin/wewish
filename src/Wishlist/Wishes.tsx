import * as Models from './Models';
import { WishGroup } from './WishGroup';
import { useUser } from '../User/UserProvider';
import { IonList } from '@ionic/react';
import { FC } from 'react';

type Props = {
  wishlistId: string
  wishes: ReadonlyArray<Models.Wish>
  onMarkAsBought: (wish: Models.Wish, amount: number) => void
  onMarkAsUnbought: (wish: Models.Wish) => void
  onDeleteWish: (wish: Models.Wish) => void
}

export const Wishes: FC<Props> = ({ wishes, onMarkAsBought, onMarkAsUnbought, onDeleteWish, wishlistId }) => {
  const { user } = useUser()
  const grouped = wishes.reduce((group, wish) => {
    const category = (wish.category || '').toLocaleUpperCase().trim();
    return {
      ...group,
      [category]: [...(group[category] || []), wish]
    };
  }, {} as { [category: string]: Models.Wish[] });

  const categories = Object
    .keys(grouped)
    .sort();

  return (
    <IonList>
      {categories.map(category => <WishGroup
        key={category}
        wishlistId={wishlistId}
        userId={user ? user.id : ''}
        category={category}
        wishes={grouped[category]}
        onMarkAsBought={onMarkAsBought}
        onMarkAsUnbought={onMarkAsUnbought}
        onDeleteWish={onDeleteWish}
      />
      )}
    </IonList>
  )
}
