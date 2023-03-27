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
    const onComplete = (output: Current) => {
        if (output !== undefined) {
            scope._define(output);
            branches.forEach((branch) => branch.next(scope));
        }
        return {
            value: output,
            done: true,
        };
    };
    const unit = {
        type: UnitType.SYNC,
        kind: UnitKind.PURE,
        scope,
        branches,
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
