import { FC } from 'react';
import { Wishlists } from './Wishlists';
import { Fab } from '../Controls/Fab';
import { useTranslation } from '../Localization';
import { Requires } from '../Skills';
import { useApi } from './Api';
import * as Models from './Models';
import { addSharp } from 'ionicons/icons';

type Props = {
  home: Models.Home
}

export const Home: FC<Props> = ({ home }) => {
  const translation = useTranslation()
  const api = useApi()

  const addWishlist = async () => {
    api.addWishlist(translation.home['wish-list']);
  }

  return (
    <Requires skills={['add-wish-list']}>
      <Wishlists
        wishlists={home.wishlists}
      />
      <Fab
        onClick={addWishlist}
        teaches='add-wish-list'
      >{addSharp}</Fab>
    </Requires>
  )
}
