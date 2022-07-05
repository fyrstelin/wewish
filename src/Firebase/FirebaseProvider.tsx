import { FirebaseComponent } from './FirebaseComponent';
import { IonProgressBar } from '@ionic/react';
import { ReactNode } from 'react';

type Props<TState> = {
  render: (state: TState) => ReactNode
}

export abstract class FirebaseProvider<TProps, TState> extends FirebaseComponent<TProps & Props<TState>, TState> {
  protected fallback(): ReactNode {
    return (
      <IonProgressBar type='indeterminate' color='secondary' />
    );
  }

  render() {
    return this.state
      ? this.props.render(this.state)
      : this.fallback()
  }
}
