import React from 'react';
import * as Firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { WithAuth } from './Auth';

export type FirebaseUser = Firebase.User | null;

type Props = {
  children: (user: FirebaseUser) => React.ReactNode
}

type State = {
  user: FirebaseUser
};

export const User = WithAuth(class User extends React.PureComponent<Props & WithAuth, State> {
  state = {
    user: null
  };

  private subscription = new Subscription();

  constructor(props: Props & WithAuth) {
    super(props);
    this.subscription.add(this.props.auth.onAuthStateChanged(user => this.setState({ user })));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return this.props.children(this.state.user);
  }
});