import React from 'react';
import { Observable, BehaviorSubject, Subscription, asyncScheduler } from 'rxjs';
import { map, distinctUntilChanged, observeOn } from 'rxjs/operators'
import Firebase from 'firebase/app';
import 'firebase/database';
import { cache } from './Database'

type Props<TState> = {
  children: (state: TState) => React.ReactNode
}

export abstract class FirebaseComponent<TProps, TState = {}> extends React.PureComponent<TProps, TState> {
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
      const ref = Firebase.database().ref(path);

        const cached = cache.get<T>(path);
        if (cached !== null) {
          stream.next(cached)
        }

      const next = (snapshot: Firebase.database.DataSnapshot | null) => {
        if (!snapshot) return;

        const val = snapshot.val() as T;
        cache.update(path, val);
        stream.next(val);
      }

      ref.on('value', next, (e: Error) => stream.error(e));
      return () => {
        ref.off('value', next);
      };
    }).pipe(distinctUntilChanged())
  }
}