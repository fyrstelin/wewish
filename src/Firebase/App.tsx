import React, { useContext } from 'react';
import Firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/analytics'
import 'firebase/performance'

type Props = {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  measurementId: string
  appId: string
};

export const Context = React.createContext<Firebase.app.App>(null as any);
export const { Consumer, Provider } = Context

export class App extends React.PureComponent<Props> {
  app: Firebase.app.App;

  constructor(props: Props) {
    super(props);
    this.app = Firebase.initializeApp(props);
  }

  UNSAFE_componentWillReceiveProps() {
    throw new Error('Cannot change props for Firebase.App');
  }

  render() {
    return <Provider value={this.app}>
      {this.props.children}
    </Provider>;
  }
}

export const useApp = () => useContext(Context)
