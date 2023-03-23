import {
    Primitive,
    ScopeKey,
    UnitIterator,
    UnitMethod,
    UnitScope,
} from "../../model/api.model";

export const createFromKey = <T extends ScopeKey, U extends UnitScope<T, any>>(
    value: T,
    input: U,
    branches: UnitIterator<any, UnitScope<any, ReturnType<U[T]>>>[] = []
) => {
    //idk if this really makes sense

    let fn: UnitMethod<ReturnType<U[T]>, U> = () => {};
    return {};
};
