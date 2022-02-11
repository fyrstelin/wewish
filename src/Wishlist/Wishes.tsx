import React from 'react';
import * as Models from './Models';
import { WishGroup } from './WishGroup';
import { WithUser } from '../User/UserProvider';
import { IonList } from '@ionic/react';

type Props = {
    wishlistId: string
    wishes: ReadonlyArray<Models.Wish>
    onMarkAsBought: (wish: Models.Wish, amount: number) => void
    onMarkAsUnbought: (wish: Models.Wish) => void
    onDeleteWish: (wish: Models.Wish) => void
}

export const Wishes = 
    WithUser()(
    class Wishes extends React.PureComponent<Props & WithUser> {
        render() {
            const { wishes, onMarkAsBought, onMarkAsUnbought, user, onDeleteWish, wishlistId } = this.props;

            const grouped = wishes.reduce((group, wish) => {
                const category = (wish.category || '').toLocaleUpperCase().trim();
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
            );
        }
    }
);