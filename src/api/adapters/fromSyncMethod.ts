import { Scope } from "../../model/domain.model";
import {
    SyncUnitClass,
    UnitScope,
    SyncWorkMethod,
    UnitClass,
    UnitType,
    UnitKind,
    SyncUnit,
    ParentScope,
    Unit,
} from "../../model/unit.model";
import { polytype } from "../domain/polytype";

export const fromSyncMethod = <
    Parent extends Scope,
    Initial extends Scope,
    Current extends Scope
>(
    method: SyncWorkMethod<Parent, Initial, Current>,
    init: Initial,
    branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[]
): SyncUnit<Parent, Initial, Current> => {
    const scope = polytype(init);
    const onComplete = (output: Current) => {
        if (output !== undefined) {
            scope._define(output);
            branches.forEach((branch) => branch?.next?.(scope));
        }
        return {
            value: output,
            done: true,
        };
    };
    const unit = {
        type: UnitType.SYNC,
        kind: UnitKind.METHODIC,
        scope,
        branches,
        work: method,
        next: (input) => {
            scope._extend(input);
            const output = method(
                scope,
                branches,
                unit as SyncUnit<Parent, Initial, Current>
            );
            return onComplete(output);
        },
    } as Partial<SyncUnit<Parent, Initial, Current>>;
    const output = method(
        scope,
        branches,
        unit as SyncUnit<Parent, Initial, Current>
    );
    onComplete(output);

    return unit as SyncUnit<Parent, Initial, Current>;
};
