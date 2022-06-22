import { WithUser } from '../User/UserProvider';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FirebaseComponent } from '../Firebase/FirebaseComponent';
import { createContext, PropsWithChildren, PureComponent, ReactNode } from 'react';

export type Skill
  = 'add-wish-list'
  | 'add-wish'
  | 'share-wish-list'
  | 'mark-as-bought'
  | 'star';

const SkillsContext = createContext([] as ReadonlyArray<Skill>);
const RequiresContext = createContext(undefined as Skill | undefined)

type State = {
  skills: ReadonlyArray<Skill>
}


export const Skills =
  WithUser()(
    class Skills extends FirebaseComponent<{ children: ReactNode } & WithUser, State> {
      state: State = {
        skills: []
      }

      setup() {
        return this
          .on(x => x.user ? x.user.id : null)
          .pipe(switchMap(uid => !uid
            ? of({ skills: [] as ReadonlyArray<Skill> })
            : this.listen<Dictionary>(`users/${uid}/skills`)
              .pipe(
                map(skills => Object.keys(skills || {}) as ReadonlyArray<Skill>),
                map(skills => ({ skills })))));
      }

      render() {
        return <SkillsContext.Provider value={this.state.skills}>
          {this.props.children}
        </SkillsContext.Provider>
      }
    });

type RequiresProps = {
  skills: ReadonlyArray<Skill>
}

export class Requires extends PureComponent<PropsWithChildren<RequiresProps>> {
  render() {
    const { skills, children } = this.props;
    return (
      <SkillsContext.Consumer>{existingSkills =>
        <RequiresContext.Provider value={skills.find(skill => existingSkills.indexOf(skill) === -1)}>
          {children}
        </RequiresContext.Provider>
      }</SkillsContext.Consumer>
    )
  }
}

export class Teaches extends PureComponent<PropsWithChildren<{ skill: Skill }>> {
  render() {
    return <RequiresContext.Consumer>{requiredSkill =>
      requiredSkill === this.props.skill
        ? this.props.children
        : null
    }</RequiresContext.Consumer>
  }
}

export const Provider = SkillsContext.Provider;
