import { FirebaseProvider } from "../Firebase";
import * as Models from './Models';
import { switchMap, map } from "rxjs/operators";
import { supportedLangs } from "../Localization";
import { WithUser } from "../User/UserProvider";
import { combineLatest } from "rxjs";
import * as Api from '../Api';

export const Provider =
	WithUser(true)(
		class Provider extends FirebaseProvider<WithUser, Models.User> {
			setup() {
				return combineLatest(
					this.on(x => x.user!.providers),
					this.on(x => x.user!.email),
					this.on(x => x.user!.id).pipe(
						switchMap(userId => this.listen<Api.User>(`users/${userId}`)),
						map(user => user || {})
					),
					(providers, email, user) => {
						const idx = supportedLangs.indexOf(user.lang as any);
						return {
							name: user.name,
							birthday: user.birthday,
							pushEnabled: user.pushEnabled,
							lang: idx === -1 ? undefined : supportedLangs[idx],
							providers,
							email
						};
					}
				);
			}
		}
	);
