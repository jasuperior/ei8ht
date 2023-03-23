import {
    AsyncUnitIterator,
    AsyncUnitMethod,
    Unit,
    UnitFrame,
    UnitIterator,
    UnitScope,
    UnitType,
} from "../../model/api.model";
import {
    chainContains,
    prototype,
    replaceObj,
} from "../helpers/DynamicPrototype";

export const createFromAsyncMethod = <T extends UnitScope, U extends UnitScope>(
    promise: PromiseLike<T>,
    fn: AsyncUnitMethod<T, U>,
    input: U,
    branches: UnitIterator<any, T>[] = []
): AsyncUnitIterator<T, U> => {
    let iterator: AsyncUnitIterator<T, U>;
    let chain = prototype({});
    chain.push({});
    chain.push(input);
    let setNextValue = (
        currentFuture: PromiseLike<UnitFrame<T>>,
        frame: T
    ): UnitFrame<T> => {
        iterator.output = frame;
        if (Object.is(iterator.future, currentFuture)) {
            //erase future only if the current future is queued
            iterator.future = undefined;
        }
        if (frame !== undefined) {
            if (!chain[chainContains](frame)) {
                chain[replaceObj](0, frame);
            }
            branches.forEach((branch) => branch.next(frame));
        }
        return {
            value: frame,
            done: true,
        };
    };
    let future: PromiseLike<UnitFrame<T>> = promise.then((value) => {
        chain[replaceObj](0, value);
        branches.forEach((branch) => {
            branch.chain.push(chain);
        });
        return setNextValue(future, value);
    });
    let output = Object.create(input);
    return (iterator = {
        get type() {
            return UnitType.ASYNC;
        },
        output,
        input,
        future,
        branches,
        chain,
        next(input: U) {
            this.input = input;
            chain[replaceObj](1, input);
            let future: PromiseLike<UnitFrame<T>>;
            if (this.future) {
                //continue the promise chain.
                future = this.future.then(
                    () =>
                        (this.future = fn(chain, branches, this).then((value) =>
                            setNextValue(future, value)
                        ))
                );
            } else {
                future = this.future = fn(chain, branches, this).then((value) =>
                    setNextValue(future, value)
                );
            }
            return future;
        },
        async *[Symbol.asyncIterator]() {
            yield fn(input, branches, this);
        },
    });
};
