import { Unit } from "./unit.model";

export type Primitive = string | boolean | number;
export type Key = string | symbol | number;
export type MapLike<T, U> = {
    get(key: T): U | void;
    set(key: T, value: U): void;
} & (T extends string ? Record<T, U> : {});
export type AsyncFunction<T extends any[] = any[], U = any> = (
    ...args: T
) => PromiseLike<U>;
export type SyncFunction<T extends any[] = any[], U = any> = (...args: T) => U;
export type GeneratorFunction<T extends any[] = any[], U = any> = (
    ...args: T
) => Generator<U>;
export type AsyncGeneratorFunction<T extends any[] = any[], U = any> = (
    ...args: T
) => AsyncGenerator<U>;

export type StringRecord = Record<string, any>;
export type Scope<T extends Key = string, U = any> =
    | Record<T, U>
    | MapLike<T, U>;

export type KeyedScope<T extends Scope> = T & { tag?: string };
export type ScopeFrom<T extends Record<string, any> | Scope> = T extends Record<
    infer K,
    infer V
>
    ? Scope<K, V>
    : T;
export namespace Scope {
    export type Of<U extends Unit> = U extends Unit<infer T, infer V, infer W>
        ? T & V & W
        : never;
    export type From<T extends Record<string, any> | Scope> = ScopeFrom<T>;
}
