import { memo } from 'react'
import { Page } from "../Page";
import { IonProgressBar } from "@ionic/react";

export const Loader = memo(() =>
  <Page>
    <IonProgressBar type='indeterminate' color='secondary' />
  </Page>
)
