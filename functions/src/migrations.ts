import * as admin from 'firebase-admin';

export const migrate = async (app: admin.app.App) => {
    const db = app.database();
    const migration = async (name: string, m: () => Promise<void>) => {
        const ref = db.ref(`/_meta/migrations/${name}`);
        const snapshot = await ref.once('value');
        if (!snapshot.exists()) {
            await m();
            // await ref.set(new Date().toISOString())
        }
    }
    
    await migration('owners_to_members', async () => {
        const snapshot = await db.ref('/wishlists')
            .once('value');


        const lists = snapshot.val() as {
            [key: string]: {
                owners: {
                    [key: string]: boolean
                }
            }
        }

        const patch = Object.keys(lists)
            .map(listId => Object.keys(lists[listId].owners || {})
                .map(userId => ({ listId, userId })))
            .reduce((acc, owners) => acc.concat(owners), [])
            .reduce((acc, {listId, userId}) => ({
                ...acc,
                [`/wishlists/${listId}/members/${userId}`]: 'owner'
            }), {});

        await db.ref().update(patch)
    });
}
