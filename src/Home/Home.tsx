import { FC } from 'react';
import { Wishlists } from './Wishlists';
import { Page } from '../Page';
import { Fab } from '../Controls/Fab';
import { Buttons } from './Buttons';
import { useTranslation } from '../Localization';
import { Requires } from '../Skills';
import { useApi } from './Api';
import * as Models from './Models';
import { add } from 'ionicons/icons';

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
      <Page title='WeWish' buttons={<Buttons onLogout={api.signout} />}>
        <Wishlists
          wishlists={home.wishlists}
        />
        <Fab
          onClick={addWishlist}
          teaches='add-wish-list'
        >{add}</Fab>
      </Page>
    </Requires>
  )
}
