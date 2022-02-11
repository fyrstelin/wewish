import * as Localization from './index';
import { Localize, defaultLang } from './index';
import React from 'react';
import { FirebaseProvider, useAuth } from '../Firebase';
import { switchMap, map } from 'rxjs/operators'
import { of } from 'rxjs';

type Props = {
  uid: string | null
};
type State = {
  lang: Localization.Lang
};

class Provider extends FirebaseProvider<Props, State> {
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

export const FirebaseLocalization = ({ children }: React.Props<{}>) => {
  const { currentUser } = useAuth()

  return <Provider uid={currentUser && currentUser.uid} render={({ lang }) =>
    <Localize lang={lang}>
      {children}
    </Localize>
  }/>
}
