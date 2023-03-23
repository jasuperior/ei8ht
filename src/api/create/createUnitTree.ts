import {
    AsyncUnitGenerator,
    AsyncUnitMethod,
    Primitive,
    SyncUnitGenerator,
    SyncUnitMethod,
    UnitIterator,
    UnitMethod,
    UnitScope,
} from "../../model/api.model";
import { isAsyncGenerator, isGenerator, isPromise } from "../../utils/helpers";
import { createFromAsyncGenerator } from "./createFromAsyncGenerator";
import { createFromAsyncMethod } from "./createFromAsyncMethod";
import { createFromSyncGenerator } from "./createFromSyncGenerator";
import { createFromSyncMethod } from "./createFromSyncMethod";

export const createUnitTree = <T extends UnitScope, U extends UnitScope>(
    root: UnitMethod<T, U>,
    input: U = {} as U,
    ...branches: UnitIterator<any, T>[]
): UnitIterator<T, U> => {
    let iterator;
    let value = root(input, branches);
    switch (true) {
        case isAsyncGenerator(value as AsyncGenerator<T>): {
            iterator = createFromAsyncGenerator(
                value as AsyncGenerator<T, T, U>,
                root as AsyncUnitGenerator<T, U>,
                input,
                branches
            );
            break;
        }
        case isGenerator(value as Iterator<T>): {
            iterator = createFromSyncGenerator(
                value as Generator<T, T, U>,
                root as SyncUnitGenerator<T, U>,
                input,
                branches
            );
            break;
        }
        case isPromise(value as PromiseLike<T>): {
            iterator = createFromAsyncMethod(
                value as PromiseLike<T>,
                root as AsyncUnitMethod<T, U>,
                input,
                branches
            );
            break;
        }
        default: {
            iterator = createFromSyncMethod(
                value as T,
                root as SyncUnitMethod<T, U>,
                input,
                branches
            );
        }
    }
    return iterator as UnitIterator<T, U>;
};
