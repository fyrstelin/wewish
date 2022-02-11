import { Lang } from "../Localization";
import { Provider } from "../User";


export type User = {
    name: string | undefined
    birthday: string | undefined
    lang: Lang | undefined
    email: string | undefined
    providers: ReadonlyArray<Provider>
    pushEnabled: boolean | undefined
};