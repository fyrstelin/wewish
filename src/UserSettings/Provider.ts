import * as Models from './Models';
import { switchMap, map } from "rxjs/operators";
import { supportedLangs } from "../Localization";
import { useUser } from "../User/UserProvider";
import { from, Observable } from "rxjs";
import * as Api from '../Api';
import { useListen } from "../Firebase/Database";

export const QueryUser = (): Observable<Models.User> => {
  const listen = useListen()
	const { getUser } = useUser(true)

	return from(getUser()).pipe(
		switchMap(({ id, email, providers }) => listen<Api.User>(`users/${id}`)
			.pipe(
				map(user => user || {}),
				map(user => {
					const idx = supportedLangs.indexOf(user.lang as any);
					return {
						name: user.name,
						birthday: user.birthday,
						pushEnabled: user.pushEnabled,
						lang: idx === -1 ? undefined : supportedLangs[idx],
						providers,
						email
					};
				})
			)),
	)
}
