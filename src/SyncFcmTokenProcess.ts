import { FirebaseProcess } from "./Firebase/FirebaseProcess";
import { WithDatabase } from "./Firebase/Database";
import { WithMessaging } from "./Firebase/Messaging";
import { WithUser } from "./User/UserProvider";
import { switchMap, map, filter } from "rxjs/operators";
import { of, NEVER } from "rxjs";
import { ref, remove, set } from "firebase/database";
import { getToken } from 'firebase/messaging'

type Props = {
} & WithDatabase & WithMessaging & WithUser;

export const SyncFcmTokenProcess =
  WithUser()(
    WithDatabase(
      WithMessaging(
        class SyncFcmTokenProcess extends FirebaseProcess<Props> {
          constructor(props: Props) {
            super(props);
            this.using(this
              .on(x => x.user && x.user.id)
              .pipe(
                switchMap(uid => uid
                  ? this
                    .listen<boolean | undefined>(`/users/${uid}/pushEnabled`)
                    .pipe(
                      map(pushEnabled => ({ uid, pushEnabled: !!pushEnabled }))
                    )
                  : of({ uid: null, pushEnabled: false })),
                switchMap(({ uid, pushEnabled }) => pushEnabled
                  ? getToken(this.props.messaging)
                    .catch(() => null)
                    .then(token => ({ uid, token, pushEnabled }))
                  : NEVER),
                filter(({ token }) => !!token)
              )
              .subscribe(({ pushEnabled, uid, token }) => {
                if (pushEnabled) {
                  if (uid) {
                    set(ref(this.props.database, `/fcm-tokens/${token}`), {
                      userId: uid,
                    });
                  }
                } else {
                  remove(ref(this.props.database, `/fcm-tokens/${token}`))
                }
              })
            );
          }
        }
      )))
