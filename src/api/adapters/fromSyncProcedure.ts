import { Scope } from "../../model/domain.model";
import {
    SyncWorkProcedure,
    SyncUnitClass,
    UnitKind,
    UnitScope,
    UnitClass,
    UnitType,
    ParentScope,
    SyncUnit,
    Unit,
} from "../../model/unit.model";
import { polytype } from "../domain/polytype";

export const fromSyncProcedure = <
    Parent extends Scope,
    Initial extends Scope,
    Current extends Scope
>(
    procedure: SyncWorkProcedure<Parent, Initial, Current>,
    init: Initial,
    branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[]
): SyncUnit<Parent, Initial, Current> => {
    const scope = polytype(init);
    const onComplete = (
        output: IteratorResult<void | Current, void | Current>
    ) => {
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
        work: procedure,
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
    } as Partial<SyncUnitClass<Parent, Initial, Current>>;
    let generator = procedure(
        scope,
        branches,
        unit as SyncUnit<Parent, Initial, Current>
    );
    let lastFrame = generator.next(scope);
    onComplete(lastFrame);
    return unit as SyncUnit<Parent, Initial, Current>;
};
