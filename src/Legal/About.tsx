import { FC } from 'react';
import { useTranslation } from '../Localization';
import { Section } from './Section';
import { Title, P } from './Typographies';
import { Link } from 'react-router-dom';
import { IonContent, IonPage, IonTitle } from '@ionic/react';
import { Header } from '../Controls/Header';
import { BackButton } from '../Controls/BackButton';

export const About: FC = () => {
  const { about, login } = useTranslation()
  return (
    <IonPage>
      <Header>
        <BackButton />
        <IonTitle>{about.title}</IonTitle>
      </Header>
      <IonContent>
        <Section>
          <Title>Version: {process.env.REACT_APP_VERSION}</Title>
          <Title>User agent: {navigator.userAgent}</Title>
          <P>
            <Link to='/policy'>{login.policy}</Link>
          </P>
          <P>
            <Link to='/terms'>{login.terms}</Link>
          </P>
        </Section>
      </IonContent>
    </IonPage>
  );
}
