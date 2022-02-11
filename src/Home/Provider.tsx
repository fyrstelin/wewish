import { useMemo } from 'react';
import { Home } from './Models';
import { combineLatest, of, Observable, NEVER } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Keys } from '../Utils';
import { useUser } from '../User/UserProvider';
import { useListen } from '../Firebase/Database';

export const QueryHome = () => {
  const uid = useUser(true).user?.id
  const listen = useListen()

  return useMemo<Observable<Home>>(() =>
    uid == null
      ? NEVER
      : listen<Record<string, boolean | string>>(`users/${uid}/wishlists`).pipe(
        map(wishlists => wishlists ?? {}),
        switchMap(wishlists => Object.keys(wishlists).length === 0
          ? of([])
          : combineLatest(
            Keys(wishlists)
              .map(id => ({ id, starredOrLastVisited: wishlists[id] }))
              .map(({ id, starredOrLastVisited }) => combineLatest(
                listen<string>(`wishlists/${id}/title`),
                listen<Record<string, string>>(`wishlists/${id}/members`).pipe(
                  map(members => Keys(members).filter(k => members[k] === 'owner')),
                  switchMap(owners => owners.length === 0
                    ? of({})
                    : combineLatest(
                      owners.map(owner =>
                        listen<string>(`/users/${owner}/name`).pipe(
                          map(name => ({ id: owner, name }))))
                    ).pipe(
                      map(owners => owners.reduce((acc, owner) => ({
                        ...acc,
                        [owner.id]: owner.name
                      }), {} as Record<string, string>))
                    )
                  )
                ),
                (title, owners) => {
                  const isOwner = owners[uid] !== undefined;
                  const others = Keys(owners)
                    .filter(x => x !== uid)
                    .map(id => owners[id])
                    .filter(name => name);
                  return {
                    id, title,
                    starredOrLastVisited, isOwner,
                    owners: others
                  };
                }))
          )
        ),
        map(wishlists => ({ wishlists, uid }))
      ), [uid, listen])
}
