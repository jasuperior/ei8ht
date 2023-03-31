import { Unit, Work } from "../../model/unit.model";
import {
    fromAsyncProcedure,
    fromSyncProcedure,
    fromAsyncMethod,
    fromSyncMethod,
    fromKey,
    fromKeyAsync,
} from "../adapters/index";
import { Primitive, Scope } from "../../model/domain.model";
import { isAsync, isAsyncGenerator, isGenerator } from "../helpers/identity";

export const createUnit = <
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
>(
    method: Work<Parent, Initial, Current> | Primitive,
    init: Initial,
    ...branches: Unit.Branches<Parent, Initial, Current>
): Unit<Parent, Initial, Current> => {
    if (typeof method !== "function") {
        if ((init as any)?.await) {
            return fromKeyAsync(method, init, branches);
        }
        return fromKey(method, init, branches);
    } else if (isAsyncGenerator(method)) {
        return fromAsyncProcedure(
            method as Work.Pursuit<Parent, Initial, Current>,
            init,
            branches
        );
    } else if (isGenerator(method)) {
        return fromSyncProcedure(
            method as Work.Process<Parent, Initial, Current>,
            init,
            branches
        );
    } else if (isAsync(method)) {
        return fromAsyncMethod(
            method as Work.Goal<Parent, Initial, Current>,
            init,
            branches
        );
    } else {
        return fromSyncMethod(
            method as Work.Step<Parent, Initial, Current>,
            init,
            branches
        ) as Unit<Parent, Initial, Current>;
    }
};
