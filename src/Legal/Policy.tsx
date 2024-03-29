import { FC } from 'react';
import { IonLabel, IonList, IonItem, IonListHeader, IonPage, IonTitle, IonContent } from '@ionic/react';
import { useTranslation } from '../Localization';
import styles from './styles.module.css'
import { Header } from '../Controls/Header';
import { BackButton } from '../Controls/BackButton';

const Section: FC<{
  title?: string
  children: string
}> = ({ title, children }) => {
  const lines = children
    .split('\n')
    .map(l => l.trim())
    .filter(x => !!x)


  return (
    <>
      {title && <IonListHeader color='light'>
        {title}
      </IonListHeader>}
      <IonItem>
        <IonLabel>
          {lines.map((l, i) => <p key={i}>{l}</p>)}
        </IonLabel>
      </IonItem>
    </>
  )
}

export const Policy: FC = () => {
  const { policy: t } = useTranslation()

  return (
    <IonPage>
      <Header>
        <BackButton>/about</BackButton>
        <IonTitle>{`WeWish - ${t.title}`}</IonTitle>
      </Header>
      <IonContent>
        <IonList lines='none' className={styles.list}>
          <IonItem>{t['revision-date']}</IonItem>
          <Section>{t.intro}</Section>
          <Section title={t.consent.title}>{t.consent.body}</Section>
          <Section title={t.information.title}>{t.information.body}</Section>
          <Section title={t.gdpr.title}>{t.gdpr.body}</Section>
          <Section title={t.children.title}>{t.children.body}</Section>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
