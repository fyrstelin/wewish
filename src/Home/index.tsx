import { Api } from "./Api";
import { QueryHome } from './Provider';
import { Home } from './Home';
import { Process } from './Process';
import { useStream } from '../Utils/useStream';
import { IonContent, IonPage, IonTitle } from '@ionic/react';
import { Header } from "../Controls/Header";
import { Skeleton } from "./Skeleton";
import { useAuth } from "../Firebase";
import { Buttons } from "./Buttons";

export const Root = () => {
  const home = useStream(QueryHome())
  const auth = useAuth()

  return (
    <IonPage>
      <Header>
        <IonTitle>WeWish</IonTitle>
        <Buttons onLogout={() => auth.signOut()}/>
      </Header>
      <IonContent>
        { home
          ? <Api>
            <Process uid={home.uid} />
            <Home home={home} />
          </Api>
          : <Skeleton/>
        }
      </IonContent>
    </IonPage>
  )
}
