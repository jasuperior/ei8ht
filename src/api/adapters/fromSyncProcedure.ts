import { Scope } from "../../model/domain.model";
import {
    SyncUnitProcedure,
    SyncUnit,
    UnitKind,
    UnitScope,
    Unit,
    UnitType,
} from "../../model/unit.model";
import { polytype } from "../domain/polytype";

export const fromSyncProcedure = <
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
>(
    procedure: SyncUnitProcedure<Parent, Initial, Current>,
    init: Initial,
    branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[]
): SyncUnit<Parent, Initial, Current> => {
    const scope = polytype(init);
    const onComplete = (output: IteratorResult<Current, Current>) => {
        if (output.value !== undefined) {
            scope._define(output.value);
            branches.forEach((branch) => branch?.next?.(scope));
        }
        lastFrame = output;
        return lastFrame;
    };
    const unit = {
        type: UnitType.SYNC,
        kind: UnitKind.PROCEDURAL,
        scope,
        branches,
        next: (input) => {
            scope._extend(input);
            if (lastFrame.done) {
                generator = procedure(
                    scope,
                    branches,
                    unit as SyncUnit<Parent, Initial, Current>
                );
            }
            const output = generator.next(scope);
            onComplete(output);
            return output;
        },
    } as Partial<SyncUnit<Parent, Initial, Current>>;
    let generator = procedure(
        scope,
        branches,
        unit as SyncUnit<Parent, Initial, Current>
    );
    let lastFrame = generator.next(scope);
    onComplete(lastFrame);
    return unit as SyncUnit<Parent, Initial, Current>;
};
