import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';

import { spawn } from 'ts-process-promises';
import { dirname, basename, join} from 'path';
import * as os from 'os';
import * as fs from 'fs';

import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
// import { migrate } from './migrations';
import { pushToFactory } from './fcm-pusher'

import { createHash } from 'crypto'

const app = admin.initializeApp();


// migrate(app)
//     .then(() => console.log('Migrated succesfully.'))
//     .catch(() => console.error('Could not migrate.'));

const pushTo = pushToFactory(app);

const ID_CHARS = '1234567890abcdefghijklmnopqrstuvwxyz';

type Dictionary<T> = {
  [key: string]: T
}

const Id = (size = 32) => {
  let id = '';
  for (let i = 0; i < size; i++) {
    id += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return id;
}

const db = app.database();
const bucket = app.storage().bucket();

const unlink = (p: string) =>
  new Promise((r, q) => fs.unlink(p, err => {
    if (err) {
      q();
    } else {
      r();
    }
  })
  );

export const registerUser = functions.auth.user().onCreate(async ({ uid, displayName }) => {
  if (displayName) {
    await admin.database().ref(`/users/${uid}/name`).set(displayName);
  }

  const admins = await admin.database()
    .ref(`/users`)
    .orderByChild('isAdmin').equalTo(true)
    .once('value')
    .then(x => Object.keys(x.val() || {}));

  await pushTo(admins, {
    type: 'NEW_USER',
    name: displayName || 'John Doe'
  });
});

export type addWish = {
  url: string
  wishlistId: string
  category: string | null
};


const get = (() => {
  type Candidate = (x: cheerio.Cheerio) => string
  const _ = (selector: string, toString?: (x: cheerio.Cheerio) => string): Candidate =>
    (e: cheerio.Cheerio) => {
      const x = e.find(selector);
      const format = toString || ((y: cheerio.Cheerio) => y.text());
      if (x.length > 0) {
        const res = format(x);
        return res;
      }
      return undefined;
    }

  const any: Candidate = () => null;

  const getIt = (field: string, ...candidates: ReadonlyArray<Candidate>) => (e: cheerio.Cheerio) => {
    for (const candidate of candidates) {
      const x = candidate(e);
      if (x !== undefined) return x;
    }
    throw new functions.https.HttpsError('not-found', `Could not find ${field}.`)
  }

  const meta = (properties: Dictionary<string>) => {
    const selector = `meta${Object.keys(properties).map(key => `[${key}="${properties[key]}"]`).join(' ')}`;
    return _(selector, x => x.attr('content'));
  }

  return {
    name: getIt('name',
      meta({ property: 'og:title' }),
      meta({ property: 'twitter:title' }),
      meta({ name: 'title' }),
      _('title')
    ),
    description: getIt('description',
      meta({ name: 'description' }),
      meta({ name: 'twitter:description' }),
      any
    ),
    category: getIt('category',
      meta({ property: 'product:category' }),
      any
    ),
    imageUrl: getIt('image',
      meta({ property: 'og:image' }),
      meta({ name: 'twitter:image' }),
      meta({ name: 'image' }),
      any
    ),
    url: getIt('url',
      meta({ property: 'og:url' }),
      any
    )
  }
})();

export const addWish = functions
  .region('europe-west1')
  .https.onCall(async ({ url: _url, wishlistId, category }: addWish, ctx) => {
    const url = new URL(_url);
    if (!ctx.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'duuh');
    }
    const hasAccess = await db.ref(`/wishlists/${wishlistId}/members/${ctx.auth.uid}`)
      .once('value')
      .then(x => x.val() === 'owner');

    if (!hasAccess) {
      throw new functions.https.HttpsError('permission-denied', `You do not own ${wishlistId}`);
    }

    const response = await axios.get(url.href, {
      timeout: 1000,
      headers: {
        'User-Agent': 'WeWish.app/2.0'
      }
    })

    const $ = cheerio.load(response.data, {
      xmlMode: true
    })

    const head = $('head');
    const name = get.name(head);
    const description = get.description(head);
    const cat = category || get.category(head);
    const href = get.url(head) || url.href

    const wishId = Id(8);

    await db.ref().update({
      [`/wishlists/${wishlistId}/wishes/${wishId}`]: true,
      [`/wishes/${wishId}`]: {
        wishlistId,
        name,
        description,
        category: cat,
        url: href
      }
    });

    const [imageUrl] = [get.imageUrl(head)]
      .filter(x => !!x)
      .map(x => {
        if (x.startsWith('//')) {
          return url.protocol + x;
        }
        if (!x.startsWith('http')) {
          return url.origin + x;
        }

        return x;
      });

    if (imageUrl) {
      const imgResponse = await axios.get(imageUrl, {
        responseType: 'stream'
      })
      const contentType = imgResponse.headers['Content-Type']
      const file = bucket.file(`uploads/${Id(32)}`)
     
      const stream = file.createWriteStream({
        contentType,
        metadata: {
          metadata: {
            'firebaseStorageDownloadTokens': Id(32),
            'wish-id': wishId
          }
        }
      })

      await new Promise((r, q) => imgResponse.data
          .pipe(stream)
          .on('finish', r)
          .on('error', q))
    }
  })

type redeemInvite = { code: string };
export const redeemInvite = functions
  .region('europe-west1', 'us-central1')
  .https.onCall(async (data: redeemInvite, ctx) => {
    if (ctx.auth) {
      if (!data && !data.code) {
        throw new functions.https.HttpsError('invalid-argument', 'provide code');
      }
      const wishlistIdRef = await db.ref(`/invites/${data.code}`).once('value');
      if (!wishlistIdRef.exists()) {
        throw new functions.https.HttpsError('not-found', `${data.code} not found`);
      }

      const wishlistId = wishlistIdRef.val();
      await db.ref().update({
        [`/invites/${data.code}`]: null,
        [`/wishlists/${wishlistId}/members/${ctx.auth.uid}`]: 'owner',
        [`/users/${ctx.auth.uid}/wishlists/${wishlistId}`]: true,
      });
    } else {
      throw new functions.https.HttpsError('unauthenticated', 'duh');
    }
  });

type resetWishlist = { listId: string };
export const resetWishlist = functions
  .region('europe-west1', 'us-central1')
  .https.onCall(async (data: resetWishlist, ctx) => {
    if (ctx.auth) {
      if (!data || !data.listId) {
        throw new functions.https.HttpsError('invalid-argument', 'provide listId');
      }

      const isOwner = await db.ref(`/wishlists/${data.listId}/members/${ctx.auth.uid}`)
        .once('value')
        .then(x => x.val() === 'owner');
      if (!isOwner) {
        throw new functions.https.HttpsError('permission-denied', 'duh');
      }

      const wishIds = Object.keys((await db.ref(`/wishlists/${data.listId}/wishes`).once('value')).val() || {});
      const updates = wishIds.reduce((acc, id) => ({
        ...acc,
        [id]: null
      }), {});
      await db.ref('bought-wishes').update(updates);
    } else {
      throw new functions.https.HttpsError('unauthenticated', 'duh');
    }
  });

export const handleAccessRequest = functions
  .region('europe-west1')
  .database.ref('/requests/{id}')
  .onCreate(async snapshot => {
    const { wishlistId, requester } = snapshot.val() as { requester: string, wishlistId: string };

    const s = await db.ref(`/wishlists/${wishlistId}/members`)
      .once('value');
    const v = (s.val() || {}) as { [key: string]: string };
    const owners = Object.keys(v)
      .filter(x => v[x] === 'owner');

    const username = (await db.ref(`/users/${requester}/name`)
      .once('value')).val() || '';
    const wishlistTitle = (await db.ref(`/wishlists/${wishlistId}/title`)
      .once('value')).val() || '';


    await pushTo(owners, {
      type: 'ACCESS_REQUEST',
      userId: requester,
      username,
      wishlistId,
      wishlistTitle
    })
  });

export const handleImageUpload = functions
  .region('europe-west1')
  .runWith({ memory: '1GB' })
  .storage.object().onFinalize(async data => {
    const filePath = data.name;

    if (dirname(filePath) !== 'uploads') {
      return;
    }

    const fileName = basename(filePath);

    const tmpFilePath = join(os.tmpdir(), fileName);
    const tmpThumbPath = join(os.tmpdir(), `thumb_${fileName}`);
    const file = bucket.file(data.name);

    const metadata = await file.getMetadata()
      .then(([x]) => x);

    const wishId = metadata.metadata['wish-id'];

    if (!wishId) {
      throw new Error('No wishId found');
    }

    const upload = (sourcePath: string, destination: string) => bucket.upload(sourcePath, {
      destination,
      metadata: {
        ...metadata,
        name: destination,
        crc32c: undefined,
        md5Hash: undefined
      }
    }).then(([x]) =>
      `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(x.name)}?alt=media&token=${metadata.metadata['firebaseStorageDownloadTokens']}`
    );

    try {
      await file.download({
        destination: tmpFilePath
      });

      await Promise.all([
        spawn('convert', [tmpFilePath, '-auto-orient', '-thumbnail', '200x200>', tmpThumbPath]),
        spawn('convert', [tmpFilePath, '-auto-orient', '-resize', '1080x1080>', tmpFilePath])
      ]);

      const [image, thumbnail] = await Promise.all([
        upload(tmpFilePath, `images/${fileName}`),
        upload(tmpThumbPath, `thumbs/${fileName}`)
      ]);

      await file.delete();

      await db.ref(`/wishes/${wishId}`).update({
        image,
        thumbnail
      });
    } finally {
      await Promise.all([
        unlink(tmpFilePath),
        unlink(tmpThumbPath)
      ]).catch();
    }
  })


const dbGet = <T>(path: string, defaultTo?: T): Promise<T> => db.ref(path).once('value')
  .then(s => s ? s.val() : defaultTo)

const htmlTemplate = (() => {
  let templateEtag = ''
  let template = ''
  let validUntil = new Date(0)
  let maxAge = 60

  return async () => {
    const now = new Date()

    if (now > validUntil) {
      console.log('fetching HTML')
      const response = await axios.get('https://wewish.app/index.html', {
        headers: {
          'If-None-Match': templateEtag
        },
        responseType: 'text'
      }).catch(() => null as AxiosResponse)

      if (response) {
        const cacheControl: string = response.headers['cache-control'] ?? ''
        maxAge = parseInt((cacheControl
          .split(',')
          .map(x => x.split('='))
          .find(([key, value]) => key === 'max-age' && value) ?? ['', '60'])[1])

        templateEtag = response.headers['etag']
        template = response.data
      } else {
        maxAge *= 1.2
      }
      maxAge = Math.round(maxAge)
      validUntil = new Date()
      validUntil.setSeconds(validUntil.getSeconds() + maxAge)
    }

    return template
  }
})()

const html = async (meta: { [key: string]: string }) => {
  const template = await htmlTemplate()

  const doc = cheerio.load(template, {
    xmlMode: true
  })

  const head = doc('head')

  for (const [property, value] of Object.entries(meta)) {
    const tag = cheerio('<meta>')
    tag.attr('property', property)
    tag.attr('content', value)
    head.append(tag)
  }
  
  return doc.html()
}

export const host = functions.https.onRequest(async (req, res) => {
  const match = req.path.match(/^\/wishlists\/(\w+)/)

  const meta = {
    'og:url': `https://wewish.app${req.url}`
  } as Record<string, string>

  if (match) {
    const wishlistId = match[1]
    const [title, description] = await Promise.all([
      dbGet<string>(`/wishlists/${wishlistId}/title`, 'WeWish'),
      dbGet<string>(`/wishlists/${wishlistId}/description`, '')
    ])
    meta['og:title'] = title
    meta['og:description'] = description.split('\n').slice(0, 2).join('\n')
  } else {
    meta['og:title'] = 'WeWish'
    meta['og:description'] = 'Gift Coordinating Made Easy'
  }

  const content = await html(meta)

  res
    .header('etag', createHash('sha1')
      .update(content, 'utf8')
      .digest('hex'))
    .header('last-modified', new Date().toUTCString())
    .header('cache-control', 'max-age=3600')
    .status(200)
    .send(content)
})
