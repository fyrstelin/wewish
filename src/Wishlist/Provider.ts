import { useMemo } from 'react';
import { Wishlist } from './Models';
import { switchMap, map } from "rxjs/operators";
import { combineLatest, of, Observable, EMPTY } from "rxjs";
import { Keys } from "../Utils";
import { leftJoin } from "../rxjs/operators/leftJoin";
import { useUser } from "../User/UserProvider";
import * as Api from '../Api';
import { useListen, useDatabase } from '../Firebase/Database';

export const QueryWishlist = (wishlistId: string): Observable<Wishlist> => {
  const listen = useListen()
  const uid = useUser().user?.id
  const database = useDatabase()
  
  return useMemo(() => {
    const field = <T>(path: string, defaultTo?: T) =>
      listen<T>(`/wishlists/${wishlistId}/${path}`).pipe(
        defaultTo === undefined
          ? stream => stream
          : map(x => x ?? defaultTo)
      )

    const access = field<Api.Access>('access', 'public')

    const $type = uid
      ? listen<Api.Member>(`/wishlists/${wishlistId}/members/${uid}`).pipe(
        switchMap(member => member
          ? of(member === 'owner'
            ? 'owned' as 'owned'
            : 'public' as 'public')
          : access)
      ) : access

  const accessRequested = uid
      ? new Observable<boolean>(stream => {
        const query = database
          .ref(`/requests`)
          .orderByChild('requester').equalTo(uid)
        query.on('value', snapshot => {
          const res = (snapshot.val()) as Dictionary<Api.AccessRequest>;

          stream.next(Object.values(res || {})
            .some(x => x.wishlistId === wishlistId))
          stream.next(res && Object.keys(res).length > 0);
        });

        stream.next(false)

        return () => query.off('value');
      })
      : of(false)
    
    const owners = field<Dictionary<Api.Member>>('members')
      .pipe(
        map(members => Object
          .keys(members || {})
          .filter(id => members[id] === 'owner')
        ),
        leftJoin(ownerId => listen<string>(`/users/${ownerId}/name`).pipe(
          map(name => name ?? '')
        ))
      )

    const title = field<string>('title');
    const description = field<string>('description');
    const themeColor = field<string>('themeColor');
    const secondaryThemeColor = field<string>('secondaryThemeColor');

    const base = combineLatest(title, themeColor, secondaryThemeColor, description, owners,
      (title, themeColor, secondaryThemeColor, description, owners) => ({
        title, themeColor, secondaryThemeColor, description, owners
      }))

    const accessRequests = new Observable<string[]>(s => {
        const query = database.ref('/requests')
          .orderByChild('wishlistId').equalTo(wishlistId);
        query.on('value', snapshot => {
          const res = snapshot.val() as Dictionary<Api.AccessRequest>;
          s.next(Object.values(res || {}).map(x => x.requester));
        });
        s.next([])
        return () => query.off('value');
      }
    ).pipe(
      leftJoin(id => listen<string>(`/users/${id}/name`).pipe(
        map(name => ({
          id, name
        })
      )))
    )

    const ownedWishes = field<Dictionary>('wishes', {}).pipe(
      map(x => Object.keys(x)),
      leftJoin(wishId => listen<Api.Wish>(`wishes/${wishId}`).pipe(
        map(wish => ({
          $type: 'owned-wish' as 'owned-wish',
          id: wishId,
          name: wish.name,
          category: wish.category || '',
          price: wish.price,
          url: wish.url || '',
          amount: wish.amount || 1,
          imageUrl: wish.image || '',
          thumbnailUrl: wish.thumbnail || '',
          description: wish.description || ''
        }))))
    )

    const publicWishes = field<Dictionary>(`wishes`, {}).pipe(
      map(wishes => Object.keys(wishes || {})),
      leftJoin(wishId => combineLatest(
        listen<Api.Wish>(`wishes/${wishId}`).pipe(
          map(wish => ({
            name: wish.name,
            category: wish.category || '',
            price: wish.price,
            url: wish.url || '',
            amount: wish.amount || 1,
            imageUrl: wish.image || '',
            thumbnailUrl: wish.thumbnail || '',
            description: wish.description || ''
          }))
        ),
        !uid
          ? of<Dictionary<number>>({})
          : listen<Dictionary<number>>(`bought-wishes/${wishId}`).pipe(
            map(x => x || {})
          ),
        (wish, buyers) => ({
          $type: 'public-wish' as 'public-wish',
          id: wishId,
          name: wish.name,
          category: wish.category,
          price: wish.price,
          url: wish.url,
          amount: wish.amount || 1,
          amountBought: Keys(buyers)
            .map(x => buyers[x])
            .reduce((x, y) => x + y, 0),
          buyers,
          imageUrl: wish.imageUrl,
          thumbnailUrl: wish.thumbnailUrl,
          description: wish.description
        }))
      )
    )

    const stared = uid
      ? listen<boolean>(`/users/${uid}/wishlists/${wishlistId}`).pipe(
        map(x => x === true)
      )
      : of(false)
    

    const res = $type.pipe(
      switchMap($type => {
        switch ($type) {
          case null:
            return EMPTY;
          case 'draft':
            return title.pipe(
              map(title => ({
                id: wishlistId,
                $type, title
              }))
            )
          case 'private':
            return combineLatest(title, accessRequested,
              (title, accessRequested) => ({
              id: wishlistId,
              $type, title, accessRequested
              }));
          case 'public':
            return combineLatest(base, publicWishes, stared,
              (base, wishes, stared) => ({
                id: wishlistId,
                $type,
                wishes,
                stared,
                ...base
              })
            );
          case 'owned':
            return combineLatest(
              base, access, ownedWishes, accessRequests,
              (base, access, wishes, accessRequests) => ({
                id: wishlistId,
                $type,
                access,
                wishes,
                accessRequests,
                ...base
              })
            );
        }
      })
    )

    return res
  }, [wishlistId, listen, database, uid])
}
