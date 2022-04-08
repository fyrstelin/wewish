import { FirebaseProcess } from "../Firebase/FirebaseProcess";
import { switchMap, map, filter } from "rxjs/operators";
import { Keys } from "../Utils";
import { of, combineLatest } from "rxjs";
import { WithDatabase } from "../Firebase/Database";
import { ref, update } from "firebase/database";

type Props = {
  uid: string
}

export const Process =
  WithDatabase(
    class Process extends FirebaseProcess<Props & WithDatabase> {

      constructor(props: Props & WithDatabase) {
        super(props);
        this.using(this
          .on(({ uid }) => uid)
          .pipe(
            switchMap(userId => this.listen<Dictionary>(`users/${userId}/wishlists`)),
            map(wishlists => Keys(wishlists)),
            switchMap(wishlistsIds => wishlistsIds.length === 0
              ? of([])
              : combineLatest(wishlistsIds.map(wishlistId =>
                this.listen<Dictionary<string>>(`wishlists/${wishlistId}/members`)
                  .pipe(
                    map(members => members || {}),
                    map(owners => ({
                      wishlistId,
                      hasOwners: Object.values(owners)
                        .some(x => x === 'owner')
                    })
                    ))))),
            map(lists => lists
              .filter(x => !x.hasOwners)
              .map(x => x.wishlistId)),
            filter(x => x.length > 0)
          )
          .subscribe(ids => {
            const values = ids.reduce((patch, id) => ({ ...patch, [id]: null }), {});
            update(ref(this.props.database, `users/${this.props.uid}/wishlists`), values);
          }));
      }
    });
