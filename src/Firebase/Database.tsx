import React, { useCallback } from 'react';
import * as App from './App';
import * as Firebase from 'firebase/app';
import 'firebase/database';
import { Observable } from 'rxjs';
import { Cache } from './Cache';
import { distinctUntilChanged } from 'rxjs/operators';
import { equals } from '../Utils/equals'

export const cache = Cache.Create('firebase-db-cache');
export const USE_CACHE_AFTER = 300;

type ReactProps = { children?: React.ReactNode };

export type WithDatabase = { database: Firebase.database.Database };
export function WithDatabase<TProps>(Component: React.ComponentType<TProps & WithDatabase>) {
  return (props: ReactProps & TProps) => <App.Consumer>{app =>
    <Component database={app.database()} {...props} />
  }</App.Consumer>
}

export const Listen = (db: Firebase.database.Database) =>
  <T, _ = {}>(path: string): Observable<T> => {
  return new Observable<T>(stream => {
    const ref = db.ref(path);

    const cached = cache.get<T>(path);
    if (cached !== null) {
      stream.next(cached)
    }

    const next = (snapshot: Firebase.database.DataSnapshot | null) => {
      if (!snapshot) return;

      const val = snapshot.val() as T;
      cache.update(path, val);
      stream.next(val);
    }

    ref.on('value', next, (e: Error) => stream.error(e));
    return () => {
      ref.off('value', next);
    };
  }).pipe(distinctUntilChanged(equals))
}

export const useDatabase = () => App.useApp().database()
export const useListen = () => {
  const db = useDatabase()
  const listen = Listen(db)
  return useCallback(listen, [db]) as <T>(path: string) => Observable<T>
}