export type User = {
    name: string | undefined
    birthday: string | undefined
    lang: string | undefined
    wishlists: Dictionary
    pushEnabled: boolean | undefined
};

export type Wishlist = {
    title: string
    members: Dictionary<Member>
    wishes: Dictionary
    access?: Access
}

export type Wish = {
    name: string
    category: string | undefined
    url: string | undefined
    wishlistId: string
    price: 1 | 2 | 3 | undefined
    amount: number | 'unlimited'
    image: string | undefined
    thumbnail: string | undefined,
    description: string | undefined
}

export type Access = 'public' | 'private' | 'draft';
export type Member = 'owner' | 'guest';

export type AccessRequest = {
    requester: string
    wishlistId: string
}