import { WithTranslation } from '../../Localization';
import { Teaches } from '../../Skills';
import { Help } from '../../Controls/Help';
import { IonInput, IonList, IonItem, IonLabel, IonLoading } from '@ionic/react';
import { InputChangeEventDetail } from '@ionic/core';
import './index.css';
import { KeyboardEvent, PureComponent } from 'react';


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
  onAddWish: (wish: WishData) => Promise<void>
  exisingCategories: ReadonlyArray<string>
};

type State = {
  wish: string
  category: string
  addingWish: null | 'by-url'
}

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

const isUrl = (x: string) => x.startsWith('https://') || x.startsWith('http://')

export const AddWish =
  WithTranslation(
    class AddWish extends PureComponent<
      Props &
      WithTranslation,
      State> {

      state: State = {
        category: '',
        wish: '',
        addingWish: null
      };

      private wishInp: HTMLIonInputElement | null = null;

      private changeCategory = (e: CustomEvent<InputChangeEventDetail>) =>
        this.setState({ category: e.detail.value || '' })

      private completeCategory = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && this.wishInp) {
          this.wishInp.setFocus();
        }
      }

      private changeWish = (e: CustomEvent<InputChangeEventDetail>) =>
        this.setState({ wish: e.detail.value || '' })

      private completeWish = async (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          const { onAddWish } = this.props;
          const { wish, category } = this.state;

          if (isUrl(wish)) {
            this.setState({
              addingWish: 'by-url'
            });
            await onAddWish({
              url: wish,
              category,
              type: 'url'
            })
              .finally(() => {
                this.setState({
                  addingWish: null
                });
              });
            this.setState({
              wish: ''
            })
          } else {
            const match = wish.match(/^(\d*x|!)?\s*(.*)?$/i);
            if (match) {
              const [, count, name] = match;

              await onAddWish({
                name: name.trim(),
                category: category ? category.trim() : null,
                amount: count === undefined
                  ? 1
                  : count === '!'
                    ? 'unlimited'
                    : parseInt(count.substr(0, count.length - 1), 10),
                type: 'input'
              });
              this.setState({
                wish: '',
              });
            }
          }
        }
      }

      private useSuggestion = (suggestion: string) => {
        this.setState({ category: suggestion });
        setTimeout(() => {
          if (this.wishInp) {
            this.wishInp.setFocus();
          }
        });
      }

      private refInput = (wishInp: HTMLIonInputElement | null) => this.wishInp = wishInp;

      render() {
        const { exisingCategories } = this.props;
        const { category, wish, addingWish } = this.state;
        const { wishlist, tutorial } = this.props.translation;
        const suggestions = exisingCategories
          .filter(x => x.toLocaleLowerCase().includes(category.toLocaleLowerCase()) && x.toLocaleLowerCase() !== category.toLocaleLowerCase())
          .sort();

        return (
          <div className='add-wish'>
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
              onIonChange={this.changeCategory}
              onKeyUp={this.completeCategory}
              class='category'
            />
            {suggestions.length > 0 && <IonList class='suggestions' lines='none'>
              {suggestions.map(suggestion =>
                <Suggestion key={suggestion} onClick={this.useSuggestion}>{suggestion}</Suggestion>
              )}
            </IonList>}
            <IonInput
              placeholder={wishlist['make-a-wish']}
              value={wish}
              onIonChange={this.changeWish}
              onKeyUp={this.completeWish}
              ref={this.refInput}
              class='wish'
            />
            <Teaches skill='add-wish'>
              <Help variant='bottom'>{tutorial['add-wish']}</Help>
            </Teaches>
          </div>
        );
      }
    }
  );
