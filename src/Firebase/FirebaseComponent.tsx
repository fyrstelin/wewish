import { Observable, BehaviorSubject, Subscription, asyncScheduler } from 'rxjs';
import { map, distinctUntilChanged, observeOn } from 'rxjs/operators'
import { ref, getDatabase, onValue } from 'firebase/database';
import { cache } from './Database'
import { PureComponent, ReactNode } from 'react';

type Props<TState> = {
  children: (state: TState) => ReactNode
}

export abstract class FirebaseComponent<TProps, TState = {}> extends PureComponent<TProps, TState> {
  protected readonly stream: BehaviorSubject<TProps>;
  private readonly subscription = new Subscription();

  constructor(props: TProps) {
    super(props);
    this.stream = new BehaviorSubject(props);

    this.subscription.add(this
      .setup()
      .pipe(observeOn(asyncScheduler))
      .subscribe(state => {
        this.setState(state)
      }));
  }

  protected using(subscription: Subscription) {
    this.subscription.add(subscription);
  }

  abstract setup(): Observable<TState | null>;

  UNSAFE_componentWillReceiveProps(nextProps: TProps & Props<TState>) {
    this.stream.next(nextProps);
  }

  componentWillUnmount() {
    this.stream.complete();
    this.subscription.unsubscribe();
  }

  protected on<T>(selector: ((props: TProps) => T)): Observable<T> {
    return this.stream.pipe(
      map(selector),
      distinctUntilChanged());
  }

  protected listen<T>(path: string): Observable<T> {
    return new Observable<T>(stream => {
      const entityRef = ref(getDatabase(), path)

      const cached = cache.get<T>(path);
      if (cached !== null) {
        stream.next(cached)
      }

      return onValue(entityRef, snapshot => {
        if (!snapshot) return;

        const val = snapshot.val() as T;
        cache.update(path, val);
        stream.next(val);
      }, (e: Error) => stream.error(e))
    }).pipe(distinctUntilChanged())
  }
}
