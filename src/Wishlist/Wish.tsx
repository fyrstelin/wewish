import { FC, useState, useEffect, PropsWithChildren } from 'react';
import * as Models from './Models';
import { IonTitle, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, IonInput, IonCheckbox } from '@ionic/react';
import { useTranslation } from '../Localization';
import { ImageUpload } from '../Controls/ImageUpload';
import * as StringInput from '../Controls/StringInput';
import * as Price from './Price';
import * as Amount from './Amount';
import { ImagePreview } from '../Controls/ImagePreview';
import { useUser } from '../User/UserProvider';
import { logoEuro, removeSharp, addSharp, saveSharp, linkSharp, contractSharp, expandSharp, trashSharp } from 'ionicons/icons';
import { usePopupManager } from '../Controls/Popups';
import { Modal } from '../Controls/Modal';

export type WishUpdate = {
  name?: string
  category?: string
  url?: string
  price?: null | 1 | 2 | 3
  amount?: 'unlimited' | number,
  description?: string
}

type Props = {
  wish?: Models.Wish
  onClose: () => void
  onSave: (update: WishUpdate) => Promise<void>
  onDelete: (wish: Models.Wish) => Promise<void>
  onUploadImage: (file: Blob) => Promise<void>
  onMarkAsBought: (wish: Models.Wish, amount: number) => Promise<void>
  onMarkAsUnbought: (wish: Models.Wish) => Promise<void>
  isOwner: boolean
}

type WishState = {
  name: StringInput.Model
  category: StringInput.Model
  url: StringInput.Model
  price: Price.Model
  amount: Amount.Model
  description: StringInput.Model
}

const PriceLabel: FC<{ children: 1 | 2 | 3 }> = ({ children }) => (
  <IonButtons slot='end'>
    <IonIcon icon={logoEuro} color={children > 0 ? 'dark' : 'medium'} />
    <IonIcon icon={logoEuro} color={children > 1 ? 'dark' : 'medium'} />
    <IonIcon icon={logoEuro} color={children > 2 ? 'dark' : 'medium'} />
  </IonButtons>
);

const Item: FC<PropsWithChildren<{ label: string }>> = ({ children, label }) => children
  ? <IonItem>
    <IonLabel position='stacked' color='medium'>{label}</IonLabel>
    {typeof children === 'string'
      ? <IonInput readonly value={children} />
      : children
    }
  </IonItem>
  : <></>

const AmountSelector: FC<{
  max: number
  amount: number
  onChange: (amount: number) => void
}> = ({ max, amount, onChange }) => {

  const desc = () => onChange(amount - 1);
  const inc = () => onChange(amount + 1);

  return (
    <IonButtons slot='end'>
      <IonButton fill='clear' onClick={desc} disabled={amount <= 0} >
        <IonIcon icon={removeSharp} slot='icon-only' />
      </IonButton>
      {amount}
      <IonButton fill='clear' onClick={inc} disabled={amount >= max}>
        <IonIcon icon={addSharp} slot='icon-only' />
      </IonButton>
    </IonButtons>
  );
}

export const Wish: FC<Props> = ({ wish, onClose, isOwner, onUploadImage, onDelete, onSave, onMarkAsBought, onMarkAsUnbought }) => {
  const wishId = wish?.id
  const { user, getUser } = useUser()
  const translation = useTranslation()
  const popupManager = usePopupManager()

  const [state, setState] = useState<WishState>()
  const [task, setTask] = useState<'saving' | 'uploading'>()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => setExpanded(false), [wishId])

  useEffect(() => {
    if (!wish || !isOwner) {
      setState(undefined)
    } else {
      setState(state => state
        ? {
          name: StringInput.Update(state.name, wish.name),
          category: StringInput.Update(state.category, wish.category),
          url: StringInput.Update(state.url, wish.url),
          price: Price.Update(state.price, wish.price || null),
          amount: Amount.Update(state.amount, wish.amount),
          description: StringInput.Update(state.description, wish.description)
        }
        : {
          name: StringInput.Initialize(wish.name),
          category: StringInput.Initialize(wish.category),
          url: StringInput.Initialize(wish.url),
          price: Price.Initialize(wish.price || null),
          amount: Amount.Initialize(wish.amount),
          description: StringInput.Initialize(wish.description)
        })
    }
  }, [isOwner, wish])


  const uid = user?.id

  const isDirty = state && ([state.name, state.category, state.url, state.description].some(StringInput.IsDirty) ||
    Price.IsDirty(state.price) ||
    Amount.IsDirty(state.amount));

  const bought = (uid && (wish && wish.$type === 'public-wish' && wish.buyers[uid])) || 0;

  const boughtByOthers = wish && wish.$type === 'public-wish'
    ? Object
      .keys(wish.buyers)
      .filter(x => x !== uid)
      .reduce((acc, x) => acc + wish.buyers[x], 0)
    : 0;

  const save = async () => {
    if (state) {
      const { name, category, url, price, amount, description } = state
      const update = {
        ...StringInput.Values({ name, category, url, description }),
        price: Price.Value(price),
        amount: Amount.Value(amount)
      };
      setTask('saving')
      await onSave(update);
      setTask(undefined)
      onClose();
    }
  }

  const deleteWish = async () => {
    if (wish && await popupManager.confirm({
      title: translation.wish['delete-wish']['popup-title'],
      message: translation.wish['delete-wish'].content(wish.name),
      yes: translation.wish['delete-wish'].delete
    })) {
      onDelete(wish)
    }
  }

  const set = (patch: Partial<WishState>) => setState(wish => ({
    ...wish!,
    ...patch
  }))

  const setName = (name: StringInput.Model) => set({ name });
  const setCategory = (category: StringInput.Model) => set({ category });
  const setUrl = (url: StringInput.Model) => set({ url });
  const setPrice = (price: Price.Model) => set({ price });
  const setAmount = (amount: Amount.Model) => set({ amount });
  const setDescription = (description: StringInput.Model) => set({ description });

  const boughtChanged = async () => {
    if (wish && wish.$type === 'public-wish') {
      const user = await getUser();
      const amountBought = wish.buyers[user.id];
      if (amountBought) {
        await onMarkAsUnbought(wish);
      } else {
        await onMarkAsBought(wish, 1);
      }
    }
  }

  const markAsBought = async (amount: number) => {
    if (amount === 0) {
      await onMarkAsUnbought(wish!);
    } else {
      await onMarkAsBought(wish!, amount);
    }
  };

  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <Modal
      id='wish'
      color='secondary'
      header={wish && <>
        <IonTitle>
          {!isOwner && wish.amount !== 'unlimited' && wish.amount !== 1 &&
            <>{wish.amount}x </>
          }
          {wish.name}
        </IonTitle>
        <IonButtons slot='end'>
          {isOwner &&
            <>
              <IonButton onClick={deleteWish}>
                <IonIcon icon={trashSharp} slot='icon-only' />
              </IonButton>
              <IonButton onClick={save} disabled={!isDirty || task === 'saving'}>
                <IonIcon icon={saveSharp} slot='icon-only' />
              </IonButton>
            </>
          }
          {(!isOwner && wish.url) &&
            <IonButton href={wish.url}>
              <IonIcon icon={linkSharp} slot='icon-only' />
            </IonButton>
          }
        </IonButtons>
      </>}
    >
        {wish ? (isOwner && state
          ? <>
            <ImageUpload
              image={wish.imageUrl}
              onUpload={onUploadImage}
            />
            <IonList>
              <IonItem>
                <StringInput.StringInput
                  label={translation.wish.name}
                  model={state.name}
                  onChange={setName}
                />
              </IonItem>
              <IonItem>
                <StringInput.StringInput
                  label={translation.wish.category}
                  model={state.category}
                  onChange={setCategory}
                />
              </IonItem>
              <IonItem>
                <StringInput.StringInput
                  label={translation.wish.link}
                  placeholder={translation.wish.linkPlaceholder}
                  model={state.url}
                  onChange={setUrl}
                />
              </IonItem>
              <IonItem>
                <Price.Price
                  model={state.price}
                  onChange={setPrice}
                />
              </IonItem>
              <IonItem>
                <Amount.Amount
                  model={state.amount}
                  onChange={setAmount}
                />
              </IonItem>
              <IonItem>
                <StringInput.StringInput
                  type='multiline'
                  label={translation.wish.description}
                  model={state.description}
                  onChange={setDescription}
                />
              </IonItem>
            </IonList>
          </>
          : <>
            {wish.imageUrl &&
              <ImagePreview
                image={wish.imageUrl}
                height={expanded ? '100%' : 140}
              >
                <IonButton onClick={toggleExpanded} class='wish__expand_image' size='small'>
                  <IonIcon icon={expanded ? contractSharp : expandSharp} slot='icon-only' />
                </IonButton>
              </ImagePreview>
            }
            <IonItem lines='none'>
              {wish.name}
            </IonItem>
            {wish.description && <IonItem lines='none'>
              <i>{wish.description}</i>
            </IonItem>}
            <IonList>
              <Item label={translation.wish.category}>
                {wish.category}
              </Item>
              {wish.price &&
                <IonItem>
                  <IonLabel color='medium'>{translation.wish.price}</IonLabel>
                  <PriceLabel>{wish.price}</PriceLabel>
                </IonItem>
              }
              <IonItem>
                <IonLabel color='medium'>
                  {translation.wish.bought}
                </IonLabel>
                {
                  wish.amount === 'unlimited' || wish.amount === 1
                    ? <IonCheckbox
                      slot='end'
                      checked={bought > 0}
                      onIonChange={boughtChanged}
                    />
                    : <AmountSelector
                      max={wish.amount - boughtByOthers}
                      amount={bought}
                      onChange={markAsBought}
                    />
                }
              </IonItem>
            </IonList>
          </>
        ) : undefined}
    </Modal>
  )
}
