export type Primitive = string | boolean | number;
export type ScopeKey = string | symbol | number;
export type UnitScope<T extends ScopeKey = any, U = any> = Record<T, U>;
export type UnitResult<T extends Record<any, any>, U> =
    | T
    | PromiseLike<T>
    | Generator<T, T, U>
    | AsyncGenerator<T, T, U>
    | Iterator<T, T, U>
    | AsyncIterator<T, T, U>;

export type SyncUnitMethod<T extends UnitScope, U extends UnitScope> = (
    props: U,
    branches: Unit<any, any, T>[],
    self?: UnitIterator<T, U>
) => T | void;
export type AsyncUnitMethod<T extends UnitScope, U extends UnitScope> = (
    props: U,
    branches: Unit<any, any, T>[],
    self?: AsyncUnitIterator<T, U>
) => PromiseLike<T | void>;

export type SyncUnitGenerator<T extends UnitScope, U extends UnitScope> = (
    props: U,
    branches: Unit<any, any, T>[],
    self?: UnitIterator<T, U>
) => Generator<T | void, T | void, U>;

export type AsyncUnitGenerator<T extends UnitScope, U extends UnitScope> = (
    props: U,
    branches: Unit<any, any, T>[],
    self?: AsyncUnitIterator<T, U>
) => AsyncGenerator<T | void, T | void, U>;

export type AsyncUnitCategory<T extends UnitScope, U extends UnitScope> =
    | AsyncUnitGenerator<T, U>
    | AsyncUnitMethod<T, U>;
export type SyncUnitCategory<T extends UnitScope, U extends UnitScope> =
    | SyncUnitGenerator<T, U>
    | SyncUnitMethod<T, U>;
export type UnitMethod<T extends UnitScope, U extends UnitScope> =
    | AsyncUnitCategory<T, U>
    | SyncUnitCategory<T, U>;

export type UnitFrame<T> = {
    value: T;
    done: boolean;
};
export enum UnitType {
    SYNC = "sync",
    ASYNC = "async",
}

/**
 * !NOTE: Iterators should maybe be called Monads
 *
 * !NOTE: Iterators should maybe have a 'return' method, which returns the generator,
 * !and resets the cursor to instantiation
 *
 * */
export type UnitIterator<T extends UnitScope, U extends UnitScope = any> = {
    type: UnitType;
    output: T & U;
    input?: U;
    branches: Unit<any, any, T>[];
    chain: any;
    next(value: U): UnitFrame<T>;
    [Symbol.iterator](): Iterable<T | void>;
};
export type AsyncUnitIterator<
    T extends UnitScope,
    U extends UnitScope = any
> = {
    type: UnitType;
    output: T;
    input?: U;
    branches: Unit<any, any, T>[];
    chain: any;
    future?: PromiseLike<UnitFrame<T>>;
    next(value: U): PromiseLike<UnitFrame<T>>;
    [Symbol.asyncIterator](): AsyncGenerator<T | void, T | void, U>;
};

export type Unit<
    Root extends UnitMethod<T, U> | ScopeKey,
    T extends UnitScope,
    U extends UnitScope = any
> = Root extends SyncUnitCategory<T, U>
    ? UnitIterator<T, U>
    : Root extends AsyncUnitCategory<T, U>
    ? AsyncUnitIterator<T, U>
    : AsyncUnitIterator<T, U> | UnitIterator<T, U>;
