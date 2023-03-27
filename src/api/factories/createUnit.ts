import {
    UnitScope,
    UnitMethod,
    Unit,
    AsyncUnit,
    SyncUnitMethod,
} from "../../model/unit.model";
import { Scope } from "../../model/domain.model";
import {
    isAsync,
    isAsyncGenerator,
    isGenerator,
    isSync,
} from "../helpers/identity";
import {
    fromAsyncProcedure,
    fromSyncProcedure,
    fromAsyncMethod,
    fromSyncMethod,
} from "../adapters/index";

export const createUnit = <
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
>(
    method: UnitMethod<Parent, Initial, Current>,
    init: Initial,
    ...branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[]
): Unit<UnitScope<Parent, Initial, Current>, Initial, Current> => {
    if (isAsyncGenerator(method)) {
        return fromAsyncProcedure(method, init, branches);
    } else if (isGenerator(method)) {
        return fromSyncProcedure(method, init, branches);
    } else if (isAsync(method)) {
        return fromAsyncMethod(method, init, branches);
    }

    return fromSyncMethod(
        method as SyncUnitMethod<Parent, Initial, Current>,
        init,
        branches
    ) as Unit<UnitScope<Parent, Initial, Current>, Initial, Current>;
};
