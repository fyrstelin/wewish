import { FC } from 'react';
import { Skill, Teaches } from '../Skills';
import { useTranslation } from '../Localization';
import { Help } from '../Controls/Help';
import { IonButton, IonIcon } from '@ionic/react';

type Props = {
  icon: string
  onClick?: () => void
  disabled?: boolean
  href?: string
  teaches?: Skill
};

export const SimpleMenuButton: FC<Props> = ({
  disabled,
  onClick,
  href,
  icon,
  teaches
}) => {
  const { tutorial } = useTranslation()

  return (
    <IonButton
      onClick={onClick}
      disabled={disabled}
      routerLink={href}>
      <IonIcon icon={icon} slot='icon-only'/>
      {teaches && <Teaches skill={teaches}>
        <Help variant='menu-button'>{tutorial[teaches]}</Help>
      </Teaches>}
    </IonButton>
  );
}
