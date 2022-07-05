import { PureComponent } from 'react';
import { Help } from './Help';
import { Skill, Teaches } from '../Skills';
import { WithTranslation } from '../Localization';
import { IonFab, IonIcon, IonFabButton } from '@ionic/react';
import './fab.css';

type Props = {
  onClick: () => Promise<void>
  children?: string
  teaches?: Skill
};

type State = {
  open: boolean
};

export const Fab =
  WithTranslation(
    class Fab extends PureComponent<Props & WithTranslation, State> {
      state: State = {
        open: false
      }

      render() {
        const { children, onClick, teaches } = this.props;
        const { tutorial } = this.props.translation;

        return (
          <>
            <IonFab onClick={onClick} vertical='bottom' horizontal='end' slot='fixed'>
              <IonFabButton>
                <IonIcon icon={children}/>
              </IonFabButton>
              {teaches
                ? <Teaches skill={teaches}>
                  <Help variant='fab'>{tutorial[teaches]}</Help>
                </Teaches>
                : null
              }
            </IonFab>
            <div className='fab-spacer' />
          </>
        );
      }
    }
  );
