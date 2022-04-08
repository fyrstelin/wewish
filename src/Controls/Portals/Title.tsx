import { PureComponent } from 'react';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

type Props = {
  children: string
}
const title = document.head.querySelector('title')!;

const stream = new Subject<string>();

stream.pipe(
  distinctUntilChanged()
).subscribe(x => title.innerText = x);

export class Title extends PureComponent<Props> {
  render() {
    const { children } = this.props;
    stream.next(children);
    return null;
  }
}
