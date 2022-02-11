import React from 'react';
import cx from 'classnames';
import './style.css';


type Props = {
    children: string
    variant: 'fab' | 'bottom' | 'menu-button' | 'list-action'
}

export class Help extends React.PureComponent<Props> {
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