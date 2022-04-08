import { Observable } from 'rxjs';
import { scan, map } from 'rxjs/operators'

type Tuple<T1, T2> = {
    item1: T1
    item2: T2
}

export const mapAndKeep = <TIn, TOut>(fn: ((x: TIn) => TOut)) => (stream: Observable<TIn[]>): Observable<TOut[]> =>
    stream.pipe(
        scan<TIn[], ReadonlyArray<Tuple<TIn, TOut>>>((openStreams, xs) => openStreams
            .filter(({ item1 }) => xs.indexOf(item1) !== -1)
            .concat(xs
                .filter(x => openStreams
                    .map(({ item1 }) => item1)
                    .indexOf(x) === -1)
                .map(x => ({ item1: x, item2: fn(x)}))
            ), []),
        map(x => x.map(y => y.item2))
    );