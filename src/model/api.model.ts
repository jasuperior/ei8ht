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
    branches: UnitIterator<any, T>[],
    self?: UnitIterator<T, U>
) => T | void;
export type AsyncUnitMethod<T extends UnitScope, U extends UnitScope> = (
    props: U,
    branches: UnitIterator<any, T>[],
    self?: AsyncUnitIterator<T, U>
) => PromiseLike<T | void>;

export type SyncUnitGenerator<T extends UnitScope, U extends UnitScope> = (
    props: U,
    branches: UnitIterator<any, T>[],
    self?: UnitIterator<T, U>
) => Generator<T | void, T | void, U>;

export type AsyncUnitGenerator<T extends UnitScope, U extends UnitScope> = (
    props: U,
    branches: UnitIterator<any, T>[],
    self?: AsyncUnitIterator<T, U>
) => AsyncGenerator<T | void, T | void, U>;

export type UnitMethod<T extends UnitScope, U extends UnitScope> =
    | AsyncUnitMethod<T, U>
    | SyncUnitMethod<T, U>
    | SyncUnitGenerator<T, U>
    | AsyncUnitGenerator<T, U>;

export type UnitFrame<T> = {
    value: T;
    done: boolean;
};
export enum UnitType {
    SYNC,
    ASYNC,
}
export type UnitIterator<T extends UnitScope, U extends UnitScope = any> = {
    type: UnitType;
    output: T & U;
    input?: U;
    branches: UnitIterator<any, T>[];
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
    branches: UnitIterator<any, T>[];
    chain: any;
    future?: PromiseLike<UnitFrame<T>>;
    next(value: U): PromiseLike<UnitFrame<T>>;
    [Symbol.asyncIterator](): AsyncGenerator<T | void, T | void, U>;
};

export type Unit<T extends UnitScope, U extends UnitScope = any> = {
    value: T;
    root: UnitIterator<T, U>;
    branches: Unit<any, T>[];
    next(value: U): UnitFrame<T> | PromiseLike<UnitFrame<T>>;
    init(): void;
};
