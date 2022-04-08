import { FirebaseProcess } from "../Firebase/FirebaseProcess";
import { filter, mergeMap } from "rxjs/operators";
import format from 'dateformat';
import { WithAuth } from "../Firebase/Auth";
import { WithDatabase } from '../Firebase/Database'
import { ref, runTransaction } from "firebase/database";

type Props = {
  wishlistId: string
}

export const Process =
  WithDatabase(
    WithAuth(
      class Process extends FirebaseProcess<Props & WithDatabase & WithAuth> {
        constructor(props: Props & WithDatabase & WithAuth) {
          super(props);

          this.using(
            this.on(x => x)
              .pipe(
                filter(({ auth }) => !!auth.currentUser),
                mergeMap(({ auth, wishlistId }) => {
                  const r = ref(this.props.database, `users/${auth.currentUser!.uid}/wishlists/${wishlistId}`);
                  return runTransaction(r, x => {
                    // if it is marked as favorite, keep it marked
                    if (x === true) {
                      return;
                    }
                    const now = new Date();
                    return format(now, 'yyyy-mm-dd');
                  });
                })
              )
              .subscribe()
          )
        }
      }
    ));
