import { ComponentType, ReactNode, useMemo } from 'react';
import * as App from './App';
import { Database, getDatabase, ref, onValue } from 'firebase/database';
import { Observable } from 'rxjs';
import { Cache } from './Cache';
import { distinctUntilChanged } from 'rxjs/operators';
import { equals } from '../Utils/equals'

export const cache = Cache.Create('firebase-db-cache');
export const USE_CACHE_AFTER = 300;

type ReactProps = { children?: ReactNode };

export type WithDatabase = { database: Database };
export function WithDatabase<TProps>(Component: ComponentType<TProps & WithDatabase>) {
  return (props: ReactProps & TProps) => <App.Consumer>{app =>
    <Component database={getDatabase(app)} {...props} />
  }</App.Consumer>
}

export const Listen = (db: Database) =>
  <T extends any>(path: string): Observable<T> => {
    return new Observable<T>(stream => {
      const entityRef = ref(db, path);

      const cached = cache.get<T>(path);
      if (cached !== null) {
        stream.next(cached)
      }

      const off = onValue(entityRef, snapshot => {
        if (!snapshot) return;

        const val = snapshot.val() as T;
        cache.update(path, val);
        stream.next(val);
      }, (e: Error) => stream.error(e));
      return () => off();
    }).pipe(distinctUntilChanged(equals))
  }

export const useDatabase = () => getDatabase(App.useApp())
export const useListen = () => {
  const db = useDatabase()
  return useMemo(() => Listen(db), [db])
}
