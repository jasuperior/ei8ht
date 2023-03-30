import { Primitive, Scope } from "../../model/domain.model";
import {
    UnitScope,
    UnitClass,
    UnitType,
    UnitKind,
    UnitScheme,
    Unit,
} from "../../model/unit.model";
import { polytype } from "../domain/polytype";
import { createUnit } from "../index";

export const fromKey = <
    Parent extends Scope,
    Initial extends Scope,
    Current extends Scope
>(
    key: Primitive,
    init: Initial,
    branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]
): Unit<Parent, Initial, Current> => {
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
            } else {
                // console.log("unit", init);
                unit?.next(result);
            }
            output = unit.scope.chain[2];
        }
    } as unknown as UnitScheme<Parent, Initial, Current>;
    return createUnit(procedure as any, init, ...branches);
};

export const fromKeyAsync = <
    Parent extends Scope,
    Initial extends Scope,
    Current extends Scope
>(
    key: Primitive,
    init: Initial,
    branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]
): Unit<Parent, Initial, Current> => {
    let unit: UnitClass;
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
                await unit.future;
            } else {
                await unit?.next(result);
            }
            output = unit.scope.chain[2];
        }
    } as unknown as UnitScheme<Parent, Initial, Current>;
    return createUnit(procedure as any, init, ...branches);
};
