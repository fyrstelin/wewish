import React from 'react';
import * as StringInput from '../Controls/StringInput';
import { WithTranslation } from '../Localization';

type Props = {
    children: string | undefined
    onNewDescription: (description: string) => void
}

type State = {
    description: StringInput.Model
}

export const Description = 
    WithTranslation(
    class Description extends React.PureComponent<Props & WithTranslation, State> {
        constructor(props: Props & WithTranslation) {
            super(props);
            
            this.state = {
                description: StringInput.Initialize(props.children)
            };
        }

        UNSAFE_componentWillReceiveProps(nextProps: Props) {
            this.setState(() => ({
                description: StringInput.Update(this.state.description, nextProps.children)
            }));
        }

        private changeDescription = (description: StringInput.Model) =>
            this.setState({ description });

        private updateDescription = () => {
            const value = StringInput.Value(this.state.description);
            if (value === undefined) {
                return;
            }
            this.props.onNewDescription(value);
            this.setState(({ description }) => ({
                description: StringInput.Flush(description)
            }));
        }

        render() {
            const { description } = this.state;
            const { wishlist } = this.props.translation;

            return (
                <StringInput.StringInput
                    placeholder={wishlist.description}
                    type='multiline'
                    model={description}
                    onChange={this.changeDescription}
                    onBlur={this.updateDescription}
                />
            );
        }
    }
);