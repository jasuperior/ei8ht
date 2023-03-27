import { Scope } from "../../model/domain.model";

export class Polytype<
    Current extends Scope,
    Prev extends any = any,
    Next extends Scope = any
> {
    chain: [Prev, Current, Next] = new Array(3) as [Prev, Current, Next];
    constructor(identity: Current, before?: Prev, after?: Next) {
        this.chain[0] = (before || null) as Prev;
        this.chain[1] = identity;
        this.chain[2] = (after || null) as Next;
        return new Proxy(this, {
            get(target, prop) {
                let value = Polytype.getValue(target, prop);
                if (value) return value;
                for (let obj of target.chain) {
                    value = Polytype.getValue(obj, prop);
                    if (value) return value;
                }
            },
        });
    }
    _set(obj: Current) {
        //comes before obj in chain
        if (obj) {
            this.chain[1] = obj;
        }
    }
    _extend(obj: Prev) {
        //comes after obj in chain
        if (obj) {
            this.chain[0] = obj;
        }
    }
    _define(obj: Next) {
        //comes  before obj in chain
        if (obj) {
            this.chain[2] = obj;
        }
    }
    *[Symbol.iterator]() {
        for (let obj of this.chain) {
            yield obj;
        }
    }

    static getValue(target: any, prop: any) {
        let value = Reflect.get(target, prop);
        if (typeof value === "function") return value.bind(target);
        return value;
    }
}
export const polytype = <
    Curr extends Record<any, any>,
    Prev extends Record<any, any> = any,
    Next extends Record<any, any> = any
>(
    base: Curr,
    prev?: Prev,
    next?: Next
) => {
    return new Polytype(base, prev, next) as unknown as Polytype<
        Curr,
        Prev,
        Next
    > &
        Curr &
        Prev &
        Next &
        [Prev, Curr, Next];
};
