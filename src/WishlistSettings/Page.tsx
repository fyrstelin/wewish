import { useState, useEffect, useCallback } from 'react';
import { Page as StdPage } from '../Page';
import * as Models from './Models';
import { SimpleMenuButton } from '../Utils/SimpleMenuButton';
import { usePopupManager } from '../Controls/Popups';
import * as StringInput from '../Controls/StringInput';
import * as ColorInput from '../Controls/ColorInput';
import { useTranslation } from '../Localization';
import { ThemeColor } from '../Controls/ThemeColor';
import { IonList, IonItemDivider, IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { SelectChangeEventDetail } from '@ionic/core';
import * as Api from '../Api';
import { useUser } from '../User/UserProvider';
import { close, add, trash } from 'ionicons/icons';

export type WishlistUpdate = {
  title?: string
  themeColor?: string
  secondaryThemeColor?: string
  access?: Api.Access
}

type Props = {
  id: string,
  wishlist: Models.Wishlist
  onSave: (update: WishlistUpdate) => Promise<void>
  onAddCoOwner: () => Promise<void>
  onDelete: () => Promise<void>
  onReset: () => Promise<void>
  onRemoveMember: (id: string) => Promise<void>
};

const useStringInput = (value: string | undefined) => {
  const [state, setState] = useState(StringInput.Initialize(value))

  const flush = useCallback(() => setState(StringInput.Flush(state)), [state])

  useEffect(() => setState(StringInput.Update(state, value)), [value, state])

  return [
    state,
    setState,
    flush
  ] as [StringInput.Model, (model: StringInput.Model) => void, () => void]
}

export const Page = ({ id, wishlist, onDelete, onSave, onReset, onRemoveMember, onAddCoOwner }: Props) => {
  const popupManager = usePopupManager()
  const { wishlistSettings, userSettings } = useTranslation()
  const { user } = useUser()

  const [title, setTitle, flushTitle] = useStringInput(wishlist.title)
  const [themeColor, setThemeColor, flushThemeColor] = useStringInput(wishlist.themeColor)
  const [secondaryThemeColor, setSecondaryThemeColor, flushSecondaryThemeColor] = useStringInput(wishlist.secondaryThemeColor)

  const deleteWishlist = useCallback(async () => {
    const confirmed = await popupManager.confirm({
      title: wishlistSettings['delete-wishlist']['popup-title'],
      message: wishlistSettings['delete-wishlist'].content(wishlist.title),
      yes: wishlistSettings['delete-wishlist'].delete
    });
    if (confirmed) {
      await onDelete();
    }
  }, [wishlist.title, onDelete, popupManager, wishlistSettings])

  const save = useCallback(async () => {
    await onSave({
      title: StringInput.Value(title),
      themeColor: ColorInput.Value(themeColor),
      secondaryThemeColor: ColorInput.Value(secondaryThemeColor),
    });
    flushTitle()
    flushThemeColor()
    flushSecondaryThemeColor()
  }, [title, themeColor, secondaryThemeColor, flushTitle, flushThemeColor, flushSecondaryThemeColor, onSave])

  const reset = useCallback(async () => {
    const confimed = await popupManager.confirm({
      title: wishlistSettings['reset-wishlist']['popup-title'],
      message: wishlistSettings['reset-wishlist'].content(wishlist.title)
    });
    if (confimed) {
      await onReset();
    }
  }, [wishlist.title, onReset, popupManager, wishlistSettings])

  const removeGuest = useCallback(async ({ name, id }: { name: string, id: string }) => {
    const confirmed = await popupManager.confirm({
      title: wishlistSettings["remove-guest"],
      message: wishlistSettings["remove-guest-message"](name)
    });

    if (confirmed) {
      await onRemoveMember(id);
    }
  }, [popupManager, onRemoveMember, wishlistSettings])

  const removeOwner = useCallback(async ({ name, id }: { name: string, id: string }) => {
    const confirmed = await popupManager.confirm({
      title: wishlistSettings["remove-owner"],
      message: wishlistSettings["remove-owner-message"](name)
    });

    if (confirmed) {
      await onRemoveMember(id);
    }
  }, [popupManager, wishlistSettings, onRemoveMember])

  const updateAccess = useCallback((e: CustomEvent<SelectChangeEventDetail>) => onSave({
    access: e.detail.value
  }), [onSave])

  const addCoOwner = useCallback(async () => {
    const confirmed = await popupManager.confirm({
      title: wishlistSettings["add-co-owner"],
      message: wishlistSettings['add-co-owner-message'],
    });
    if (confirmed) {
      await onAddCoOwner();
    }
  }, [popupManager, onAddCoOwner, wishlistSettings])

  return <ThemeColor
    primary={themeColor.value || themeColor.backingValue}
    secondary={secondaryThemeColor.value || secondaryThemeColor.backingValue}
  >
    <StdPage
      title={wishlistSettings['page-title']}
      parent={`/wishlists/${id}`}
      buttons={
        <SimpleMenuButton
          icon={trash}
          onClick={deleteWishlist}
        />
      }
    >
      <IonList class='wishlist-settings' lines='none'>
        <IonItem>
          <StringInput.StringInput
            model={title}
            onChange={setTitle}
            label={wishlistSettings.title}
            onBlur={save}
          />
        </IonItem>
        <IonItem>
          <IonLabel>{wishlistSettings.access}</IonLabel>
          <IonSelect
            value={wishlist.access}
            onIonChange={updateAccess}
          >
            <IonSelectOption value='draft'>
              {wishlistSettings.draft}
            </IonSelectOption>
            <IonSelectOption value='private'>
              {wishlistSettings.private}
            </IonSelectOption>
            <IonSelectOption value='public'>
              {wishlistSettings.public}
            </IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>{wishlistSettings['theme-color']}</IonLabel>
          <div className='colors' slot='end'>
            <ColorInput.ColorInput
              id='choose-primary-color'
              title={wishlistSettings['choose-primary-color']}
              model={themeColor}
              fallbackColor='primary'
              onChange={setThemeColor}
              onSave={save}
            />
            <ColorInput.ColorInput
              id='choose-secondary-color'
              title={wishlistSettings['choose-secondary-color']}
              model={secondaryThemeColor}
              fallbackColor='secondary'
              onChange={setSecondaryThemeColor}
              onSave={save}
            />
          </div>
        </IonItem>
        <IonItemDivider color='light'>
          {wishlistSettings.owners}
          <IonButton
            slot='end'
            fill='clear'
            color='dark'
            onClick={addCoOwner}
          >
            <IonIcon icon={add} />
          </IonButton>
        </IonItemDivider>
        {wishlist.members
          .filter(x => x.membership === 'owner')
          .sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()))
          .map(({ id, name }) =>
            <IonItem key={id}>
              <IonLabel>{name}</IonLabel>
              {id !== (user && user.id) &&
                <IonButton
                  slot='end'
                  fill='clear'
                  color='dark'
                  onClick={() => removeOwner({ id, name })}
                >
                  <IonIcon
                    icon={close}
                    slot='icon-only'
                  />
                </IonButton>
              }
            </IonItem>
          )}
        {wishlist.access === 'private' &&
          wishlist.members.some(x => x.membership === 'guest') && <>
            <IonItemDivider color='light'>
              {wishlistSettings['shared-with']}
            </IonItemDivider>
            {wishlist.members
              .filter(x => x.membership === 'guest')
              .map(({ id, name }) =>
                <IonItem key={id}>
                  <IonLabel>
                    {name}
                  </IonLabel>
                  <IonButton
                    slot='end'
                    fill='clear'
                    color='dark'
                    onClick={() => removeGuest({ id, name })}
                  >
                    <IonIcon
                      icon={close}
                      slot='icon-only'
                    />
                  </IonButton>
                </IonItem>
              )}
          </>
        }
        <IonItemDivider color='light'>
          {userSettings['danger-zone']}
        </IonItemDivider>
        <IonItem button onClick={reset}>
          {wishlistSettings.reset}
        </IonItem>
      </IonList>
    </StdPage>
  </ThemeColor>
}
