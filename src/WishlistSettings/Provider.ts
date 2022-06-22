import { useState as useReactState, useEffect, useCallback } from 'react'
import { combineLatest, Observable } from 'rxjs';
import { switchMap, map, throttleTime } from "rxjs/operators";
import * as Api from '../Api';
import { useListen } from "../Firebase/Database";

const useRxState = <TState>(createStream: () => Observable<TState>, deps: any[]) => {
  const [state, setState] = useReactState<TState | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  createStream = useCallback(createStream, deps)

  useEffect(() => {
    const subscription = createStream()
      .pipe(throttleTime(50, undefined, {
        leading: false,
        trailing: true
      }))
      .subscribe(setState)
    return () => subscription.unsubscribe()
  }, [createStream, setState])

  return state
}

export const useState = (wishlistId: string) => {
  const listen = useListen()
  const field = useCallback(
    <T>(path: string) => listen<T>(`/wishlists/${wishlistId}/${path}`),
    [listen, wishlistId]) as <T>(path: string) => Observable<T>

  return useRxState(() => combineLatest(
    field<string>('title').pipe(map(x => x || '')),
    field<string | undefined>('themeColor'),
    field<string | undefined>('secondaryThemeColor'),
    field<Api.Access | undefined>('access').pipe(
      map(x => (x || 'public') as Api.Access),
    ),
    field<Dictionary<Api.Member>>('members').pipe(
      map(members => Object.keys(members || {})
        .map(id => ({ id, membership: members[id] }))),
      switchMap(members => combineLatest(members.map(member =>
        listen<string>(`/users/${member.id}/name`)
          .pipe(map(name => ({ name, ...member }))))))),
    (title, themeColor, secondaryThemeColor, access, members) => ({
      title, themeColor, secondaryThemeColor, access, members
    })), [field, listen])
}
