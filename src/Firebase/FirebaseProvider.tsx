import history from '../Utils/History';
import { Page } from '../Page';
import { FirebaseComponent } from './FirebaseComponent';
import { IonProgressBar } from '@ionic/react';
import { ReactNode } from 'react';

type Props<TState> = {
  render: (state: TState) => ReactNode
}

const states: { [key: string]: any } = {};

export abstract class FirebaseProvider<TProps, TState> extends FirebaseComponent<TProps & Props<TState>, TState> {
  private key: string | undefined;

  componentDidMount() {
    const state = states[this.key || ''];
    if (state) {
      this.setState(state);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    states[this.key || ''] = this.state;
  }

  protected fallback(): ReactNode {
    return (
      <Page>
        <IonProgressBar type='indeterminate' color='secondary' />
      </Page>
    );
  }

  render() {
    this.key = history.location.key;
    return this.state
      ? this.props.render(this.state)
      : this.fallback()
  }
}
