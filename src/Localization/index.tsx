import React, { createContext, useState, useEffect, useContext } from 'react';

export type Lang = 'en' | 'da';

export const supportedLangs: ReadonlyArray<Lang> = ['en', 'da'];

export const defaultLang = supportedLangs[(navigator.languages || [])
  .map(locale => locale.split('-')[0])
  .map(lang => supportedLangs.indexOf(lang as any))
  .filter(index => index !== -1)
  .concat(0)[0]];

const Context = createContext<Translation>(null as any)

type Props = {
  lang: Lang
  children: React.ReactNode
}

export const Localize = ({ children, lang }: Props) => {
  const [translation, setTranslation] = useState<Translation | null>(null)

  useEffect(() => {
    let cancelled = false
    import(`./${lang}`)
      .then(({ Lang }) => {
        if (!cancelled) {
          setTranslation(Lang)
        }
      })

    return () => {
      cancelled = true
    }
  }, [lang])

  if (translation === null) {
    return null
  }

  return <Context.Provider value={translation}>
    {children}
  </Context.Provider>
}

export type WithTranslation = { translation: Translation };
export function WithTranslation<TProps>(Component: React.ComponentType<TProps & WithTranslation>) {
  return (props: TProps) => <Context.Consumer>{translation =>
    <Component translation={translation} {...props} />
  }</Context.Consumer>
}

export const useTranslation = () => useContext(Context)
