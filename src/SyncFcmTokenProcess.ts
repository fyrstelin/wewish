import { FirebaseProcess } from "./Firebase/FirebaseProcess";
import { WithDatabase } from "./Firebase/Database";
import { WithMessaging } from "./Firebase/Messaging";
import { WithUser } from "./User/UserProvider";
import { switchMap, map, filter } from "rxjs/operators";
import { never, from, of } from "rxjs";

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
                                .listen<boolean | undefined>(`/users/${uid}/pushEnabled`)
                                .pipe(
                                    map(pushEnabled => ({ uid, pushEnabled: !!pushEnabled }))
                                )
                            : of({ uid: null, pushEnabled: false })),
                        switchMap(({ uid, pushEnabled }) => pushEnabled
                            ? from(this.props.messaging.requestPermission()
                                .then(() => this.props.messaging.getToken())
                                .catch(() => null)
                                .then(token => ({uid, token, pushEnabled}))
                            )
                            : never()),
                        filter(({ token }) => !!token)
                    )
                    .subscribe(({ pushEnabled, uid, token }) => {
                        if (pushEnabled) {
                            if (uid) {
                                this.props.database
                                    .ref(`/fcm-tokens/${token}`)
                                    .set({
                                        userId: uid,
                                    });
                            }
                        } else {
                            this.props.database
                                .ref(`/fcm-tokens/${token}`)
                                .remove()
                        }
                    })
                );
            }
    }
)))