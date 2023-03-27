export type Primitive = string | boolean | number;
export type Key = string | symbol | number;
export type MapLike<T, U> = {
    get(key: T): U;
    set(key: T, value: U): void;
};
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

export type Scope<T extends Key = any, U = any> = Record<T, U> | MapLike<T, U>;
