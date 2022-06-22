import { FC, MouseEvent, PropsWithChildren } from 'react';
import { IonItem } from '@ionic/react';
import { useNavigate } from 'react-router';

type Props = {
  href?: string
  class?: string
  onClick?: (e: MouseEvent) => void
  button?: true
  detail?: boolean
}

export const Item: FC<PropsWithChildren<Props>> = (props) => {
  const { href, onClick } = props
  const navigate = useNavigate()

  const handleClick = (e: MouseEvent) => {
    if (href) {
      e.preventDefault();
      navigate(href)
    }

    if (onClick) {
      onClick(e);
    }
  }
  return (
    <IonItem {...props} onClick={handleClick} />
  )
}
