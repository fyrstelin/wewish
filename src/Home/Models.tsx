export type Home = Readonly<{
  uid: string
  wishlists: ReadonlyArray<Wishlist>
}>;
export const Home = (uid: string): Home => ({
  uid,
  wishlists: [],
});

export type Wishlist = Readonly<{
  title: string
  id: string
  isOwner: boolean
  starredOrLastVisited: string | boolean
  owners: ReadonlyArray<string>
}>;
