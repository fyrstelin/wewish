import React from 'react';
import { IonItemOptions, IonItemOption, IonIcon } from '@ionic/react';

type Props = {
    color: 'danger' | 'success'
    icon: { ios: string, md: string }
    onSwipe: () => void
}

export class Swipe extends React.PureComponent<Props> {
    render() {
        const { color, onSwipe, icon } = this.props;
        return <>
            <IonItemOptions side='start' onIonSwipe={onSwipe}>
                <IonItemOption color={color} onClick={onSwipe} expandable>
                    <IonIcon icon={icon} size='large'/>
                </IonItemOption>
            </IonItemOptions>
            <IonItemOptions side='end' onIonSwipe={onSwipe}>
                <IonItemOption color={color} onClick={onSwipe} expandable>
                    <IonIcon icon={icon} size='large'/>
                </IonItemOption>
            </IonItemOptions>
        </>
    }
}