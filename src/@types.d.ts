type Dictionary<T = any> = { [key: string]: T };

type Doc = {
  title: string
  body: string
}

type Translation = {
  home: {
    'wish-list': string
    'my-wish-lists': string
    'favorites': string
    'last-visited-wish-lists': string
    'sign-out': string
    'settings': string
    'about': string
  }
  wishlist: {
    'make-a-wish': string
    'category': string
    'mark-as-bought': string
    'bought-wishes': (x: number) => string
    'login': {
      'to-mark-as-bought': string
      'to-mark-as-favorite': string
    },
    'description': string,
    'add-wish': {
      'by-url': string
    },
    'draft': string
    'private': string
    'access-requested': string
    'request-access': string
    'access-requests': string,
    'not-logged-in': {
      'title': string,
      'message': string,
      'login': string
    }
  }
  userSettings: {
    'page-title': string
    'name': string
    'birthday': string
    'lang': string
    'reset-tutorial': string
    'connected-to': string
    'danger-zone': string
    'push-enabled': string
    'connect-password': {
      'title': string
      'email': string
      'password': string
    }
  }
  wishlistSettings: {
    'page-title': string
    'title': string
    'theme-color': string
    'delete-wishlist': {
      'popup-title': string
      'content': (title: string) => string
      'delete': string
    }
    'reset-wishlist': {
      'popup-title': string
      'content': (title: string) => string
    }
    'owners': string
    'shared-with': string
    'remove-guest': string
    'remove-guest-message': (name: string) => string
    'remove-owner': string
    'remove-owner-message': (name: string) => string
    'add-co-owner': string
    'add-co-owner-message': string
    'reset': string
    'choose-primary-color': string
    'choose-secondary-color': string
    'access': string
    'draft': string
    'private': string
    'public': string
  }
  controls: {
    editor: {
      'save': string
    }
    popups: {
      'ok': string
      'cancel': string
    }
  }
  utils: {
    noname: string
    share: {
      'link-copied': string
    }
  }
  wish: {
    name: string
    category: string
    link: string
    linkPlaceholder: string
    price: string
    amount: string
    description: string
    bought: string
    'delete-wish': {
      'popup-title': string
      'content': (name: string) => string
      'delete': string
    }
  }
  login: {
    'sign-in-with-facebook': string
    'sign-in-with-microsoft': string
    'sign-in-with-google': string
    'sign-in-with-email': string
    'sign-in-with-incognito': string
    'slogan': string
    'email': string
    'password': string
    'name': string
    'register': string
    'sign-in': string
    'register-user': string
    'forgot-password': string
    'reset-password': string
    'sign-in-with-incognito-description': string
    'policy': string
    'terms': string
  }
  invite: {
    'page-title': string
    'not-found': string
    'accept': string
  }
  ['service-worker']: {
    'new-content': string
  }
  errors: {
    ['auth/invalid-email']: string
    ['auth/wrong-password']: string
    ['auth/weak-password']: string
    ['auth/email-already-in-use']: string
    ['auth/user-not-found']: string
    ['auth/account-exists-with-different-credential']: string
  }
  tutorial: {
    'add-wish-list': string
    'add-wish': string
    'share-wish-list': string
    'star': string
    'mark-as-bought': string
  },
  about: {
    'title': string
  },
  policy: {
    'title': string,
    'revision-date': string
    'intro': string
    'consent': Doc
    'information': Doc
    'gdpr': Doc
    'children': Doc
  }
};
