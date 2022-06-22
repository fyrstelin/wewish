import { timer, Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import { ReactElement, useEffect, useState } from 'react';
import { useAuth } from '.';

type Props = {
  delay?: number
  children: (initialized: boolean) => ReactElement
}

export const Initializer = ({ delay, children }: Props) => {
  const auth = useAuth()
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
}
