import {
    AsyncUnitIterator,
    Primitive,
    ScopeKey,
    UnitIterator,
    UnitMethod,
    UnitScope,
    UnitType,
} from "../../model/api.model";
import { isPromise } from "../../utils/helpers";
import { createUnitTree } from "./createUnitTree";

export const createFromKey = <T extends ScopeKey, U extends UnitScope<T, any>>(
    value: T,
    input: U,
    branches: UnitIterator<any, ReturnType<U[T]>>[] = []
) => {
    input = input || {};
    //idk if this really makes sense
    let fn: UnitMethod<ReturnType<U[T]>, U> = input[value] ||
    (() =>
        ({
            /** noop */
        } as ReturnType<U[T]>));
    let iterator = createUnitTree(fn, input, ...branches);
    return {
        ...iterator,
        next(newInput: U) {
            this.input = newInput;
            iterator.chain = this.chain;
            let newFn = newInput[value];
            let frame;
            if (!!newFn && !Object.is(newFn, fn)) {
                fn = newFn;
                iterator = createUnitTree(fn, newInput, ...branches);
                iterator.chain = this.chain;
                // frame = {
                //     value: iterator.output,
                //     done: false,
                // };
            }

            frame = iterator.next(newInput);
            if (iterator.type == UnitType.ASYNC) {
                //@ts-ignore
                this.future = iterator.future.then((frame) => {
                    this.output = frame.value;
                    return frame;
                });
            }
            this.output = iterator.output;
            return frame;
        },
    } as ReturnType<U[T]> extends Promise<any>
        ? AsyncUnitIterator<ReturnType<U[T]>, U>
        : UnitIterator<ReturnType<U[T]>, U>;
};
