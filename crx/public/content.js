const get = (() => {
    const _ = (selector, toString) => 
        () => {
            const x = document.querySelectorAll(selector);
            const format = toString || (y => y.innerHTML);
            if (x.length > 0) {
                const res = format(x[0]);
                return res;
            }
            return undefined;
        }

    const getIt = (...candidates) => () => {
        for (const candidate of candidates) {
            const x = candidate();
            if (x !== undefined) return x;
        }
        return null
    }

    const meta = (properties) => {
        const selector = `meta${Object.keys(properties).map(key => `[${key}="${properties[key]}"]`).join(' ')}`;
        return _(selector, x => x.content);
    }

    return {
        name: getIt(
            meta({ property: 'og:title'}),
            meta({ property: 'twitter:title'}),
            meta({ name: 'title' }),
            _('title'),
        ),
        description: getIt(
            meta({ name: 'description'}),
            meta({ name: 'twitter:description' }),
        ),
        category: getIt(
            meta({ property: 'product:category'}),
        ),
        imageUrl: getIt(
            meta({ property: 'og:image' }),
            meta({ name: 'twitter:image' }),
            meta({ name: 'image' }),
        ),
        url: getIt(
            meta({ property: 'og:url'}),
        )
    }
})();

const api = {
    getWish: () => {
        return {
            name: get.name(),
            description: get.description(),
            category: get.category(),
            imageUrl: get.imageUrl(),
            url: get.url()
        }
    }
}

chrome.runtime.onMessage.addListener(({ method, content }, sender, reply) => {
    const fn = api[method];
    if (fn) {
        const result = fn(content);
        if (result.constructor === Promise) {
            result.then(reply);
            return true;
        }
        reply(result);
    }
});