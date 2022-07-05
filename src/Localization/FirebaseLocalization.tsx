import * as Localization from './index';
import { Localize, defaultLang } from './index';
import { FirebaseProvider, useAuth } from '../Firebase';
import { switchMap, map } from 'rxjs/operators'
import { of } from 'rxjs';
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';

type Props = {
  uid: string | null
};
type State = {
  lang: Localization.Lang
};

class Provider extends FirebaseProvider<Props, State> {
  protected fallback(): ReactNode {
    return <></>
  }

  setup() {
    return this.on(props => props.uid)
      .pipe(switchMap(uid => uid
        ? this.listen<Localization.Lang>(`/users/${uid}/lang`)
          .pipe(
            map(lang => Localization.supportedLangs.includes(lang)
              ? { lang }
              : { lang: defaultLang }))
        : of({ lang: defaultLang })
      ));
  }
}

export const FirebaseLocalization: FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuth()

  const [uid, setUid] = useState<string | null>(null)

  useEffect(() => {
    setUid(null)
    return auth.onAuthStateChanged(user => setUid(user?.uid ?? null))
  }, [auth])

  return <Provider uid={uid} render={({ lang }) =>
    <Localize lang={lang}>
      {children}
    </Localize>
  } />
}
