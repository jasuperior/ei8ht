import {
    AsyncUnitGenerator,
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

export const createFromAsyncGenerator = <
    T extends UnitScope,
    U extends UnitScope
>(
    generator: AsyncGenerator<T | void, T | void, U>,
    fn: AsyncUnitGenerator<T, U>,
    input: U,
    branches: Unit<any, any, T>[] = []
): AsyncUnitIterator<T, U> => {
    let framePromise = generator.next();
    let currentFrame = { done: false };
    let iterator: AsyncUnitIterator<T, U>;
    let chain = prototype({});
    chain.push({});
    chain.push(input);
    let setNextValue = (
        currentFuture: PromiseLike<UnitFrame<T>>,
        frame: UnitFrame<T>
    ): UnitFrame<T> => {
        if (Object.is(iterator.future, currentFuture)) {
            //erase future only if the current future is queued
            iterator.future = undefined;
        }
        if (frame.value !== undefined) {
            iterator.output = frame.value;
            if (!chain[chainContains](frame.value)) {
                chain[replaceObj](0, frame.value);
            }
            branches.forEach((branch) => branch.next(chain));
        }
        return frame;
    };
    let future: PromiseLike<UnitFrame<T>> = framePromise.then((frame) => {
        chain[replaceObj](0, frame.value);
        branches.forEach((branch) => {
            branch.chain.push(chain);
        });
        return setNextValue(future, frame as UnitFrame<T>);
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
            if (currentFrame.done) {
                generator = fn(chain as U, branches, this);
            }
            if (this.future) {
                //continue the promise chain.
                future = this.future.then((frame) => {
                    currentFrame = frame;
                    return (this.future = generator
                        .next(chain)
                        .then((frame) =>
                            setNextValue(future, frame as UnitFrame<T>)
                        ));
                });
            } else {
                future = this.future = generator
                    .next(chain)
                    .then((frame) =>
                        setNextValue(future, frame as UnitFrame<T>)
                    );
            }
            return future;
        },
        async *[Symbol.asyncIterator]() {
            yield* fn(input, branches, this);
        },
    });
};
