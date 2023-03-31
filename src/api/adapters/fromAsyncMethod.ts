import {
    UnitScope,
    AsyncWorkMethod,
    UnitClass,
    AsyncUnitClass,
    UnitKind,
    UnitType,
    UnitState,
    PolyScope,
} from "../../model/unit.model";
import { Scope } from "../../model/domain.model";
import { polytype } from "../domain/polytype";
import { toCompleteFrame } from "../helpers/transformers";

export const fromAsyncMethod = <
    Parent extends Scope,
    Initial extends Scope,
    Current extends Scope
>(
    method: AsyncWorkMethod<Parent, Initial, Current>,
    init: Initial,
    branches: UnitClass<PolyScope<Parent, Initial, Current>, any, any>[]
): AsyncUnitClass<Parent, Initial, Current> => {
    const scope = polytype(init);
    const onComplete = (output: Current) => {
        duration--;
        if (output !== undefined) {
            scope._define(output);
            branches.forEach((branch) => branch?.next?.(scope));
        }
        if (duration === 0) unit.future = undefined;
        return toCompleteFrame(output);
    };
    let duration = 0;
    const unit = {
        type: UnitType.ASYNC,
        kind: UnitKind.PURE,
        scope,
        branches,
        work: method,
        get state() {
            return duration === 0 ? UnitState.RESOLVED : UnitState.PENDING;
        },
        next: (input) => {
            duration++;
            scope._extend(input);
            if (unit.future) {
                unit.future = unit.future
                    .then(() =>
                        method(
                            scope,
                            branches,
                            unit as AsyncUnitClass<Parent, Initial, Current>
                        )
                    )
                    .then(onComplete);
            } else {
                unit.future = method(
                    scope,
                    branches,
                    unit as AsyncUnitClass<Parent, Initial, Current>
                ).then(onComplete);
            }
            return unit.future;
        },
    } as Partial<AsyncUnitClass<Parent, Initial, Current>>;
    duration++;
    unit.future = method(
        scope,
        branches,
        unit as AsyncUnitClass<Parent, Initial, Current>
    ).then(onComplete);
    return unit as AsyncUnitClass<Parent, Initial, Current>;
};
