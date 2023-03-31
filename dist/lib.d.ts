declare const NOOP: unique symbol;
declare const noop: symbol;
declare const hasInstance: unique symbol;

type Primitive = string | boolean | number;
type Key = string | symbol | number;
type MapLike<T, U> = {
    get(key: T): U | void;
    set(key: T, value: U): void;
} & (T extends string ? Record<T, U> : {});
type AsyncFunction<T extends any[] = any[], U = any> = (...args: T) => PromiseLike<U>;
type SyncFunction<T extends any[] = any[], U = any> = (...args: T) => U;
type KeyedScope<T extends Scope> = T & {
    tag?: string;
};
type ScopeFrom<T extends Record<string, any> | Scope> = T extends Record<infer K, infer V> ? Scope<K, V> : T;
type Scope<T extends Key = string, U = any> = Record<T, U> | MapLike<T, U>;
declare namespace Scope {
    type Of<U extends Unit> = U extends Unit<infer T, infer V, infer W> ? T & V & W : never;
    type From<T extends Record<string, any> | Scope> = ScopeFrom<T>;
}

declare class Polytype<Current extends Scope = any, Prev extends any = any, Next extends Scope = any> {
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
    METHODIC = "methodic",
    PROCEDURAL = "procedural"
}
/**
 * @description
 * the output of a unit after its next method is called.
 * @template T the type of the unit's scope.
 */
type UnitFrame<T = any> = {
    value: T;
    done: boolean;
};
type ParentScope<Parent = unknown, Initial = unknown, Current = unknown> = Parent & Initial & Current;
declare namespace ParentScope {
    type Of<U extends Unit> = U extends Unit<infer P, infer I, infer C> ? ParentScope<P, I, C> : never;
}
type AsyncWorkMethod<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = (input: ParentScope<Parent, Initial, Current>, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[], self: AsyncUnit<Parent, Initial, Current>) => PromiseLike<Current>;
type SyncWorkMethod<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = (input: ParentScope<Parent, Initial, Current>, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[], self: SyncUnit<Parent, Initial, Current>) => Current;
/**
 * @description
 * A work method is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method.
 */
type WorkMethod<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = AsyncWorkMethod<Parent, Initial, Current> | SyncWorkMethod<Parent, Initial, Current>;
type AsyncWorkProcedure<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = (input: ParentScope<Parent, Initial, Current>, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[], self: AsyncUnit<Parent, Initial, Current>) => AsyncGenerator<Current | void, Current | void, Parent>;
type SyncWorkProcedure<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = (input: ParentScope<Parent, Initial, Current>, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[], self: SyncUnit<Parent, Initial, Current>) => Generator<Current | void, Current | void, Parent>;
/**
 * @description
 * A work procedure is a generator function that is used to define the behavior
 * of a unit. It can be either an async or sync procedure.
 */
type WorkProcedure<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = AsyncWorkProcedure<Parent, Initial, Current> | SyncWorkProcedure<Parent, Initial, Current>;
type SyncWork<P extends Scope = any, I extends Scope = P, C extends Scope = I> = SyncWorkMethod<ParentScope<unknown, unknown, P>, I, C> | SyncWorkProcedure<ParentScope<unknown, unknown, P>, I, C>;
type AsyncWork<P extends Scope = any, I extends Scope = P, C extends Scope = I> = AsyncWorkMethod<ParentScope<unknown, unknown, P>, I, C> | AsyncWorkProcedure<ParentScope<unknown, unknown, P>, I, C>;
type WorkOf<U extends Unit> = U["work"];
/**
 * @description
 * Work is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method or procedure.
 */
type Work<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = SyncWork<Parent, Initial, Current> | AsyncWork<Parent, Initial, Current>;
declare namespace Work {
    /**
     * @description
     * An order is a synchronous method of work.
     * It is a function that returns or yields a value.
     * It can be used to define a unit that repeats one or many order(s).
     * @see SyncWork
     * @see SyncWorkMethod
     * @see SyncWorkProcedure
     */
    type Order<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = SyncWork<Parent, Initial, Current>;
    /**
     * @description
     * An objective is an asynchronous method of work.
     * It is a function that returns or yields a promise.
     * It can be used to define a unit that repeats one or many objective(s).
     * @see AsyncWork
     * @see AsyncWorkMethod
     * @see AsyncWorkProcedure
     */
    type Objective<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = AsyncWork<Parent, Initial, Current>;
    /**
     * @description
     * a method is a function that returns a single value or promise of a value.
     * It can be used to define a unit that repeats a single method.
     * It can be either an async or sync.
     * @see WorkMethod
     * @see AsyncWorkMethod
     * @see SyncWorkMethod
     */
    type Method<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = WorkMethod<Parent, Initial, Current>;
    /**
     * @description
     * A procedure is a generator function that returns or yields a value or promise of a value.
     * It can be used to define a unit that repeats a single procedure.
     * It can be either an async or sync.
     * @see WorkProcedure
     * @see AsyncWorkProcedure
     * @see SyncWorkProcedure
     */
    type Procedure<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = WorkProcedure<Parent, Initial, Current>;
    /**
     * @description
     * A step is a synchronous method of work.
     * It is a function that returns a value.
     * It can be used to define a unit that repeats a single step.
     * @see SyncWorkMethod
     * @see WorkMethod
     */
    type Step<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = SyncWorkMethod<Parent, Initial, Current>;
    /**
     * @description
     * A goal is an asynchronous method of work.
     * It is a function that returns a promise.
     * It can be used to define a unit that repeats a single promise of a step.
     * @see AsyncWorkMethod
     * @see WorkMethod
     */
    type Goal<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = AsyncWorkMethod<Parent, Initial, Current>;
    /**
     * @description
     * A process is a synchronous procedure of work.
     * It is a generator function that yields values and returns a final value.
     * It can be used to define a unit that is composed of multiple steps.
     * @see SyncWorkProcedure
     * @see WorkProcedure
     */
    type Process<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = SyncWorkProcedure<Parent, Initial, Current>;
    /**
     * @description
     * A pursuit is an asynchronous procedure of work.
     * It is a generator function that yields promises and returns a final promise.
     * It can be used to define a unit that is composed of multiple goals.
     * @see AsyncWorkProcedure
     * @see WorkProcedure
     */
    type Pursuit<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = AsyncWorkProcedure<Parent, Initial, Current>;
    type Of<U extends Unit> = WorkOf<U>;
}
/**
 * @description
 * The base unit interface. This is the lowest level of the unit type hierarchy.
 *  It is used to define the common properties of all units.
 */
type UnitBase<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = {
    type: UnitType;
    kind: UnitKind;
    scope: ParentScope<Parent, Initial, Current>;
    branches: Unit.Branches<Parent, Initial, Current>;
    work: Work<Parent, Initial, Current>;
    next: (value: Parent | Initial) => UnitFrame<Current> | PromiseLike<UnitFrame<Current>>;
    [hasInstance]: Set<Work>;
};
interface AsyncUnitClass<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.ASYNC;
    future?: PromiseLike<UnitFrame<Current>>;
    state: UnitState;
    work: Work.Objective<Parent, Initial, Current>;
    next: (value: Parent | Initial) => PromiseLike<UnitFrame<Current>>;
}
interface SyncUnitClass<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.SYNC;
    work: Work.Order<Parent, Initial, Current>;
    next: (value: Parent | Initial) => UnitFrame<Current>;
}
interface ProceduralUnitClass<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> extends UnitBase<Parent, Initial, Current> {
    kind: UnitKind.PROCEDURAL;
    work: Work.Procedure<Parent, Initial, Current>;
    future?: PromiseLike<UnitFrame<Current>>;
    state?: UnitState;
}
interface MethodicUnitClass<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> extends UnitBase<Parent, Initial, Current> {
    kind: UnitKind.METHODIC;
    work: Work.Method<Parent, Initial, Current>;
    state?: UnitState;
    future?: PromiseLike<UnitFrame<Current>>;
}
/**
 * @description
 * A unit class is a unit that yields a value or a promise.
 */
type UnitClass<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = AsyncUnitClass<Parent, Initial, Current> | SyncUnitClass<Parent, Initial, Current>;
/**
 * @description
 * A sync unit is a unit that yields a value.
 */
type SyncUnit<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = SyncUnitClass<Parent, Initial, Current>;
/**
 * @description
 * An async unit is a unit that yields a promise.
 */
type AsyncUnit<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = AsyncUnitClass<Parent, Initial, Current>;
type ProceduralUnit<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = ProceduralUnitClass<Parent, Initial, Current>;
type MethodicUnit<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = MethodicUnitClass<Parent, Initial, Current>;
/**
 * @description
 * A unit branch is a unit that is nested within another unit.
 * it inherits the scope of its parent unit.
 * It inherently runs when its parent unit succesfully yields a value or promise.
 * It can be either an async or sync.
 */
type UnitBranch<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = Unit<ParentScope<Parent, Initial, Current>, any, any>;
/**
 * @description
 * Unit branches are an array of unit branch.
 * It is used to define the branches of a unit.
 */
type UnitBranches<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = UnitBranch<Parent, Initial, Current>[];
type UnitOf<W> = W extends Work<infer P, infer I, infer C> ? W extends AsyncWork<P, I, C> ? Unit.Lazy<P, I, C> : Unit.Eager<P, I, C> : never;
type Unit<Parent extends Scope = any, Initial extends Scope = Parent, Current extends Scope = Initial> = SyncUnit<Parent, Initial, Current> | AsyncUnit<Parent, Initial, Current> | ProceduralUnit<Parent, Initial, Current> | MethodicUnit<Parent, Initial, Current>;
declare namespace Unit {
    type Interface<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = UnitBase<Parent, Initial, Current>;
    type Class<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = UnitClass<Parent, Initial, Current>;
    /**
     * @description
     * alias for `UnitBranch`
     * @see UnitBranch
     */
    type Branch<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = UnitBranch<Parent, Initial, Current>;
    /**
     * @description
     * alias for `UnitBranches`
     * @see UnitBranches
     */
    type Branches<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = UnitBranches<Parent, Initial, Current>;
    /**
     * @description
     * A lazy unit is an async unit.
     * It is a unit that yields a promise.
     */
    type Lazy<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = AsyncUnit<Parent, Initial, Current>;
    /**
     * @description
     * An eager unit is a sync unit.
     * It is a unit that yields a value.
     * @see SyncUnit
     */
    type Eager<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = SyncUnit<Parent, Initial, Current>;
    /**
     * @description
     * A simple unit is a methodic unit.
     * It is a unit that yields a stable value or a promise.
     * It is stateless.
     * @see MethodicUnit
     * @see Unit
     * @see Work.Method
     */
    type Simple<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = MethodicUnit<Parent, Initial, Current>;
    /**
     * @description
     * A complex unit is a procedural unit.
     * It is a unit that yields variable values or a promises.
     * It is stateful.
     * @see ProceduralUnit
     * @see Unit
     * @see Work.Procedure
     */
    type Complex<Parent extends Scope = any, Initial extends Scope = any, Current extends Scope = any> = ProceduralUnit<Parent, Initial, Current>;
    /**
     * @description
     * A unit of a sync or async work action.
     * @see UnitOf
     * @see Unit
     * @see Work
     */
    type Of<W> = UnitOf<W>;
    type Type = UnitType;
    type Kind = UnitKind;
}

declare const fromAsyncMethod: <Parent extends Scope<string, any>, Initial extends Scope<string, any>, Current extends Scope<string, any>>(method: AsyncWorkMethod<Parent, Initial, Current>, init: Initial, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[]) => AsyncUnitClass<Parent, Initial, Current>;

declare const fromAsyncProcedure: <Parent extends Scope<string, any>, Initial extends Scope<string, any>, Current extends Scope<string, any>>(procedure: AsyncWorkProcedure<Parent, Initial, Current>, init: Initial, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[]) => AsyncUnit<Parent, Initial, Current>;

declare const fromSyncMethod: <Parent extends Scope<string, any>, Initial extends Scope<string, any>, Current extends Scope<string, any>>(method: SyncWorkMethod<Parent, Initial, Current>, init: Initial, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[]) => SyncUnit<Parent, Initial, Current>;

declare const fromSyncProcedure: <Parent extends Scope<string, any>, Initial extends Scope<string, any>, Current extends Scope<string, any>>(procedure: SyncWorkProcedure<Parent, Initial, Current>, init: Initial, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[]) => SyncUnit<Parent, Initial, Current>;

declare const fromKey: <Parent extends Scope<string, any>, Initial extends Scope<string, any>, Current extends Scope<string, any>>(key: Primitive, init: Initial, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[]) => Unit<Parent, Initial, Current>;
declare const fromKeyAsync: <Parent extends Scope<string, any>, Initial extends Scope<string, any>, Current extends Scope<string, any>>(key: Primitive, init: Initial, branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[]) => Unit<Parent, Initial, Current>;

declare const isSync: (fn: Function) => fn is SyncFunction<any[], any>;
declare const isAsync: (fn: Function) => fn is AsyncFunction<any[], any>;
declare const isGenerator: (fn: Function) => fn is GeneratorFunction;
declare const isAsyncGenerator: (fn: Function) => fn is AsyncWorkProcedure<any, any, any>;
declare const isPromise: (fn: any) => fn is Promise<any>;
declare const isMap: (map: any) => map is MapLike<any, any>;

declare const toFrame: <T>(value: T, done: boolean) => UnitFrame<T>;
declare const toCompleteFrame: <T>(value: T) => UnitFrame<T>;

declare const createUnit: <Parent extends Scope<string, any> = any, Initial extends Scope<string, any> = any, Current extends Scope<string, any> = any>(method: Primitive | Work<Parent, Initial, Current>, init: Initial, ...branches: Unit.Branches<Parent, Initial, Current>) => Unit<Parent, Initial, Current>;

type HtmlTags = keyof HTMLElementTagNameMap;
type HtmlInput = KeyedScope<({
    use: HtmlTags;
    id?: string | number;
    place?: never;
} | {
    use?: never;
    place: string;
}) & {
    event?: string;
}>;
interface IHtmlOutput extends JSX.UnitElement {
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
type HtmlOutput = IHtmlOutput & MapLike<HtmlTags, Unit<Scope, Scope, IHtmlOutput>>;
type HtmlUnit = Unit.Eager<HtmlInput, HtmlInput, HtmlOutput>;
type HtmlChildUnit<I extends Scope = any, C extends Scope = I> = Unit.Eager<Partial<ParentScope.Of<HtmlUnit>>, I, C>;
/**
 * @description
 * Html is a unit that can be used to create a context for html elements.
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
declare const Html: (props: HtmlInput, branches: SyncUnit<{
    id: string;
}>[], self: SyncUnit<HtmlInput, HtmlInput, HtmlOutput>) => HtmlOutput;
declare namespace Html {
    type Unit = HtmlUnit;
    type Child<I extends Scope = any, C extends Scope = I> = HtmlChildUnit<I, C>;
    type Children<I extends Scope = any, C extends Scope = I> = HtmlChildUnit<I, C>[];
}

export { Html, HtmlChildUnit, HtmlOutput, HtmlUnit, NOOP, Polytype, createUnit, fromAsyncMethod, fromAsyncProcedure, fromKey, fromKeyAsync, fromSyncMethod, fromSyncProcedure, hasInstance, isAsync, isAsyncGenerator, isGenerator, isMap, isPromise, isSync, noop, polytype, toCompleteFrame, toFrame };
