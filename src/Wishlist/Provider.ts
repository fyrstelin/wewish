import { useMemo } from 'react';
import { Wishlist } from './Models';
import { switchMap, map } from "rxjs/operators";
import { combineLatest, of, Observable, EMPTY } from "rxjs";
import { Keys } from "../Utils";
import { leftJoin } from "../rxjs/operators/leftJoin";
import { useUser } from "../User/UserProvider";
import * as Api from '../Api';
import { useListen, useDatabase } from '../Firebase/Database';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';

export const QueryWishlist = (id: WishlistId): Observable<Wishlist> => {
  const listen = useListen()
  const uid = useUser().user?.id
  const database = useDatabase()

  return useMemo(() => {
    const field = <T>(path: string, defaultTo?: T) =>
      listen<T>(`/wishlists/${id}/${path}`).pipe(
        defaultTo === undefined
          ? stream => stream
          : map(x => x ?? defaultTo)
      )

    const access = field<Api.Access>('access', 'public')

    const $type = uid
      ? listen<Api.Member>(`/wishlists/${id}/members/${uid}`).pipe(
        switchMap(member => member
          ? of(member === 'owner'
            ? 'owned' as 'owned'
            : 'public' as 'public')
          : access)
      ) : access

    const accessRequested = uid
      ? new Observable<boolean>(stream => {
        const q = query(ref(database),
          orderByChild('requester'),
          equalTo(uid)
        )

        stream.next(false)

        return onValue(q, snapshot => {
          const res = (snapshot.val()) as Dictionary<Api.AccessRequest>;

          stream.next(Object.values(res || {})
            .some(x => x.wishlistId === id))
          stream.next(res && Object.keys(res).length > 0);
        });
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

    const base = combineLatest([title, themeColor, secondaryThemeColor, description, owners],
      (title, themeColor, secondaryThemeColor, description, owners) => ({
        title, themeColor, secondaryThemeColor, description, owners
      }))

    const accessRequests = new Observable<string[]>(s => {
      const q = query(ref(database, '/requests'),
        orderByChild('wishlistId'),
        equalTo(id)
      )
      s.next([])
      return onValue(q, snapshot => {
        const res = snapshot.val() as Dictionary<Api.AccessRequest>;
        const userIds = [] as string[]

        new Set<string>(Object.values(res || {}).map(x => x.requester)).forEach(id => userIds.push(id))
        s.next(userIds)
      })
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
      ? listen<boolean>(`/users/${uid}/wishlists/${id}`).pipe(
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
                id: id,
                $type, title
              }))
            )
          case 'private':
            return combineLatest(title, accessRequested,
              (title, accessRequested) => ({
                id: id,
                $type, title, accessRequested
              }));
          case 'public':
            return combineLatest(base, publicWishes, stared,
              (base, wishes, stared) => ({
                id: id,
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
                id: id,
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
  }, [id, listen, database, uid])
}
