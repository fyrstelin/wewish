import { WithTranslation } from '../Localization';
import { IonLabel, IonRange, IonIcon, IonButtons, IonButton } from '@ionic/react';
import { RangeChangeEventDetail } from '@ionic/core';
import { logoEuro } from 'ionicons/icons';
import { PureComponent } from 'react';

type SimplePrice = null | 1 | 2 | 3;

export type Model = {
  value: SimplePrice | undefined
  backingValue: SimplePrice
};
export const Initialize = (backingValue: SimplePrice): Model => ({
  backingValue,
  value: undefined
});
export const Update = (model: Model, backingValue: SimplePrice): Model => ({
  ...model,
  backingValue
});
export const Flush = (model: Model): Model => ({
  value: undefined,
  backingValue: model.value === undefined ? model.backingValue : model.value
});
export const Value = (model: Model) => model.value;
export const Values = <T extends any>(models: { [key in keyof T]: Model }): { [key in keyof T]?: SimplePrice } =>
  Object.keys(models)
    .map(x => x as keyof T)
    .reduce((data, key) => models[key].value === undefined
      ? data
      : { ...data, [key]: models[key].value }, {});

export const IsDirty = (model: Model) => model.value !== undefined;

type Props = {
  model: Model
  onChange: (model: Model) => void
}

export const Price =
  WithTranslation(
    class Price extends PureComponent<Props & WithTranslation> {
      changeDisabled = false;

      render() {
        const { model } = this.props;
        const value = model.value === undefined
          ? model.backingValue
          : model.value;
        const { wish } = this.props.translation;
        return (
          <>
            <IonLabel position='stacked' color='medium'>{wish.price}</IonLabel>
            <IonRange
              min={1}
              max={3}
              value={value || 0}
              onIonChange={this.onChange}
              snaps
              color={value == null ? 'medium' : 'primary'}
            >
              <IonIcon icon={logoEuro} slot='start' size='small' color={value === null ? 'medium' : 'primary'} />
              <IonIcon icon={logoEuro} slot='end' size='big' color={value === null ? 'medium' : 'primary'} />
            </IonRange>
            <IonButtons slot='end'>
              <IonButton onClick={this.reset}>
                <IonIcon icon='close' />
              </IonButton>
            </IonButtons>
          </>
        );
      }

      private reset = () => {
        this.changeDisabled = true;
        this.props.onChange({ ...this.props.model, value: null })
        setTimeout(() => {
          this.changeDisabled = false;
        }, 100);
      }

      private onChange = (e: CustomEvent<RangeChangeEventDetail>) => {
        if (!this.changeDisabled) {
          this.props.onChange({ ...this.props.model, value: e.detail.value as any })
        }
      }
    }
  );
