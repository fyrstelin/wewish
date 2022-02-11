import React, { useCallback, memo } from 'react';
import { IonInput, IonLabel, IonTextarea } from '@ionic/react';
import { InputChangeEventDetail } from '@ionic/core';

export type Model = {
  value: string | undefined,
  backingValue: string
};
export const Initialize = (backingValue: string | undefined): Model => ({
  backingValue: backingValue || '',
  value: undefined
});
export const Update = (model: Model, backingValue: string | undefined): Model =>
  model.backingValue === (backingValue || '')
    ? model
    : ({
      ...model,
      backingValue: backingValue || ''
    });

export const Flush = (model: Model): Model => model.value === undefined
  ? model
  : ({
    value: undefined,
    backingValue: model.value || model.backingValue
  });

export const Value = (model: Model) => (model.value === undefined ? undefined : model.value.trim());
export const Values = <T, P = null>(models: { [key in keyof T]: Model }): { [key in keyof T]?: string } =>
  Object.keys(models)
    .map(x => x as keyof T)
    .reduce((data, key) => models[key].value === undefined
      ? data
      : { ...data, [key]: models[key].value }, {});

export const IsDirty = (model: Model) => model.value !== undefined;

type Props = {
  model: Model
  onChange: (model: Model) => void
  label?: string
  placeholder?: string
  type?: 'date' | 'multiline'
  onBlur?: () => void
};

export const StringInput = memo(({ model, label, placeholder, type, onBlur, onChange }: Props) => {
  const change = useCallback((e: CustomEvent<InputChangeEventDetail>) =>
    onChange({ ...model, value: e.detail.value === null ? undefined : e.detail.value }),
    [model, onChange])

  return (
    <>
      <IonLabel position='floating' color='medium'>{label}</IonLabel>
      {type === 'multiline'
        ? <IonTextarea
          onBlur={onBlur}
          value={model.value === undefined ? model.backingValue || '' : model.value}
          onIonChange={change}
          placeholder={placeholder}
        />
        : <IonInput
          onBlur={onBlur}
          type={type}
          value={model.value === undefined ? model.backingValue || '' : model.value}
          onIonChange={change}
          placeholder={placeholder}
        />
      }
    </>
  );
})