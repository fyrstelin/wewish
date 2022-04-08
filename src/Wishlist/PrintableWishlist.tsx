import { PureComponent } from 'react';
import * as ReactDOM from 'react-dom';
import * as Models from './Models';

type Props = {
  title: string
  owners: ReadonlyArray<string>
  wishes: ReadonlyArray<Models.Wish>
  description: string | undefined
};

const printable = document.createElement('div');
printable.classList.add('printable');
document.body.append(printable);

export class PrintableWishlist extends PureComponent<Props> {
  render() {
    const { title, wishes, owners, description } = this.props;

    const grouped = wishes.reduce((group, wish) => {
      const category = (wish.category || '').trim().toLocaleUpperCase();
      return {
        ...group,
        [category]: [...(group[category] || []), wish]
      };
    }, {} as { [category: string]: Models.Wish[] });

    const categories = Object.keys(grouped).sort();

    const now = new Date().toLocaleDateString();

    return ReactDOM.createPortal(
      <>
        <header>
          {now}
        </header>
        <main>
          <h1>{title}</h1>
          <h2>{owners.join(' & ')}</h2>
          {description && <p>{description}</p>}
          {categories.map(category =>
            <article key={category}>
              <h3>{category}</h3>
              <ul>
                {grouped[category]
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(wish =>
                    <li key={wish.id}>
                      {wish.name}<br />
                      <i>{wish.description}</i>
                    </li>
                  )}
              </ul>
            </article>
          )}
        </main>
        <footer>
          Brought to you by <b>WeWish</b>
        </footer>
      </>
      , printable)
  }
}
