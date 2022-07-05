import { useDatabase, useListen } from "./Firebase/Database";
import { useMessaging } from "./Firebase/Messaging";
import { useUser } from "./User/UserProvider";
import { map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { ref, set } from "firebase/database";
import { getToken } from 'firebase/messaging'
import { FC, useEffect } from "react";

export const SyncFcmTokenProcess: FC = () => {
  const { user } = useUser()
  const db = useDatabase()
  const messaging = useMessaging()
  const listen = useListen()

  useEffect(() => {
    const user$ = (user
      ? listen<boolean | undefined>(`/users/${user.id}/pushEnabled`)
        .pipe(
          map(pushEnabled => ({ uid: user.id as string | null, pushEnabled: !!pushEnabled }))
        )
      : of({ uid: null, pushEnabled: false })).pipe()

    const s = user$.pipe(
      mergeMap(async ({ pushEnabled, uid }) => {
        if (pushEnabled && uid) {
          const token = await getToken(messaging)
          set(ref(db, `/fcm-tokens/${token}`), {
            userId: uid,
          });
        }
      }, 1)
    ).subscribe()

    return () => s.unsubscribe()
  }, [user, db, messaging, listen])

  return null
}
