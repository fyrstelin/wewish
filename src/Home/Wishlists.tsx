import { FC } from 'react';
import * as Models from './Models';
import format from 'dateformat';
import { useTranslation } from '../Localization';
import { IonList, IonLabel, IonItemDivider, IonItemGroup } from '@ionic/react';
import { Item } from '../Controls/Item';

type Props = {
  wishlists: ReadonlyArray<Models.Wishlist>
};

const oneMonthAgo = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return format(d, 'yyyy-mm-dd');
})();

type Wishlist = { id: string, title: string, owners: ReadonlyArray<string> };
const Wishlist = ({ id, title, owners }: Wishlist) =>
  <Item href={`/wishlists/${id}`}>
    <IonLabel>
      <h2>{title}</h2>
      <p>{owners.slice().sort().join(', ')}</p>
    </IonLabel>
  </Item>;

export const Wishlists: FC<Props> = ({ wishlists }) => {
  const { home } = useTranslation()

  const ownWishlists = wishlists
    .filter(x => x.isOwner)
    .sort((a, b) => a.title.localeCompare(b.title));

  const favorites = wishlists
    .filter(x => !x.isOwner && x.starredOrLastVisited === true)
    .sort((a, b) => a.title.localeCompare(b.title));

  const history = wishlists
    .filter(x => !x.isOwner && typeof (x.starredOrLastVisited) === 'string' && x.starredOrLastVisited >= oneMonthAgo)
    .sort((a, b) => a.title.localeCompare(b.title))
    .sort((a, b) => -(a.starredOrLastVisited as string).localeCompare(b.starredOrLastVisited as string));

  return (
    <IonList lines='none'>
      <IonItemGroup>
        {ownWishlists.length > 0 && <IonItemDivider color='light' sticky>
          <IonLabel>
            {home['my-wish-lists']}
          </IonLabel>
        </IonItemDivider>}
        {
          ownWishlists.map(({ id, title, owners }) => <Wishlist
            key={id}
            id={id}
            title={title}
            owners={owners}
          />)
        }
      </IonItemGroup>
      <IonItemGroup>
        {favorites.length > 0 && <IonItemDivider color='light' sticky>
          <IonLabel>{home.favorites}</IonLabel>
        </IonItemDivider>}
        {
          favorites.map(({ id, title, owners }) => <Wishlist
            key={id}
            id={id}
            title={title}
            owners={owners}
          />)
        }
      </IonItemGroup>
      <IonItemGroup>
        {history.length > 0 && <IonItemDivider color='light' sticky>
          <IonLabel>{home['last-visited-wish-lists']}</IonLabel>
        </IonItemDivider>}
        {
          history.map(({ id, title, owners }) => <Wishlist
            key={id}
            id={id}
            title={title}
            owners={owners}
          />)
        }
      </IonItemGroup>
    </IonList>
  );
}
