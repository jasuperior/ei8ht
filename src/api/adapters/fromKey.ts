import { Primitive, Scope } from "../../model/domain.model";
import {
    UnitScope,
    UnitClass,
    UnitType,
    UnitKind,
    Work,
    Unit,
    AsyncUnit,
    PolyScope,
} from "../../model/unit.model";
import { polytype } from "../domain/polytype";
import { createUnit } from "../index";

const reassignUnit = (unit: Unit, newUnit: Unit): void => {
    unit.kind = newUnit.kind;
    if (unit.type === UnitType.ASYNC)
        unit.future = (newUnit as AsyncUnit).future;
};
export const fromKey = <
    Parent extends Scope,
    Initial extends Scope,
    Current extends Scope
>(
    key: Primitive,
    init: Initial,
    branches: UnitClass<PolyScope<Parent, Initial, Current>, any, any>[]
): Unit<Parent, Initial, Current> => {
    let parentUnit: Unit<Parent, Initial, Current>;
    let unit: UnitClass;
    let scheme = () => {};
    const getScheme = (props: any) => {
        if (typeof props[key as keyof typeof props] === "function") {
            return props[key as keyof typeof props];
        }
        return scheme;
    };
    let procedure = function* (props: Initial, branches: any[], unit: any) {
        (<any>props).tag = key;
        unit = createUnit(scheme as any, props, ...branches);
        let [, init, output] = unit.scope;
        while (true) {
            const result = (yield output) as UnitScope<
                Parent,
                Initial,
                Current
            >;
            let currentScheme = getScheme(result);
            if (!Object.is(currentScheme, scheme)) {
                scheme = currentScheme;
                unit = createUnit(scheme as any, props, ...branches);
                reassignUnit(parentUnit as Unit, unit);
            } else {
                unit?.next(result);
            }
            output = unit.scope.chain[2];
        }
    } as unknown as Work<Parent, Initial, Current>;
    return (parentUnit = createUnit(procedure as any, init, ...branches));
};

export const fromKeyAsync = <
    Parent extends Scope,
    Initial extends Scope,
    Current extends Scope
>(
    key: Primitive,
    init: Initial,
    branches: UnitClass<PolyScope<Parent, Initial, Current>, any, any>[]
): Unit<Parent, Initial, Current> => {
    let parentUnit: Unit<Parent, Initial, Current>;
    let unit: Unit;
    let scheme = () => {};
    const getScheme = (props: any) => {
        if (typeof props[key as keyof typeof props] === "function") {
            return props[key as keyof typeof props];
        }
        return scheme;
    };
    let procedure = async function* (
        props: Initial,
        branches: any[],
        unit: any
    ) {
        unit = createUnit(scheme as any, props, ...branches);
        await unit.future;
        let [, init, output] = unit.scope;
        while (true) {
            const result = (yield output) as UnitScope<
                Parent,
                Initial,
                Current
            >;
            let currentScheme = getScheme(result);
            if (!Object.is(currentScheme, scheme)) {
                scheme = currentScheme;
                unit = createUnit(scheme as any, props, ...branches);
                reassignUnit(parentUnit as Unit, unit);
                await unit.future;
            } else {
                await unit?.next(result);
            }
            output = unit.scope.chain[2];
        }
    } as unknown as Work<Parent, Initial, Current>;
    return (parentUnit = createUnit(procedure as any, init, ...branches));
};
