import { FC } from 'react';
import { Page } from '../Page';
import { useTranslation } from '../Localization';
import { Section } from './Section';
import { Title, P } from './Typographies';
import { Link } from 'react-router-dom';

export const About: FC = () => {
  const { about, login } = useTranslation()
  return (
    <Page title={about.title} parent='/'>
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
    </Page>
  );
}
