import { Primitive, Scope } from "../../model/domain.model";
import {
    UnitScope,
    Unit,
    UnitType,
    UnitKind,
    UnitScheme,
} from "../../model/unit.model";
import { polytype } from "../domain/polytype";
import { createUnit } from "../index";

export const fromKey = <
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
>(
    key: Primitive,
    init: Initial,
    branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[]
): Unit<UnitScope<Parent, Initial, Current>, Initial, Current> => {
    let method = (() => {
        //noop
    }) as unknown as UnitScheme<Parent, Initial, Current>;
    let privateUnit = createUnit(method as any, init, ...branches);
    const scope = polytype(init);
    const getMethod = () =>
        unit.scope![key as keyof typeof unit.scope] || method;
    const getUnit = (currentMethod: Function, newMethod: Function) => {
        if (Object.is(currentMethod, newMethod)) {
            return privateUnit;
        }
        privateUnit = createUnit(newMethod as any, init, ...branches);
        //define the output of the previous unit as the input of the new unit
        scope._define(privateUnit.scope.chain[2]);
        privateUnit.scope = scope;
        return privateUnit;
    };
    const setValue = () => {
        if (privateUnit.type === UnitType.ASYNC) {
            return privateUnit.next(scope).then((frame) => {
                onComplete(frame.value);
                return frame;
            });
        }
        let frame = privateUnit.next(scope);
        onComplete(frame.value);
        return frame;
    };
    const onComplete = (value: any) => {
        if (value !== undefined) {
            scope._define(value);
            branches.forEach((branch) => branch?.next?.(scope));
        }
    };
    const unit = {
        ...privateUnit,
        scope,
        next: (input) => {
            scope._extend(input);
            getUnit(method, getMethod());
            return setValue();
        },
    } as Partial<Unit>;

    return unit as Unit;
};
