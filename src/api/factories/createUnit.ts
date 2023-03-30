import {
    UnitScope,
    UnitMethod,
    UnitClass,
    SyncUnitMethod,
    Unit,
} from "../../model/unit.model";
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
    method: UnitMethod<Parent, Initial, Current> | Primitive,
    init: Initial,
    ...branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]
): Unit<Parent, Initial, Current> => {
    if (typeof method !== "function") {
        if ((init as any)?.await) {
            return fromKeyAsync(method, init, branches);
        }
        return fromKey(method, init, branches);
    } else if (isAsyncGenerator(method)) {
        return fromAsyncProcedure(method, init, branches);
    } else if (isGenerator(method)) {
        return fromSyncProcedure(method, init, branches);
    } else if (isAsync(method)) {
        return fromAsyncMethod(method, init, branches);
    } else {
        return fromSyncMethod(
            method as SyncUnitMethod<Parent, Initial, Current>,
            init,
            branches
        ) as Unit<Parent, Initial, Current>;
    }
};
