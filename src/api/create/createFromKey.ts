import {
    AsyncUnitIterator,
    Primitive,
    ScopeKey,
    Unit,
    UnitFrame,
    UnitIterator,
    UnitMethod,
    UnitScope,
    UnitType,
} from "../../model/api.model";
import { isPromise } from "../../utils/helpers";
import { replaceObj } from "../helpers/DynamicPrototype";
import { createUnitTree } from "./createUnitTree";

export const createFromKey = <T extends ScopeKey, U extends UnitScope<T, any>>(
    value: T,
    input: U,
    branches: Unit<any, any, ReturnType<U[T]>>[] = []
) => {
    input = input || {};
    //idk if this really makes sense
    let fn: UnitMethod<ReturnType<U[T]>, U> = input[value] ||
    (() =>
        ({
            /** noop */
        } as ReturnType<U[T]>));
    // console.log("branches", branches.length);
    let iterator: Unit<any, any, any> = createUnitTree(
        fn as any,
        input,
        ...branches
    );
    iterator.chain[replaceObj](3, input);
    // console.log(fn.toString());
    return {
        ...iterator,
        next(newInput: U) {
            this.input = newInput;
            this.chain[replaceObj](1, newInput);
            let newFn = newInput[value];
            let frame;
            if (!!newFn && !Object.is(newFn, fn)) {
                fn = newFn;
                iterator = createUnitTree.call(
                    this,
                    fn as any,
                    this.chain,
                    ...branches
                );
                // console.log("chain", iterator.output);
                frame = {
                    value: iterator.output,
                    done: false,
                };
                // console.log("output", iterator.output);
            } else {
                // console.log("next", iterator.type, iterator.chain);
                frame = iterator.next(newInput);
            }
            // console.log("frame", frame);

            if (iterator.type === UnitType.ASYNC) {
                //@ts-ignore
                this.future = iterator.future.then((frame) => {
                    this.output = frame.value;
                    this.chain[replaceObj](0, (frame as UnitFrame<any>).value);
                    return frame;
                });
            } else {
                this.chain[replaceObj](0, (frame as UnitFrame<any>).value);
                this.output = iterator.output;
                // console.log("output", iterator.output);
            }
            // console.log("this", this);
            return frame;
        },
    } as Unit<any, any, any>;
};
