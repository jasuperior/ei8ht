import {
    SyncUnitGenerator,
    SyncUnitMethod,
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

export const createFromSyncGenerator = <
    T extends UnitScope,
    U extends UnitScope
>(
    generator: Generator<T | void, T | void, U>,
    fn: SyncUnitGenerator<T, U>,
    input: U,
    branches: Unit<any, any, T>[] = []
): UnitIterator<T, U> => {
    let frame = generator.next();
    let chain = prototype(frame.value || {});
    let output = frame.value || ({} as T);
    chain.push({});
    chain.push(input);
    branches.forEach((branch) => {
        branch.chain.push(chain);
    });

    return {
        get type() {
            return UnitType.SYNC;
        },
        output,
        input,
        chain,
        branches,
        next(input: U) {
            this.input = input;
            chain[replaceObj](1, input);
            if (frame.done) {
                generator = fn(chain as U, branches, this);
            }
            frame = generator.next(chain);
            if (frame.value !== undefined) {
                this.output = frame.value;
                if (!chain[chainContains](frame.value)) {
                    //if the frame is a new object,
                    //it replaces the frame in the chain.
                    chain[replaceObj](0, frame.value);
                }
                branches.forEach((branch) => branch.next(chain as T));
            }
            return frame as UnitFrame<T>;
        },
        *[Symbol.iterator]() {
            let gen = fn(input, branches, this);
            let value = gen.next();
            while (!value.done) {
                yield value.value;
                value = gen.next();
            }
        },
    };
};
