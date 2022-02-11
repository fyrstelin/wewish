export const Lang: Translation = {
  home: {
    'wish-list': 'Wish list',
    'my-wish-lists': 'MY WISH LISTS',
    'favorites': 'FAVORITES',
    'last-visited-wish-lists': 'LAST VISITED WISH LISTS',
    'sign-out': 'Sign out',
    'settings': 'User settings',
    'about': 'About'
  },
  wishlist: {
    'category': 'Category',
    'make-a-wish': 'Make a wish',
    'mark-as-bought': 'Mark as bought',
    'bought-wishes': (x: number) => `+${x} bought ${x === 1 ? 'wish' : 'wishes'}`,
    'login': {
      'to-mark-as-bought': 'Sign in to mark as bought.',
      'to-mark-as-favorite': 'Sign in to save as favorite.',
    },
    'description': 'Description',
    'add-wish': {
      'by-url': 'Fetching wish'
    },
    'draft': 'This list is a draft and cannot be accessed yet.',
    'private': 'This list is private.',
    'request-access': 'Request access',
    'access-requested': 'Access requested.',
    'access-requests': 'Access requests',
    'not-logged-in': {
      'title': 'Not signed in',
      'message': 'You are not signed in, and therefore cannot see bought wishes.',
      'login': 'Sign in'
    }
  },
  userSettings: {
    'page-title': 'User settings',
    'name': 'Name',
    'birthday': 'Birthday',
    'lang': 'Language',
    'reset-tutorial': 'Reset tutorial',
    'connected-to': 'Connected to',
    'danger-zone': 'Danger zone',
    'push-enabled': 'Enable push notifications',
    'connect-password': {
      'title': 'Create password',
      'password': 'Password',
      'email': 'Email',
    }
  },
  controls: {
    editor: {
      'save': 'Save'
    },
    popups: {
      'ok': 'OK',
      'cancel': 'Cancel'
    }
  },
  utils: {
    share: {
      'link-copied': 'Link copied to clipboard'
    }
  },
  wishlistSettings: {
    'page-title': 'Wish list settings',
    'title': 'title',
    'theme-color': 'Color',
    'delete-wishlist': {
      'popup-title': 'Delete wishlist',
      'content': (title: string) => `Do you want to delete '${title}'?`,
      'delete': 'delete'
    },
    'owners': 'Owners',
    'shared-with': 'Shared with',
    'remove-guest': 'Revoke access',
    'remove-guest-message': name => `Do you want to revoke the access for '${name}'?`,
    'remove-owner': 'Remove owner',
    'remove-owner-message': name => `Do you want to remove '${name}' as owner?`,
    'add-co-owner': 'Add co-owner',
    'add-co-owner-message': 'This will generate a one-time use invitation. Share the invitation with your co-owner.',
    'reset': 'Reset',
    'reset-wishlist': {
      'popup-title': 'Reset wishlist',
      'content': (title: string) => `Do you want to reset '${title}'? Every wish that is marked as bought, will no longer be marked.`
    },
    'choose-primary-color': 'Choose primary color',
    'choose-secondary-color': 'Choose secondary color',
    'access': 'Access',
    'draft': 'Draft',
    'private': 'Private',
    'public': 'Public'
  },
  wish: {
    name: 'Name',
    category: 'Category',
    link: 'Link',
    linkPlaceholder: 'https://example.com',
    price: 'Price',
    amount: 'Amount',
    description: 'Description',
    'delete-wish': {
      'popup-title': 'Delete wish',
      'content': (name: string) => `Do yo want to delete '${name}'?`,
      'delete': 'Delete'
    },
    bought: 'Bought'
  },
  login: {
    'sign-in-with-facebook': 'Sign in with Facebook',
    'sign-in-with-microsoft': 'Sign in with Microsoft',
    'sign-in-with-google': 'Sign in with Google',
    'sign-in-with-email': 'Sign in with email',
    'sign-in-with-incognito': 'Continue without signing in',
    'slogan': 'Gift Coordinating Made Easy',
    'email': 'Email',
    'password': 'Password',
    'name': 'Name',
    'register': 'Create account',
    'sign-in': 'Sign in',
    'register-user': 'Create an account',
    'forgot-password': 'Forgot password?',
    'reset-password': 'Nulstil adgangskode',
    'sign-in-with-incognito-description':
      'Do you want to create an account associated with this device? You can always upgrade your account in user settings.',
    'policy': 'Privacy policy',
    'terms': 'Terms of service'
  },
  invite: {
    'page-title': 'Invite',
    'not-found': 'No invitation found with the given code.',
    'accept': 'Accept'
  },
  'service-worker': {
    'new-content': 'New update available.'
  },
  errors: {
    'auth/invalid-email': 'Invalid email address',
    'auth/wrong-password': 'Wrong password',
    'auth/weak-password': 'Your password is too weak',
    'auth/email-already-in-use': 'The email address is already in use',
    'auth/user-not-found': 'User not found',
    'auth/account-exists-with-different-credential': 'Try another provider.'
  },
  tutorial: {
    'add-wish-list': 'Make a wish list',
    'add-wish': 'Add a wish',
    'share-wish-list': 'Share your wish list with others',
    'star': 'Mark as favorite',
    'mark-as-bought': 'Mark as bought'
  },
  about: {
    title: 'About WeWish'
  }
};