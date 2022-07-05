import { memo } from 'react'
import { IonProgressBar } from "@ionic/react";

export const Loader = memo(() =>
  <IonProgressBar type='indeterminate' color='secondary' />
)
