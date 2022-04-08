import cx from 'classnames';
import { PureComponent } from 'react';
import './style.css';


type Props = {
  children: string
  variant: 'fab' | 'bottom' | 'menu-button' | 'list-action'
}

export class Help extends PureComponent<Props> {
  render() {
    const { children, variant } = this.props;
    if (children) {
      return null; // TODO figure out have to make tutorials
    }
    return (
      <div className={cx('help', variant)}>
        <label>{children}</label>
      </div>
    )
  }
}
