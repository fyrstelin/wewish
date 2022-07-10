export type User = {
  name: string | undefined
  birthday: string | undefined
  lang: string | undefined
  wishlists: Record<WishlistId, Wishlist>
  pushEnabled: boolean | undefined
};

export type Wishlist = {
  title: string
  members: Record<UserId, Member>
  wishes: Record<WishId, Wish>
  access?: Access
}

export type Wish = {
  name: string
  category: string | undefined
  url: string | undefined
  wishlistId: WishlistId
  price: 1 | 2 | 3 | undefined
  amount: number | 'unlimited'
  image: string | undefined
  thumbnail: string | undefined,
  description: string | undefined
}

export type Access = 'public' | 'private' | 'draft';
export type Member = 'owner' | 'guest';

export type AccessRequest = {
  requester: string
  wishlistId: WishlistId
}
