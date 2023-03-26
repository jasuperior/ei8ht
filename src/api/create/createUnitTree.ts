import {
    AsyncUnitCategory,
    AsyncUnitGenerator,
    AsyncUnitIterator,
    AsyncUnitMethod,
    ScopeKey,
    SyncUnitCategory,
    SyncUnitGenerator,
    SyncUnitMethod,
    Unit,
    UnitIterator,
    UnitMethod,
    UnitScope,
} from "../../model/api.model";
import { isAsyncGenerator, isGenerator, isPromise } from "../../utils/helpers";
import { createFromAsyncGenerator } from "./createFromAsyncGenerator";
import { createFromAsyncMethod } from "./createFromAsyncMethod";
import { createFromKey } from "./createFromKey";
import { createFromSyncGenerator } from "./createFromSyncGenerator";
import { createFromSyncMethod } from "./createFromSyncMethod";

export function createUnitTree<T extends UnitScope, U extends UnitScope>(
    root: AsyncUnitCategory<T, U>,
    input: U,
    ...branches: Unit<any, any, T>[]
): AsyncUnitIterator<T, U>;
export function createUnitTree<T extends UnitScope, U extends UnitScope>(
    root: SyncUnitCategory<T, U>,
    input: U,
    ...branches: Unit<any, any, T>[]
): UnitIterator<T, U>;
export function createUnitTree<T extends UnitScope, U extends UnitScope>(
    root: ScopeKey,
    input: U,
    ...branches: Unit<any, any, T>[]
): Unit<any, T, U>;
export function createUnitTree<T extends UnitScope, U extends UnitScope>(
    this: Unit<typeof root, T, U>,
    root: any,
    input: U = {} as U,
    ...branches: Unit<any, any, T>[]
): Unit<typeof root, T, U> {
    if (typeof root !== "function")
        //@ts-ignore
        return createFromKey(root, input || {}, ...branches);
    let iterator;
    let value = root(input, branches, this);
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
            break;
        }
    }
    return iterator as any;
}
