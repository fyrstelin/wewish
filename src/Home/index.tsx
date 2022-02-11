import React from 'react';
import { Api } from "./Api";
import { QueryHome } from './Provider';
import { Home } from './Home';
import { Process } from './Process';
import { useStream } from '../Utils/useStream';
import { Page } from '../Page';
import { IonList } from '@ionic/react';
import { Divider, Item } from '../Controls/Skeletons';

export const Root = () => {
  const home = useStream(QueryHome())

  return home
    ? <Api>
      <Process uid={home.uid} />
      <Home home={home} />
    </Api>
    : <Page title='WeWish'>
      <IonList>
        <Divider />
        <Item />
        <Item />
        <Divider />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </IonList>
    </Page>
}
