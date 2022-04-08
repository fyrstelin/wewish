import { useState } from './Provider';
import { Page } from './Page';
import { useApi } from './api';
import { Loader } from '../Controls/Loader';

type Props = {
  id: string
};

export const WishlistSettings = ({ id }: Props) => {
  const state = useState(id)
  const api = useApi(id)

  return state ? <Page
    id={id}
    wishlist={state}
    onSave={api.save}
    onDelete={api.delete}
    onAddCoOwner={api.addCoOwner}
    onReset={api.reset}
    onRemoveMember={api.removeMember}
  /> : <Loader />
}
