import React from 'react';
import { WithTranslation } from '../Localization';
import { IonLabel, IonButton, IonIcon, IonButtons } from '@ionic/react';
import { remove, add, infinite } from 'ionicons/icons';

type TAmount = number | 'unlimited';

export type Model = {
    value: TAmount | undefined
    backingValue: TAmount
};
export const Initialize = (backingValue: TAmount): Model => ({
    backingValue,
    value: undefined
});
export const Update = (model: Model, backingValue: TAmount): Model => ({
    ...model,
    backingValue
});
export const Flush = (model: Model): Model => ({
    value: undefined,
    backingValue: model.value === undefined ? model.backingValue : model.value
});
export const Value = (model: Model) => model.value;
export const Values = <T, _ = null>(models: {[key in keyof T]: Model}): {[key in keyof T]?: TAmount} => 
    Object.keys(models)
        .map(x => x as keyof T)
        .reduce((data, key) => models[key].value === undefined
            ? data
            : { ...data, [key]: models[key].value}, {});

export const IsDirty = (model: Model) => model.value !== undefined;

type Props = {
    model: Model
    onChange: (model: Model) => void
}

export const Amount = 
    WithTranslation(    
    class Amount extends React.PureComponent<Props & WithTranslation> {

        readonly minusOne = () => this.props.onChange({ ...this.props.model, value: this.add(-1)})
        readonly addOne = () => this.props.onChange({ ...this.props.model, value: this.add(1)})
        readonly unlimited = () => this.props.onChange({ ...this.props.model, value: 'unlimited'});

        render() {
            const { model } = this.props;
            const value = model.value === undefined ? model.backingValue : model.value;
            const { wish } = this.props.translation;
            return (
                <>
                    <IonLabel position='stacked' color='medium'>{wish.amount}</IonLabel>
                    <IonButtons slot='end'>
                        <IonButton 
                            onClick={this.minusOne}
                            disabled={typeof(value) === 'string' || value === 1}>
                            <IonIcon slot='icon-only' icon={remove}/>
                        </IonButton>
                        <span>{this.format()}</span>
                        <IonButton onClick={this.addOne}>
                            <IonIcon slot='icon-only' icon={add}/>
                        </IonButton>
                        <IonButton onClick={this.unlimited}>
                            <IonIcon slot='icon-only' icon={infinite}/>
                        </IonButton>
                    </IonButtons>
                </>
            );
        }

        format = () => {
            const { model } = this.props;
            const value = model.value === undefined ? model.backingValue : model.value;
            if (value === 'unlimited') {
                return '∞';
            }
            return value;
        }

        add = (i: number) => {
            const { model } = this.props;
            const value = model.value === undefined ? model.backingValue : model.value;
            if (typeof(value) === 'string') {
                return i;
            }
            return value + i;
        }
    }
);