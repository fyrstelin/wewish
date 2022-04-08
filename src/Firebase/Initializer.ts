import { WithAuth } from './Auth';
import { timer, Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import { ReactElement, useEffect, useState } from 'react';

type Props = {
  delay?: number
  children: (initialized: boolean) => ReactElement
}

export const Initializer = WithAuth(({ delay, auth, children }: Props & WithAuth) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const delayStream = timer(delay || 0);
    const authStream = new Observable<any>(s => {
      auth.onAuthStateChanged(() => s.next());
    });

    combineLatest([delayStream, authStream])
      .pipe(first())
      .subscribe(() => setIsInitialized(true));
  });

  return children(isInitialized);
});
