import { UnitScope } from "../../model/api.model";

export const chainLength = Symbol.for("chainLength");
export const chainContains = Symbol.for("chainContains");
export const replaceObj = Symbol.for("Replace");
export const getRange = Symbol.for("GetRange");
const arrayMethods = new Set(["push", "pop", "shift", "unshift"]);
const isNumber = (prop: any) => !Number.isNaN(parseFloat(prop.toString()));
export const prototype = <T extends UnitScope>(
    obj: T,
    chain: any[] = [obj],
    index: number = chain.length - 1
): any => {
    let indexOf = (value: any) => {
        return chain.indexOf(value);
    };
    let replace = (i: number, value: any) => {
        return (chain[i] = value);
    };
    let methods = {
        [chainContains]: indexOf,
        [replaceObj]: replace,
        get [chainLength]() {
            return chain.length;
        },
    };
    let findInRange = (target: number, prop: string | symbol) => {
        for (let i = target; i < chain.length; i++) {
            let obj = chain[i];
            if (Reflect.has(obj, prop)) return Reflect.get(obj, prop);
        }
    };
    return new Proxy(obj, {
        get(_, prop) {
            let method = Reflect.get(methods, prop);
            if (arrayMethods.has(prop as string))
                return Reflect.get(chain, prop).bind(chain);
            if (method) return method;
            if (isNumber(prop))
                return prototype(obj, chain, parseInt(prop as string));
            return findInRange(index, prop);
        },
        has(target, prop) {
            for (let obj of chain) {
                if (Reflect.has(obj, prop)) return true;
            }
            return false;
        },
    }) as any;
};

// const a = { a: 1 };
// const b = { g: 99 };
// const p = prototype(a);
// p.push(b);
// p.push({ name: "lkjlkj" });
// const pp = p[2];
// p.a; //?
