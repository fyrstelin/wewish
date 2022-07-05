import { useTranslation } from '../../Localization';
import { Teaches } from '../../Skills';
import { Help } from '../../Controls/Help';
import { IonInput, IonList, IonItem, IonLabel, IonLoading } from '@ionic/react';
import { FC, KeyboardEvent, PureComponent, useRef, useState } from 'react';
import { useApi } from '../Api';
import './index.css';

export type WishData = {
  name: string
  category: string | null
  amount: number | 'unlimited'
  type: 'input'
} | {
  url: string
  category: string | null
  type: 'url'
};

type Props = {
  exisingCategories: ReadonlyArray<string>
};


type SuggestionProps = { children: string, onClick: (suggestion: string) => void };
class Suggestion extends PureComponent<SuggestionProps> {
  private click = () => {
    this.props.onClick(this.props.children);
  };

  render() {
    return (
      <IonItem onMouseDown={this.click}>
        <IonLabel>{this.props.children}</IonLabel>
      </IonItem>
    )
  }
}

const isUrl = (url: string) => url.startsWith('https://') || url.startsWith('http://')

export const AddWish: FC<Props> = ({
  exisingCategories
}) => {
  const { wishlist, tutorial } = useTranslation()
  const api = useApi()
  
  const [wish, setWish] = useState('')
  const [category, setCategory] = useState('')
  const [addingWish, setAddingWish] = useState(null as null | 'by-url')

  const wishInp = useRef<HTMLIonInputElement | null>(null)

  const suggestions = exisingCategories
    .filter(x => x.toLocaleLowerCase().includes(category.toLocaleLowerCase()) && x.toLocaleLowerCase() !== category.toLocaleLowerCase())
    .sort();

  const completeCategory = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      wishInp.current?.setFocus();
    }
  }
  
  const useSuggestion = (suggestion: string) => {
    setCategory(suggestion)
    setTimeout(() => wishInp.current?.setFocus());
  }

  const completeWish = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {

      if (isUrl(wish)) {
        setAddingWish('by-url')
        await api.addWishFromUrl(wish, category)
          .finally(() => setAddingWish(null))

        setWish('')
      } else {
        const match = wish.match(/^(\d*x|!)?\s*(.*)?$/i);
        if (match) {
          const [, count, name] = match;
          const amount = count === undefined
            ? 1
            : count === '!'
              ? 'unlimited'
              : parseInt(count.substr(0, count.length - 1), 10)
          await api.addWish(name.trim(), category ? category.trim() : null, amount)
          setWish('')
        }
      }
    }
  }

  return (
    <form className='add-wish'>
      <IonLoading
        isOpen={!!addingWish}
        onDidDismiss={() => { }}
        message={addingWish
          ? wishlist['add-wish'][addingWish]
          : ''}
      />
      <IonInput
        placeholder={wishlist.category}
        value={category}
        onIonChange={e => setCategory(e.detail.value ?? '')}
        onKeyUp={completeCategory}
        class='category'
      />
      {suggestions.length > 0 && <IonList class='suggestions' lines='none'>
        {suggestions.map(suggestion =>
          <Suggestion
            key={suggestion}
            onClick={useSuggestion}
          >{suggestion}</Suggestion>
        )}
      </IonList>}
      <IonInput
        placeholder={wishlist['make-a-wish']}
        value={wish}
        onIonChange={e => setWish(e.detail.value ?? '')}
        onKeyUp={completeWish}
        ref={wishInp}
        className='wish'
      />
      <Teaches skill='add-wish'>
        <Help variant='bottom'>{tutorial['add-wish']}</Help>
      </Teaches>
    </form>
  );
}
