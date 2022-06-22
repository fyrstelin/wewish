import { ComponentType, createContext, PropsWithChildren, PureComponent } from "react";

const context = createContext<Dictionary<string | true>>({});

export type WithHash = {
  hash: Dictionary<string | true>
}
export function WithHash<TProps>(C: ComponentType<TProps & WithHash>) {
  return (props: TProps) => <context.Consumer>{hash =>
    <C hash={hash} {...props} />
  }</context.Consumer>
}

type State = {
  hash: Dictionary<string | true>
}

const deserialize = (hash: string) => (hash && hash.substring(1))
  .split('&')
  .filter(x => !!x)
  .map(x => x.split('='))
  .reduce((acc, [key, value]) => ({
    ...acc,
    [decodeURIComponent(key)]: value === undefined || decodeURIComponent(value)
  }), {} as Dictionary<string | true>)

const serialize = (hash: Dictionary<string | true | undefined>) =>
  Object.keys(hash)
    .map(key => ({ key, value: hash[key] }))
    .filter(({ value }) => value !== undefined)
    .map(({ key, value }) => ({
      key: encodeURIComponent(key),
      value: value === true ? undefined : encodeURIComponent(value!)
    }))
    .map(({ key, value }) => value === undefined
      ? key
      : `${key}=${value}`)
    .join('&')

type HashController = {
  set: (key: string, value?: string | true) => void
  remove: (key: string) => void
}
const HashController: HashController = (() => {
  const history: string[] = [];
  return {
    set: (key: string, value?: string | true) => {
      history.push(key);
      window.location.hash = serialize({
        ...deserialize(window.location.hash),
        [key]: value === undefined ? true : value
      })
    },
    remove: (key: string) => {
      if (history.length === 0) {
        const hash = serialize({
          ...deserialize(window.location.hash),
          [key]: undefined
        });
        console.log(key, hash);
        window.location.replace(window.location.href.split('#')[0] + '#' + hash);
      } else if (history[history.length - 1] === key) {
        history.pop();
        window.history.back();
      } else {
        history.push(key);
        window.location.hash = serialize({
          ...deserialize(window.location.hash),
          [key]: undefined
        })
      }
    }
  }
})();

export const useHashController = () => HashController

export type WithHashController = { hashController: HashController }
export function WithHashController<TProps>(C: ComponentType<TProps & WithHashController>) {
  return (props: TProps) => <C hashController={HashController} {...props} />
}

export class Hash extends PureComponent<PropsWithChildren, State> {
  state: State = {
    hash: {}
  }

  constructor(props: {}) {
    super(props);
    this.state = {
      hash: deserialize(window.location.hash)
    }
    window.addEventListener('hashchange', this.hashChanged);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.hashChanged);
  }

  private hashChanged = () => {
    const hash = deserialize(window.location.hash);
    this.setState({ hash });
  }

  render() {
    return <context.Provider value={this.state.hash}>
      {this.props.children}
    </context.Provider>
  }
}
