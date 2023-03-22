export type Primitive = string | boolean | number;
export type UnitResult<T extends Record<any, any>, U> =
    | T
    | PromiseLike<T>
    | Generator<T, T, U>
    | AsyncGenerator<T, T, U>
    | Iterator<T, T, U>
    | AsyncIterator<T, T, U>;

export type UnitMethod<
    T extends Record<any, any>,
    U extends any = any,
    R extends UnitResult<T, U> = UnitResult<T, U>
> = (props: U, branches: Unit<any, T>[], self?: UnitIterator<T, U>) => R;

export type UnitFrame<T> = {
    value: T;
    done: boolean;
};
export enum UnitType {
    PROMISE,
    ITERATOR,
    PURE,
}
export type UnitIterator<T, U extends any = any> = {
    type: UnitType;
    value: T;
    future?: PromiseLike<UnitFrame<T>>;
    parent?: Unit<any, any>;
    next(value: U): UnitFrame<T> | PromiseLike<UnitFrame<T>>;
    [Symbol.iterator]: Iterable<T>;
    [Symbol.asyncIterator]: PromiseLike<Iterable<T>>;
};
export type Unit<T, U = any> = {
    root: UnitIterator<T, U>;
    branches: Unit<any, T>[];
    next(value: U): UnitFrame<T> | PromiseLike<UnitFrame<T>>;
    init(): void;
};
