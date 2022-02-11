import React from 'react';
import { Id } from '../Utils';
import { IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { SelectChangeEventDetail } from '@ionic/core';

export type Model = {
    value: string | undefined
    backingValue: string
};

export const Initialize = (backingValue: string | undefined): Model => ({
    backingValue: backingValue || '',
    value: undefined
});
export const Update = (model: Model, backingValue: string | undefined): Model => ({
    ...model,
    backingValue: backingValue || ''
});
export const Flush = (model: Model): Model => ({
    value: undefined,
    backingValue: model.value || model.backingValue
});

export const Value = (model: Model) => (model.value === undefined ? undefined : model.value.trim());

type Props = {
    model: Model
    source: ReadonlyArray<string>
    onChange: (model: Model) => void
    label?: string
    fullWidth?: true
    format?: (x: string) => string
};

export class SelectInput extends React.PureComponent<Props> {
    readonly id = `${SelectInput.name}-${Id(12)}`;

    private onChange = (e: CustomEvent<SelectChangeEventDetail>) =>
        this.props.onChange({...this.props.model, value: e.detail.value})
 
    render() {
        const { label, model, source, format } = this.props;

        return (
            <>
                <IonLabel color='medium'>{label}</IonLabel>
                <IonSelect
                    value={model.value || model.backingValue}
                    onIonChange={this.onChange}
                >
                    { source.map(x => 
                        <IonSelectOption value={x} key={x}>{format ? format(x) : x}</IonSelectOption>
                    )}
                </IonSelect>
            </>
        );
    }
}