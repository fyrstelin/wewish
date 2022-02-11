import React from 'react';
import { Skill, Teaches } from '../Skills';
import { WithTranslation } from '../Localization';
import { Help } from '../Controls/Help';
import { IonButton, IonIcon } from '@ionic/react';
import { withRouter, RouteComponentProps } from 'react-router';

type Props = {
    icon: { ios: string, md: string }
    onClick?: () => void
    disabled?: boolean
    href?: string
    teaches?: Skill
};

export const SimpleMenuButton = 
    withRouter(
    WithTranslation(
    class SimpleMenuButton extends React.PureComponent<Props & WithTranslation & RouteComponentProps> {

        private onClick = (e: React.MouseEvent) => {
            const { onClick, href, history } = this.props;
            if (onClick) {
                onClick();
            }
            if (href) {
                e.preventDefault();
                history.push(href);
            }
        }

        render() {
            const { icon, disabled, href, teaches } = this.props;
            const { tutorial } = this.props.translation;
            return (
                <IonButton 
                    onClick={this.onClick} 
                    disabled={disabled} 
                    href={href}>
                    <IonIcon icon={icon}/>
                    {teaches && <Teaches skill={teaches}>
                        <Help variant='menu-button'>{tutorial[teaches]}</Help>
                    </Teaches>}
                </IonButton>
            );
        }
    }
));