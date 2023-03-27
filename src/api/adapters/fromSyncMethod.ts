import { Scope } from "../../model/domain.model";
import {
    SyncUnit,
    UnitScope,
    SyncUnitMethod,
    Unit,
    UnitType,
    UnitKind,
} from "../../model/unit.model";
import { polytype } from "../domain/polytype";

export const fromSyncMethod = <
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
>(
    method: SyncUnitMethod<Parent, Initial, Current>,
    init: Initial,
    branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[]
): SyncUnit<Parent, Initial, Current> => {
    const scope = polytype(init);
    const unit = {
        type: UnitType.SYNC,
        kind: UnitKind.PURE,
        scope,
        next: (input) => {
            scope._extend(input);
            const output = method(
                scope,
                branches,
                unit as SyncUnit<Parent, Initial, Current>
            );
            if (output !== undefined) {
                scope._define(output);
                branches.forEach((branch) => branch.next(scope));
            }
            return {
                value: output,
                done: true,
            };
        },
    } as Partial<SyncUnit<Parent, Initial, Current>>;
    scope._define(
        method(scope, branches, unit as SyncUnit<Parent, Initial, Current>)
    );
    return unit as SyncUnit<Parent, Initial, Current>;
};
