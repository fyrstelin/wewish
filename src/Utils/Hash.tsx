import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";

type Value = string | true | undefined
type WritableHash = Record<string, Value>
export type Hash = Readonly<WritableHash>

type Context = {
  hash: Record<string, Value>
  patch: (hash: Hash) => void
}

const context = createContext<Context>({
  hash: {},
  patch: () => null
})

const parse = (hash: string): Hash => hash.slice(1)
  .split('&')
  .map(arg => arg.split('=').map(e => decodeURIComponent(e)))
  .reduce((acc, [key, value]) => {
    acc[key] = value === undefined ? true : value;
    return acc;
  }, {} as WritableHash)

const stringify = (hash: Hash): string => Object.entries(hash)
  .map(([key, value]) => {
    switch (value) {
      case undefined: return []
      case true: return [key]
      default: return [key, value]
    }
  })
  .map(args => args.map(e => encodeURIComponent(e)).join('='))
  .filter(Boolean)
  .join('&')

export const HashController: FC<PropsWithChildren> = ({
  children
}) => {
  const history = useHistory()
  const [hash, setHash] = useState<Record<string, Value>>(parse(history.location.hash))

  useEffect(() => {
    let currentHash = history.location.hash

    return history.listen(e => {
      if (e.hash === currentHash) {
        return
      }
      currentHash = e.hash

      setHash(parse(currentHash))
    })
  }, [history])

  const value = useMemo<Context>(() => ({
    hash,
    patch: (patch) => {
      const newHash = stringify({
        ...hash,
        ...patch
      })
      window.location.hash = newHash;
    }
  }), [hash])
  
  return <context.Provider value={value}>
    {children}
  </context.Provider>
}

export const useHashController = () => useContext(context)
export const useHash = <TValue extends Value = Value>(key: string): [TValue | undefined, (value: TValue | undefined) => void] => {
  const ctrl = useHashController()
  const set = useCallback((value: TValue | undefined) => {
    ctrl.patch({ [key]: value });
  }, [ctrl, key])
  return [
    ctrl.hash[key] as TValue,
    set
  ]
}
