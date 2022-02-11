export const Lang: Translation = {
  home: {
    'wish-list': 'Ønskeseddel',
    'my-wish-lists': 'MINE ØNSKESEDLER',
    'favorites': 'FAVORITTER',
    'last-visited-wish-lists': 'SENEST BESØGTE ØNSKESEDLER',
    'sign-out': 'Log ud',
    'settings': 'Brugerindstillinger',
    'about': 'Om'
  },
  wishlist: {
    'category': 'Kategori',
    'make-a-wish': 'Ønsk dig noget',
    'mark-as-bought': 'Markér som købt',
    'bought-wishes': (x: number) => `+${x} ${x === 1 ? 'købt ønske' : 'købte ønsker'}`,
    'login': {
      'to-mark-as-bought': 'Log ind for at markere som købt.',
      'to-mark-as-favorite': 'Log ind for at gemme som favorit.',
    },
    'description': 'Beskrivelse',
    'add-wish': {
      'by-url': 'Henter ønsker'
    },
    'draft': 'Denne liste er en kladde og er ikke tilgængelig endnu.',
    'private': 'Denne liste er privat.',
    'request-access': 'Anmod om adgang',
    'access-requested': 'Anmodning sendt',
    'access-requests': 'Anmodninger',
    'not-logged-in': {
      'title': 'Ikke logget ind',
      'message': 'Du er ikke logget ind, og kan derfor ikke se allerede købte ønsker.',
      'login': 'Log ind'
    }
  },
  userSettings: {
    'page-title': 'Brugerindstillinger',
    'name': 'Navn',
    'birthday': 'Fødselsdag',
    'lang': 'Sprog',
    'reset-tutorial': 'Nulstil tutorial',
    'connected-to': 'Forbundet til',
    'danger-zone': 'Farezone',
    'push-enabled': 'Modtag push beskeder',
    'connect-password': {
      'title': 'Opret adgangskode',
      'password': 'Adgangskode',
      'email': 'Email',
    }
  },
  controls: {
    editor: {
      'save': 'Gem'
    },
    popups: {
      ok: 'OK',
      cancel: 'Fortryd'
    }
  },
  utils: {
    share: {
      'link-copied': 'Link kopieret til udklipsholder'
    }
  },
  wishlistSettings: {
    'page-title': 'Indstillinger for ønskeseddel',
    'title': 'Titel',
    'theme-color': 'Farve',
    'delete-wishlist': {
      'popup-title': 'Slet ønskeseddel',
      'content': title => `Vil du slette '${title}'?`,
      'delete': 'Slet'
    },
    'owners': 'Ejere',
    'shared-with': 'Delt med',
    'remove-guest': 'Fjern adgang',
    'remove-guest-message': name => `Vil du fjerne adgangen for '${name}'?`,
    'remove-owner': 'Fjern ejer',
    'remove-owner-message': name => `Vil du fjerne '${name}' som ejer?`,
    'add-co-owner': 'Tilføj medejer',
    'add-co-owner-message': 'Dette vil generere en engangsinvitation. Del invitationen med din medejer.',
    'reset': 'Nulstil',
    'reset-wishlist': {
      'popup-title': 'Nulstil ønskeseddel',
      'content': (title: string) => `Vil du nulstille ønskesedlen '${title}'? Alle ønsker der måtte være mærkeret som købt, vil ikke længere være mærkeret.`
    },
    'choose-primary-color': 'Vælg primær farve',
    'choose-secondary-color': 'Vælg sekundær farve',
    'access': 'Adgang',
    'draft': 'Kladde',
    'private': 'Privat',
    'public': 'Offentlig'
  },
  wish: {
    name: 'Navn',
    category: 'Kategori',
    link: 'Link',
    linkPlaceholder: 'https://eksempel.dk',
    price: 'Pris',
    amount: 'Antal',
    description: 'Beskrivelse',
    'delete-wish': {
      'popup-title': 'Slet ønskle',
      'content': (name: string) => `Vil du slette '${name}'?`,
      'delete': 'Slet'
    },
    bought: 'Købt',
  },
  login: {
    'sign-in-with-facebook': 'Log ind med Facebook',
    'sign-in-with-microsoft': 'Log ind med Microsoft',
    'sign-in-with-google': 'Log ind med Google',
    'sign-in-with-email': 'Log ind med email',
    'sign-in-with-incognito': 'Forsæt uden login',
    'slogan': 'Gavekoordinering på den nemme måde',
    'email': 'E-mail',
    'password': 'Adgangskode',
    'name': 'Navn',
    'register': 'Opret konto',
    'sign-in': 'Log ind',
    'register-user': 'Opret en konto',
    'forgot-password': 'Glemt adgangskode?',
    'reset-password': 'Nulstil adgangskode',
    'sign-in-with-incognito-description':
      'Vil du oprette en konto der er tilknyttet denne enhed? Under brugerindstillinger kan du senere opgradere kontoen.',
    'policy': 'Privatlivspolitik',
    'terms': 'Servicevilkår'
  },
  invite: {
    'page-title': 'Invitation',
    'not-found': 'Der findes ingen invitation med den angivne kode.',
    'accept': 'Acceptér'
  },
  'service-worker': {
    'new-content': 'Ny opdatering tilgængelig.'
  },
  errors: {
    'auth/invalid-email': 'Ugyldig emailadresse',
    'auth/wrong-password': 'Forkert adgangskode',
    'auth/weak-password': 'Din adgangskode er for svag',
    'auth/email-already-in-use': 'Email adressen er allerede i brug',
    'auth/user-not-found': 'Bruger ikke fundet',
    'auth/account-exists-with-different-credential': 'Prøv at logge ind med en anden tjeneste.'
  },
  tutorial: {
    'add-wish-list': 'Opret en ønskeseddel',
    'add-wish': 'Tilføj et ønske',
    'share-wish-list': 'Del din ønskeseddel med andre',
    'star': 'Markér som favorit',
    'mark-as-bought': 'Markér som købt'
  },
  about: {
    title: 'Om WeWish'
  }
}