import React from 'react';
import { IonItem } from '@ionic/react';
import { withRouter, RouteComponentProps } from 'react-router'; 

type Props = {
    href?: string
    class?: string
    onClick?: (e: React.MouseEvent) => void
    button?: true
    detail?: boolean
}

export const Item = withRouter(
    class Item extends React.PureComponent<Props & RouteComponentProps> {

        private onClick = (e: React.MouseEvent) => {
            const { href, onClick, history } = this.props;
            if (href) {
                e.preventDefault();
                history.push(href);
            }

            if (onClick) {
                onClick(e);
            }
        }

        render() {
            return (
                <IonItem {...this.props} onClick={this.onClick}/>
            )
        }
    }
);