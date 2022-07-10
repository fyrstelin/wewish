import { urlAlphabet, customAlphabet } from "nanoid";

export const Id: <TId extends Id<any> = Id<any>>(length?: number) => TId = customAlphabet(urlAlphabet, 8) as any

export const Patch = (patcher: { [path: string]: any}) => Object.keys(patcher)
    .reduce((patch, path) => {
        const value = patcher[path];
        return value === undefined
            ? patch
            : { ...patch, [path]: value };
    }, {});

export const Keys = <T>(t: T) => t === null ? [] : Object.keys(t).map(x => x as keyof T);

export const ToDictionary = <T, U>(ts: ReadonlyArray<T>, keySelector: (t: T) => string | number, valueSelector: (t: T) => U) =>
    ts.reduce((us, t) => ({
        ...us,
        [keySelector(t)]: valueSelector(t)
    }), {} as Dictionary<U>);
