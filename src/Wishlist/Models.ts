type CommonWishlist = Readonly<{
    id: string
    title: string
    themeColor: string | undefined
    secondaryThemeColor: string | undefined
    description: string
    owners: ReadonlyArray<string>
}>

type OwnedWishlist = CommonWishlist & Readonly<{
    $type: 'owned'
    access: 'draft' | 'private' | 'public'
    wishes: ReadonlyArray<OwnedWish>
    accessRequests: ReadonlyArray<AccessRequest>
}>

export type AccessRequest = Readonly<{
    id: string,
    name: string
}>

type PublicWishlist = CommonWishlist & Readonly<{
    $type: 'public'
    stared: boolean
    wishes: ReadonlyArray<PublicWish>
}>

type PrivateWishlist = Readonly<{
    $type: 'private'
    id: string
    title: string
    accessRequested: boolean
}>

type DraftWishlist = Readonly<{
    $type: 'draft'
    id: string
    title: string
}>

export type Wishlist
    = OwnedWishlist
    | PublicWishlist
    | PrivateWishlist
    | DraftWishlist


type CommonWish = Readonly<{
    id: string
    name: string
    description: string
    category: string
    url: string
    price: 1 | 2 | 3 | undefined 
    imageUrl: string
    thumbnailUrl: string
    amount: 'unlimited' | number
}>

export type OwnedWish = CommonWish & Readonly<{
    $type: 'owned-wish'
}>

export type PublicWish = CommonWish & Readonly<{
    $type: 'public-wish'
    amountBought: number
    buyers: Dictionary<number>
}>

export type Wish
    = OwnedWish
    | PublicWish