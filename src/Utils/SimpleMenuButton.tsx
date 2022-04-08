import { FC } from 'react';
import { Skill, Teaches } from '../Skills';
import { useTranslation } from '../Localization';
import { Help } from '../Controls/Help';
import { IonButton, IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate()

  return (
    <IonButton
      onClick={e => {
        if (onClick) {
          onClick();
        }
        if (href) {
          e.preventDefault();
          navigate(href);
        }
      }}
      disabled={disabled}
      href={href}>
      <IonIcon icon={icon} />
      {teaches && <Teaches skill={teaches}>
        <Help variant='menu-button'>{tutorial[teaches]}</Help>
      </Teaches>}
    </IonButton>
  );
}
