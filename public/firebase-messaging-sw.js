/* eslint-disable no-restricted-globals */
/* global importScripts firebase */

importScripts('https://www.gstatic.com/firebasejs/6.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.0/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.0/firebase-auth.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.0/firebase-database.js');

firebase.initializeApp({
  messagingSenderId: "607064698105",
  apiKey: 'AIzaSyBS8xeJ-azSfr6PStW-TD3I0aOGCc651Zk',
  databaseURL: 'https://wewish-158417.firebaseio.com'
});

const messaging = firebase.messaging();

const langs = {
  'en': {
    'new-user-title': 'New user',
    'new-user': name => `Welcome '${name}'`,
    'access-request-title': 'New request',
    'access-request': (name, title) =>
      `${name} requested access to ${title}`,
    'approve': 'Approve',
    'decline': 'Decline'
  },
  'da': {
    'new-user-title': 'Ny bruger',
    'new-user': name => `Velkommen til '${name}'`,
    'access-request-title': 'Ny anmodning',
    'access-request': (name, title) =>
      `${name} har anmodet om adgang til ${title}`,
    'approve': 'Acceptér',
    'decline': 'Afvis'
  }
}

const getLang = async () => {
  const auth = firebase.auth();

  const uid = await new Promise(r => {
    const dispose = auth.onAuthStateChanged(user => {
      if (user) {
        r(user.uid);
      } else {
        r(null)
      }
      dispose();
    });
  })

  if (uid) {
    const db = firebase.database();

    const s = await db.ref(`/users/${uid}/lang`).once('value');
    const l = s.val();
    if (l && langs[l]) {
      return langs[l];
    }
  }

  const key = (navigator.languages || [navigator.language]).concat('en')
    .map(x => x.split('-')[0])
    .filter(x => !!x)
    .find(x => langs[x]);
  return langs[key];
}

const messageHandlers = {
  ACCESS_REQUEST: async ({ username, userId, wishlistId, wishlistTitle }) => {
    const lang = await getLang();
    return [
      lang['access-request-title'],
      {
        body: lang['access-request'](username, wishlistTitle),
        icon: '/logo-50.png',
        actions: [{
          action: 'ACCESS_REQUEST__APPROVED',
          title: lang['approve'],
          icon: '/media/approve.svg'
        }, {
          action: 'ACCESS_REQUEST__DECLINED',
          title: lang['decline'],
          icon: '/media/decline.svg'
        }],
        data: {
          wishlistId,
          userId
        }
      }
    ]
  },

  NEW_USER: async ({ name }) => {
    const lang = await getLang();
    return [
      lang['new-user-title'],
      {
        body: lang['new-user'](name)
      }
    ]
  }
}

const handleAccessRequest = async (update, wishlistId, userId) => {
  const db = firebase.database();
  const ref = await db
    .ref(`/requests`)
    .orderByChild('wishlistId').equalTo(wishlistId)
    .once('value');

  const requests = ref.val() || {};

  const patch = Object.entries(requests)
    .filter(([, req]) => req.requester === userId)
    .reduce((acc, [id]) => ({
      ...acc,
      [`/requests/${id}`]: null
    }), update);

  await db.ref().update(patch);
}

const messageResponseHandlers = {
  ACCESS_REQUEST__APPROVED: ({ wishlistId, userId }) =>
    handleAccessRequest({
      [`/wishlists/${wishlistId}/members/${userId}`]: 'guest'
    }, wishlistId, userId),

  ACCESS_REQUEST__DECLINED: ({ wishlistId, userId }) =>
    handleAccessRequest({}, wishlistId, userId),
}

messaging.setBackgroundMessageHandler(async ({ data }) => {
  const getParams = data.type && messageHandlers[data.type];

  try {
    if (getParams) {
      await self.registration.showNotification(...await getParams(data));
    }
  } catch (e) {
    await self.registration.showNotification('Something went wrong', {
      body: e
    });
  }
})

self.addEventListener('notificationclick', x => {
  messageResponseHandlers[x.action](x.notification.data)
    .then(() => x.notification.close());

})
