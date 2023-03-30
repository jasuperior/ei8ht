declare const NOOP: unique symbol;
declare const noop: symbol;
declare const hasInstance: unique symbol;

type Primitive = string | boolean | number;
type Key = string | symbol | number;
type MapLike<T, U> = {
    get(key: T): U | void;
    set(key: T, value: U): void;
};
type AsyncFunction<T extends any[] = any[], U = any> = (...args: T) => PromiseLike<U>;
type SyncFunction<T extends any[] = any[], U = any> = (...args: T) => U;
type Scope<T extends Key = any, U = any> = Record<T, U> | MapLike<T, U>;

declare class Polytype<Current extends Scope, Prev extends any = any, Next extends Scope = any> {
    chain: [Prev, Current, Next];
    constructor(identity: Current, before?: Prev, after?: Next);
    _set(obj: Current): void;
    _extend(obj: Prev): void;
    _define(obj: Next): void;
    [Symbol.iterator](): Generator<Current | Prev | Next, void, unknown>;
    static getValue(target: any, prop: any, idx?: number): any;
    static isPolytype(obj: any): boolean;
}
declare const polytype: <Curr extends Record<any, any>, Prev extends Record<any, any> = any, Next extends Record<any, any> = any>(base: Curr, prev?: Prev | undefined, next?: Next | undefined) => Polytype<Curr, Prev, Next> & Curr & Prev & Next & [Prev, Curr, Next];

/**
 * @description
 * the type of a unit. This is used to determine if the unit is sync or async.
 */
declare enum UnitType {
    SYNC = "sync",
    ASYNC = "async"
}
/**
 * @description
 * the state of an async unit. This is used to determine if the unit is
 * pending, resolved, or rejected.
 */
declare enum UnitState {
    PENDING = "pending",
    RESOLVED = "resolved",
    REJECTED = "rejected"
}
/**
 * @description
 * the kind of a unit. This is used to determine if the unit is procedural or
 * pure function.
 */
declare enum UnitKind {
    PURE = "pure",
    PROCEDURAL = "procedural"
}
/**
 * @description
 * the output of a unit after its next method is called.
 * @template T the type of the unit's scope.
 */
type UnitFrame<T> = {
    value: T;
    done: boolean;
};
type UnitScope<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = Polytype<Initial, Parent, Current> & Parent & Current & Initial;
type AsyncUnitMethod<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = (input: UnitScope<Parent, Initial, Current>, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[], self: AsyncUnitClass<Parent, Initial, Current>) => PromiseLike<Current>;
type SyncUnitMethod<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = (input: UnitScope<Parent, Initial, Current>, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[], self: SyncUnitClass<Parent, Initial, Current>) => Current;
/**
 * @description
 * A unit method is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method.
 */
type UnitMethod<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = AsyncUnitMethod<Parent, Initial, Current> | SyncUnitMethod<Parent, Initial, Current>;
type AsyncUnitProcedure<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = (input: UnitScope<Parent, Initial, Current>, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[], self: AsyncUnitClass<Parent, Initial, Current>) => AsyncGenerator<Current, Current, Parent>;
type SyncUnitProcedure<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = (input: UnitScope<Parent, Initial, Current>, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[], self: SyncUnitClass<Parent, Initial, Current>) => Generator<Current, Current, Parent>;
/**
 * @description
 * A unit procedure is a generator function that is used to define the behavior
 * of a unit. It can be either an async or sync procedure.
 */
type UnitProcedure<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = AsyncUnitProcedure<Parent, Initial, Current> | SyncUnitProcedure<Parent, Initial, Current>;
/**
 * @description
 * A unit scheme is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method or procedure.
 */
type UnitScheme<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = UnitMethod<Parent, Initial, Current> | UnitProcedure<Parent, Initial, Current>;
/**
 * @description
 * The base unit interface. This is the lowest level of the unit type hierarchy.
 *  It is used to define the common properties of all units.
 */
type UnitBase<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = {
    type: UnitType;
    kind: UnitKind;
    scope: UnitScope<Parent, Initial, Current>;
    branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[];
    next: (value: Parent) => UnitFrame<Current> | PromiseLike<UnitFrame<Current>>;
    [hasInstance]: Set<UnitScheme>;
};
/**
 * @description
 * An async unit is a unit that returns a promise. It is used to define the
 * properties of an async unit.
 */
interface AsyncUnitClass<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.ASYNC;
    future?: PromiseLike<UnitFrame<Current>>;
    state: UnitState;
    next: (value: Parent) => PromiseLike<UnitFrame<Current>>;
}
/**
 * @description
 * A sync unit is a unit that returns a value. It is used to define the
 * properties of a sync unit.
 */
interface SyncUnitClass<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.SYNC;
    next: (value: Parent) => UnitFrame<Current>;
}
/**
 * @description
 * A unit class is a unit that returns a value or a promise. It is used to define the
 * properties of a unit.
 */
type UnitClass<Parent extends UnitScope = any, Initial extends Scope = any, Current extends Scope = any> = AsyncUnitClass<Parent, Initial, Current> | SyncUnitClass<Parent, Initial, Current>;
type SyncUnit<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = SyncUnitClass<UnitScope<Scope, Scope, Parent>, Initial, Current>;
type AsyncUnit<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = AsyncUnitClass<UnitScope<Scope, Scope, Parent>, Initial, Current>;
type Unit<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = SyncUnit<Parent, Initial, Current> | AsyncUnit<Parent, Initial, Current>;

declare const fromAsyncMethod: <Parent extends unknown, Initial extends Scope<any, any>, Current extends Scope<any, any>>(method: AsyncUnitMethod<Parent, Initial, Current>, init: Initial, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]) => AsyncUnitClass<Parent, Initial, Current>;

declare const fromAsyncProcedure: <Parent extends unknown, Initial extends Scope<any, any>, Current extends Scope<any, any>>(procedure: AsyncUnitProcedure<Parent, Initial, Current>, init: Initial, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]) => AsyncUnitClass<Parent, Initial, Current>;

declare const fromSyncMethod: <Parent extends Scope<any, any>, Initial extends Scope<any, any>, Current extends Scope<any, any>>(method: SyncUnitMethod<Parent, Initial, Current>, init: Initial, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]) => SyncUnit<Parent, Initial, Current>;

declare const fromSyncProcedure: <Parent extends unknown, Initial extends Scope<any, any>, Current extends Scope<any, any>>(procedure: SyncUnitProcedure<Parent, Initial, Current>, init: Initial, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]) => SyncUnitClass<Parent, Initial, Current>;

declare const fromKey: <Parent extends Scope<any, any>, Initial extends Scope<any, any>, Current extends Scope<any, any>>(key: Primitive, init: Initial, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]) => Unit<Parent, Initial, Current>;
declare const fromKeyAsync: <Parent extends Scope<any, any>, Initial extends Scope<any, any>, Current extends Scope<any, any>>(key: Primitive, init: Initial, branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]) => Unit<Parent, Initial, Current>;

declare const isSync: (fn: Function) => fn is SyncFunction<any[], any>;
declare const isAsync: (fn: Function) => fn is AsyncFunction<any[], any>;
declare const isGenerator: (fn: Function) => fn is GeneratorFunction;
declare const isAsyncGenerator: (fn: Function) => fn is AsyncUnitProcedure<any, any, any>;
declare const isPromise: (fn: any) => fn is Promise<any>;
declare const isMap: (map: any) => map is MapLike<any, any>;

declare const toFrame: <T>(value: T, done: boolean) => UnitFrame<T>;
declare const toCompleteFrame: <T>(value: T) => UnitFrame<T>;

declare const createUnit: <Parent extends Scope<any, any> = any, Initial extends Scope<any, any> = any, Current extends Scope<any, any> = any>(method: Primitive | UnitMethod<Parent, Initial, Current>, init: Initial, ...branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[]) => Unit<Parent, Initial, Current>;

type HtmlTags = keyof HTMLElementTagNameMap;
type HtmlProps = {
    use: HtmlTags;
    id?: string | number;
    place?: never;
} | {
    use?: never;
    place: string;
};
interface HtmlOutput extends MapLike<HtmlTags, UnitScheme>, JSX.UnitElement {
    root: HTMLElement;
    container: HTMLElement;
    children: Map<HTMLElement, Unit>;
    child: Map<string, Unit<HtmlOutput, HtmlOutput, HtmlOutput>>;
    remove: (id: Unit | string) => boolean;
    trigger: (event: string, payload?: any) => void;
    restyle: (style: Partial<JSX.CSSProperties<string | number, number>>) => void;
    change: (props: Partial<JSX.UnitElement>) => void;
    ignore: Set<string>;
    id: string;
    type?: string;
    payload?: any;
}
/**
 * @description
 * Html is a unit that can be used to create an html elements context.
 * @param props - The props of the unit.
 * @param branches - The branches of the unit.
 * @param self - The unit itself.
 * @returns
 * @example
 * <Html use="div" id="some-div">
 * <Html place="#some-id">
 * <Html use="main">
 *      <div id="some-div"></div>
 * </Html>
 */
declare const Html: (props: HtmlProps, branches: SyncUnit<{
    id: string;
}>[], self: SyncUnit<HtmlProps, HtmlProps, HtmlOutput>) => HtmlOutput;
type HtmlUnit = SyncUnit<HtmlProps, HtmlProps, HtmlOutput>;

export { Html, HtmlUnit, NOOP, Polytype, createUnit, fromAsyncMethod, fromAsyncProcedure, fromKey, fromKeyAsync, fromSyncMethod, fromSyncProcedure, hasInstance, isAsync, isAsyncGenerator, isGenerator, isMap, isPromise, isSync, noop, polytype, toCompleteFrame, toFrame };
