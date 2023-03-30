import { Unit } from "../../model/unit.model";

type Example = Exclude<keyof Unit["scope"], number>;
type UnitAccessor<T extends Unit> = {
    [P in keyof T["scope"]]: T["scope"][P];
} & {
    [P in Exclude<keyof T["branches"], string | symbol>]: UnitAccessor<
        T["branches"][P]
    >;
};
const unitMap = new Map<Unit, any>();
const handler = {
    get: (target: Unit, prop: string) => {
        if (target.scope[prop as keyof typeof target.scope] !== undefined) {
            return Reflect.get(target.scope, prop);
        }
        const branch = Reflect.get(target.branches, prop);
        if (branch) {
            return from(branch);
        }
    },
};

const makeProxy = (unit: Unit): UnitAccessor<typeof unit> => {
    const proxy = new Proxy(unit, handler);
    unitMap.set(unit, proxy);
    return proxy as unknown as UnitAccessor<typeof unit>;
};
export const from = <T extends Unit>(unit: T): UnitAccessor<T> => {
    const proxy = unitMap.get(unit) || makeProxy(unit);
    return proxy!;
};
