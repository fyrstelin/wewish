import * as admin from 'firebase-admin';

export const pushToFactory = (app: admin.app.App) => async (userIds: ReadonlyArray<string>, data: {}) => {
    if (userIds.length === 0) {
        return;
    }
    const db = app.database();
    const fcm = app.messaging();

    const query = db.ref('fcm-tokens')
        .orderByChild('userId');

    const users = (await Promise.all(
        userIds.map(uid => query
            .equalTo(uid)
            .once('value')
            .then(x => x.val())
            .then(tokens => ({
                id: uid,
                tokens: Object.keys(tokens || {})
            })))
    )).reduce((acc, user) => acc.concat(
        user.tokens.map(token => ({ id: user.id, token}))
    ), [] as ReadonlyArray<{id: string, token: string}>);

    const response = await fcm.sendToDevice(users.map(x => x.token), {
        data
    });

    await Promise.all(response.results
        .map(x => {
            console.log(x);
            return x;
        })
        .map((result, i) => ({ result, user: users[i]}))
        .map(({ result, user }) => result.error && [
            'messaging/invalid-registration-token',
            'messaging/registration-token-not-registered'
        ].indexOf(result.error.code) !== -1
            ? db.ref(`/fcm-tokens/${user.token}`).remove()
            : Promise.resolve()))
}