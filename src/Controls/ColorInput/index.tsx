import { ColorResult, SwatchesPicker } from 'react-color';
import cx from 'classnames';
import './index.css';
import { IonContent, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { Modal, useModalController } from '../Modal';
import { saveSharp } from 'ionicons/icons';
import { FC } from 'react';

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

export const ColorInput: FC<Props> = ({ model, fallbackColor, title, id, onChange, onSave }) => {
  const color = model.value || model.backingValue;

  const [open, close] = useModalController(id)

  const changeColor = (result: ColorResult) =>
    onChange({
      ...model,
      value: result.hex
    });

  return (
    <div className='color-input'>
      <div
        className={cx('button', fallbackColor)}
        onClick={() => open()}
        style={{
          background: color
        }}
      />
      <Modal
        id={id}
        color={fallbackColor}
        onDismiss={close}
        header={<>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={onSave} >
              <IonIcon icon={saveSharp} />
            </IonButton>
          </IonButtons>
        </>}
      >
        <IonContent>
          <div className='color-input__color-picker'>
            <SwatchesPicker
              color={color}
              onChange={changeColor}
            />
          </div>
        </IonContent>
      </Modal>
    </div>
  );
}
