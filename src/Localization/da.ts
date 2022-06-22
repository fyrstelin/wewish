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
  },
  policy: {
    'title': 'Privatlivspolitik',
    "revision-date": 'Revisionsdato: 22. juni, 2022',
    intro: `
      Denne privatlivspolitik indeholder typer af oplysninger, der indsamles og registreres af WeWish, og hvordan vi bruger dem.
      If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at afkpost@gmail.com
    `,
    consent: {
      title: 'Samtykke',
      body: `
        Ved at bruge vores hjemmeside giver du hermed samtykke til vores privatlivspolitik og accepterer dens vilkår.
      `
    },
    information: {
      title: 'Oplysninger, vi indsamler, og hvordan vi bruger dem',
      body: `
        Når du registrerer en konto, beder vi kun om din e-mailadresse og dit navn. Derudover samler vi kun det, du vælger at sætte på dine ønskelister (tekst og billeder), og om du har købt et ønske.
        Vi bruger de oplysninger, vi indsamler til
        * Log på
        * Viser dine ønskelister
        * Hjælp andre til ikke at købe det samme ønske
      `
    },
    gdpr: {
      title: 'GDPR Databeskyttelsesrettigheder',
      body: `
        Vi vil gerne sikre os, at du er fuldt ud klar over alle dine databeskyttelsesrettigheder. Enhver bruger er berettiget til følgende:
        Retten til indsigt - Du har ret til at anmode om kopier af dine personoplysninger.
        Retten til berigtigelse - Du har ret til at anmode om, at vi retter enhver information, du mener er unøjagtig. Du har også ret til at anmode om, at vi udfylder de oplysninger, du mener er ufuldstændige.
        Retten til sletning - Du har ret til at anmode om, at vi sletter dine personoplysninger under visse betingelser.
        Ret til at begrænse behandlingen - Du har ret til at anmode om, at vi begrænser behandlingen af dine personoplysninger under visse betingelser.
        Ret til at gøre indsigelse mod behandling - Du har ret til at gøre indsigelse mod vores behandling af dine personoplysninger under visse betingelser.
        Retten til dataportabilitet - Du har ret til at anmode om, at vi overfører de data, som vi har indsamlet, til en anden organisation eller direkte til dig under visse betingelser.
        Hvis du fremsætter en anmodning, har vi en måned til at svare dig. Hvis du ønsker at udøve nogen af disse rettigheder, bedes du kontakte os pr email (afkpost@gmail.com).
      `
    },
    children: {
      title: "Børns information",
      body: `
        En anden del af vores prioritet er at tilføje beskyttelse til børn, mens de bruger internettet. Vi opfordrer forældre og værger til at observere, deltage i og/eller overvåge og guide deres onlineaktivitet.
        WeWish indsamler ikke bevidst nogen personlig identificerbar information fra børn under 13 år. Hvis du mener, at dit barn har givet denne form for information på vores hjemmeside, opfordrer vi dig kraftigt til at kontakte os med det samme, og vi vil gøre vores bedste for straks at fjerne sådanne oplysninger fra vores optegnelser.
      `
    }
  }
}
