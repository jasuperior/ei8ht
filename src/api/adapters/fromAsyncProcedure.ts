import { Scope } from "../../model/domain.model";
import {
    AsyncUnitProcedure,
    AsyncUnit,
    UnitScope,
    Unit,
    UnitKind,
    UnitType,
    UnitFrame,
} from "../../model/unit.model";
import { polytype } from "../domain/polytype";

export const fromAsyncProcedure = <
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
>(
    procedure: AsyncUnitProcedure<Parent, Initial, Current>,
    init: Initial,
    branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[]
): AsyncUnit<Parent, Initial, Current> => {
    const scope = polytype(init);
    const onComplete = (output: IteratorResult<Current, Current>) => {
        duration--;
        if (output.value !== undefined) {
            scope._define(output.value);
            branches.forEach((branch) => branch.next(scope));
        }
        if (duration === 0) unit.future = undefined;
        lastFrame = output as UnitFrame<Current>;
        return lastFrame;
    };
    let duration = 0;
    const unit = {
        type: UnitType.ASYNC,
        kind: UnitKind.PROCEDURAL,
        scope,
        branches,
        next: (input) => {
            scope._extend(input);
            if (lastFrame.done) {
                generator = procedure(
                    scope,
                    branches,
                    unit as AsyncUnit<Parent, Initial, Current>
                );
            }
            if (unit.future) {
                unit.future = unit.future
                    .then(() => generator.next(scope))
                    .then(onComplete);
            } else {
                unit.future = generator.next(scope).then(onComplete);
            }
            return unit.future;
        },
    } as Partial<AsyncUnit<Parent, Initial, Current>>;
    let generator = procedure(
        scope,
        branches,
        unit as AsyncUnit<Parent, Initial, Current>
    );
    let lastFrame = {
        value: undefined,
        done: false,
    } as unknown as UnitFrame<Current>;
    unit.future = generator.next(scope).then(onComplete);
    return unit as AsyncUnit<Parent, Initial, Current>;
};
