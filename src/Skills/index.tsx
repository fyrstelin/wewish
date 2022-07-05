import { useUser } from '../User/UserProvider';
import { map } from 'rxjs/operators';
import { createContext, FC, PropsWithChildren, PureComponent, useEffect, useState } from 'react';
import { useListen } from '../Firebase/Database';

export type Skill
  = 'add-wish-list'
  | 'add-wish'
  | 'share-wish-list'
  | 'mark-as-bought'
  | 'star';

const SkillsContext = createContext([] as ReadonlyArray<Skill>);
const RequiresContext = createContext(undefined as Skill | undefined)

export const Skills: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser()
  const listen = useListen()
  const [skills, setSkills] = useState<ReadonlyArray<Skill>>([])


  useEffect(() => {
    if (!user) {
      setSkills([])
    } else {
      const s = listen<Dictionary>(`users/${user.id}/skills`)
        .pipe(
          map(skills => Object.keys(skills || {}) as ReadonlyArray<Skill>)
        )
        .subscribe(setSkills)

      return () => s.unsubscribe()
    }
  }, [user, listen])


  return (
    <SkillsContext.Provider value={skills}>
      {children}
    </SkillsContext.Provider>
  )
}

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
