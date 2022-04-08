import { Observable, Subscription } from 'rxjs';

type State<T> = {
    observable: Observable<T>
    subscription: Subscription,
    hasValue: boolean
    value?: T
}

export const switchMapAndKeep = <T>() => (stream: Observable<Array<Observable<T>>>): Observable<T[]> =>
    new Observable<T[]>(subscriber => {
        let state: Array<State<T>> = [];

        const next = () => {
            if (state.length === 0 || state.every(x => x.hasValue)) {
                subscriber.next(state.map(x => x.value!))
            }
        }

        const subscription = stream.subscribe(observables => {
            const oldState = state;
            state = observables.map(observable => {
                const existing = oldState.find(x => x.observable === observable);
                if (existing) {
                    return existing;
                }
                const entry: State<T> = {
                    observable,
                    hasValue: false,
                    subscription: null as any 
                };
                entry.subscription = observable.subscribe(
                    x => {
                        entry.value = x;
                        entry.hasValue = true;
                        next();
                    },
                    err => subscriber.error(err),
                    () => subscriber.complete()
                );
                return entry;
            });

            next();
            
            oldState.filter(x => observables.indexOf(x.observable) === -1)
                .forEach(x => x.subscription.unsubscribe());
        });

        return () => {
            subscription.unsubscribe();
            state.forEach(({ subscription }) => subscription.unsubscribe());
        };
    });