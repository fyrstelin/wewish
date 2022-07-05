import { IonButtons } from "@ionic/react";
import { heartOutline, heartSharp, mailUnreadSharp, settingsSharp } from "ionicons/icons";
import { FC } from "react";
import { useModalController } from "../Controls/Modal";
import { SimpleMenuButton } from "../Utils/SimpleMenuButton";
import { useApi } from "./Api";
import * as Models from './Models';

export const HeaderButtons: FC<{ wishlist: Models.Wishlist }> = ({ wishlist }) => {
  const api = useApi()
  const [openAccessRequests] = useModalController('access-requests')

  if (wishlist.$type === 'draft') {
    return <></>
  }

  if (wishlist.$type === 'private') {
    return <></>
  }

  return <IonButtons slot='end'>
    { wishlist.$type === 'owned' ?
      <>
      {wishlist.accessRequests.length > 0 &&
        wishlist.access === 'private' &&
        <SimpleMenuButton
          icon={mailUnreadSharp}
          onClick={() => openAccessRequests()}
        />
      }
      <SimpleMenuButton
        href={`/wishlists/${wishlist.id}/settings`}
        icon={settingsSharp}
      />
      </>
  : wishlist.stared
    ? <SimpleMenuButton
      icon={heartSharp}
      onClick={api.unstar}
    />
    : <SimpleMenuButton
      icon={heartOutline}
      teaches='star'
      onClick={api.star}
    />
  }
  </IonButtons>
}
