import { PureComponent, Children, ReactNode } from 'react'
import { WithTranslation } from '../Localization';
import { IonList, IonItem } from '@ionic/react';

type Props = {
  title?: string
  onSave: false | (() => void)
  children: ReactNode
};

export const Editor =
  WithTranslation(
    class Editor extends PureComponent<Props & WithTranslation> {
      render() {
        const { children, onSave } = this.props;
        const { controls } = this.props.translation;
        return (
          <IonList>
            {Children.map(children, (child, i) =>
              <IonItem key={i}>
                {child}
              </IonItem>
            )}
            {<IonItem type='button' onClick={this.save} disabled={!onSave}>
              {controls.editor.save}
            </IonItem>}
          </IonList>
        );
      }

      private save = () => {
        if (this.props.onSave) {
          this.props.onSave();
        }
      }
    }
  );
