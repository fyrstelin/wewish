import { IonItemOptions, IonItemOption, IonIcon } from '@ionic/react';
import { PureComponent } from 'react';

type Props = {
  color: 'danger' | 'success'
  icon: string
  onSwipe: () => void
}

export class Swipe extends PureComponent<Props> {
  render() {
    const { color, onSwipe, icon } = this.props;
    return <>
      <IonItemOptions side='start' onIonSwipe={onSwipe}>
        <IonItemOption color={color} onClick={onSwipe} expandable>
          <IonIcon icon={icon} size='large' />
        </IonItemOption>
      </IonItemOptions>
      <IonItemOptions side='end' onIonSwipe={onSwipe}>
        <IonItemOption color={color} onClick={onSwipe} expandable>
          <IonIcon icon={icon} size='large' />
        </IonItemOption>
      </IonItemOptions>
    </>
  }
}
