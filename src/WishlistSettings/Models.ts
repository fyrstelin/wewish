import * as Api from '../Api';

export type Wishlist = Readonly<{
    title: string
    themeColor: string | undefined
    secondaryThemeColor: string | undefined
    members: ReadonlyArray<User>
    access: Api.Access
}>;

export type User = Readonly<{
    id: string
    name: string
    membership: Api.Member
}>;