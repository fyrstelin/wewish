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
    noname: 'No name',
    share: {
      'link-copied': 'Link copied to clipboard'
    }
  },
  wishlistSettings: {
    'page-title': 'Wish list settings',
    'title': 'Title',
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
  },
  policy: {
    'title': 'Privacy Policy',
    "revision-date": 'Effective date: June 22, 2022',
    intro: `
      This Privacy Policy document contains types of information that is collected and recorded by WeWish and how we use it.
      If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at afkpost@gmail.com
    `,
    consent: {
      title: 'Consent',
      body: `
        By using our website, you hereby consent to our Privacy Policy and agree to its terms.
      `
    },
    information: {
      title: 'Information we collect and how we use it',
      body: `
        When you register an account, we only ask for your email address and your name. Besides that we only collect whatever you choose to put into your wish lists (text and images) and whether you bought a wish.
        We use the information we collect for
        * Login
        * Displaying your wish lists
        * Help others not to buy the same wish
      `
    },
    gdpr: {
      title: 'GDPR Data Protection Rights',
      body: `
        We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
        The right to access - You have the right to request copies of your personal data.
        The right to rectification - You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.
        The right to erasure - You have the right to request that we erase your personal data, under certain conditions.
        The right to restrict processing - You have the right to request that we restrict the processing of your personal data, under certain conditions.
        The right to object to processing - You have the right to object to our processing of your personal data, under certain conditions.
        The right to data portability - You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.
        If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us by email (afkpost@gmail.com).
      `
    },
    children: {
      title: "Children's Information",
      body: `
        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
        WeWish does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
      `
    }
  }
};
