import { mapAndKeep } from './mapAndKeep'
import { switchMapAndKeep } from './switchMapAndKeep'
import { Observable } from 'rxjs';

export const leftJoin = <TLeft, TRight>(fn: (l: TLeft) => Observable<TRight>) => (left: Observable<TLeft[]>) =>
    left.pipe(mapAndKeep(fn), switchMapAndKeep());