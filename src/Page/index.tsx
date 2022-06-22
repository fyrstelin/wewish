import { FC, PropsWithChildren, ReactNode } from 'react';
import { Header } from './Header';
import { Title } from '../Controls/Portals/Title';
import { IonContent } from '@ionic/react';
import cx from 'classnames';

type Props = {
  title?: string
  headerContent?: ReactNode
  parent?: string
  buttons?: ReactNode
  classNames?: string
};

export const Page: FC<PropsWithChildren<Props>> = ({ title, parent, buttons, headerContent, classNames, children }) => (
  <>
    <Title>{title || 'WeWish'}</Title>
    <Header
      title={title}
      parent={parent}
      rightContent={buttons}
    >{headerContent}</Header>
    <IonContent fullscreen class={cx('non-printable', classNames)}>
      {children}
    </IonContent>
  </>
)
