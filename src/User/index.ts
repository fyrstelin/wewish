export type Provider = 'google.com' | 'facebook.com' | 'password';

export type User = {
    id: string
    email: string | undefined
    providers: ReadonlyArray<Provider>
};
export const User = (id: string, email: string | undefined, providers: ReadonlyArray<Provider>): User => ({
    id, providers, email
});
