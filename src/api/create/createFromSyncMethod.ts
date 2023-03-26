import {
    SyncUnitMethod,
    Unit,
    UnitIterator,
    UnitScope,
    UnitType,
} from "../../model/api.model";
import {
    chainContains,
    prototype,
    replaceObj,
} from "../helpers/DynamicPrototype";

export const createFromSyncMethod = <T extends UnitScope, U extends UnitScope>(
    value: T,
    fn: SyncUnitMethod<T, U>,
    input: U,
    branches: Unit<any, any, T>[] = []
): UnitIterator<T, U> => {
    let chain = prototype(value);
    let output = value;
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
            let frame = fn(chain as U, branches, this);
            if (frame !== undefined) {
                this.output = frame;
                if (!chain[chainContains](frame)) {
                    //if the frame is a new object,
                    //it replaces the frame in the chain.
                    chain[replaceObj](0, frame);
                }
                branches.forEach((branch) => branch.next(chain as T));
                //! should be passing chain if I want the value to propograte
            }
            return {
                value: frame as T,
                done: true,
            };
        },
        *[Symbol.iterator]() {
            yield fn(input, branches, this);
        },
    };
};
