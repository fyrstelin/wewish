import { ColorResult, SwatchesPicker } from 'react-color';
import cx from 'classnames';
import './index.css';
import { IonContent, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { Modal } from '../Modal';
import { WithHashController } from '../../Utils/Hash';
import { save } from 'ionicons/icons';
import { PureComponent } from 'react';

export type Model = {
  value: string | undefined,
  backingValue: string
};
export const Initialize = (backingValue: string | undefined): Model => ({
  backingValue: backingValue || '',
  value: undefined
});
export const Update = (model: Model, backingValue: string | undefined): Model => ({
  ...model,
  backingValue: backingValue || ''
});
export const Flush = (model: Model): Model => ({
  value: undefined,
  backingValue: model.value || model.backingValue
});

export const Value = (model: Model) => (model.value === undefined ? undefined : model.value.trim());
export const Values = <T extends any>(models: { [key in keyof T]: Model }): { [key in keyof T]?: string } =>
  Object.keys(models)
    .map(x => x as keyof T)
    .reduce((data, key) => models[key].value === undefined
      ? data
      : { ...data, [key]: models[key].value }, {});

export const IsDirty = (model: Model) => model.value !== undefined;

type Props = {
  id: string
  title: string
  model: Model
  fallbackColor?: 'primary' | 'secondary'
  onChange: (model: Model) => void
  onSave: () => Promise<void>
};

export const ColorInput =
  WithHashController(
    class ColorInput extends PureComponent<Props & WithHashController> {

      private open = () => this.props.hashController.set('modal', this.props.id);
      private close = () => {
        this.props.onChange({
          ...this.props.model,
          value: undefined
        })
      }
      private save = async () => {
        await this.props.onSave();
      }

      private changeColor = (result: ColorResult) =>
        this.props.onChange({
          ...this.props.model,
          value: result.hex
        });

      render() {
        const { model, fallbackColor, title, id } = this.props;

        const color = model.value || model.backingValue;

        return (
          <div className='color-input'>
            <div
              className={cx('button', fallbackColor)}
              onClick={this.open}
              style={{
                background: color
              }}
            />
            <Modal
              id={id}
              color={fallbackColor}
              onDismiss={this.close}
              header={<>
                <IonTitle>{title}</IonTitle>
                <IonButtons slot='end'>
                  <IonButton onClick={this.save} >
                    <IonIcon icon={save} />
                  </IonButton>
                </IonButtons>
              </>}
            >
              <IonContent>
                <div className='color-input__color-picker'>
                  <SwatchesPicker
                    color={color}
                    onChange={this.changeColor}
                  />
                </div>
              </IonContent>
            </Modal>
          </div>
        );
      }
    }
  )
