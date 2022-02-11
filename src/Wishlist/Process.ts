import { FirebaseProcess } from "../Firebase/FirebaseProcess";
import { filter} from "rxjs/operators";
import format from 'dateformat';
import { WithAuth } from "../Firebase/Auth";
import { WithDatabase } from '../Firebase/Database'

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
                    .pipe(filter(({ auth }) => !!auth.currentUser))
                    .subscribe(({ auth, wishlistId }) => {
                        const ref = this.props.database.ref(`users/${auth.currentUser!.uid}/wishlists/${wishlistId}`);
                        ref.transaction(x => {
                            // if it is marked as favorite, keep it marked
                            if (x === true) {
                                return;
                            }
                            const now = new Date();
                            return format(now, 'yyyy-mm-dd');
                        });
                    }));
        }
    }
));