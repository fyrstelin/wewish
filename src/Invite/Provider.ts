
import { combineLatest, of, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { useMemo } from 'react';
import { useListen } from '../Firebase/Database';

type State = {
  title?: string,
  owners: ReadonlyArray<string>
};

export const QueryInvite = (code: string) => {
  const listen = useListen()
  return useMemo<Observable<State>>(() => listen<string>(`/invites/${code}`).pipe(
    switchMap(wishlistId => wishlistId
      ? combineLatest(
        listen<string>(`/wishlists/${wishlistId}/title`),
        listen<Dictionary<string>>(`/wishlists/${wishlistId}/members`)
          .pipe(
            map(members => members || {}),
            map(members => Object.entries(members)
              .filter(([, access]) => access === 'owner')
              .map(([id]) => id)),
            switchMap(owners => owners.length === 0
              ? of([] as string[])
              : combineLatest(owners.map(owner => listen<string>(`/users/${owner}/name`)))
            ),
            map(owners => owners.filter(x => !!x).sort())
          ),
        (title, owners) => ({ title, owners }))
      : of({ owners: [] as string[] })
    )
  ), [listen, code])
}
