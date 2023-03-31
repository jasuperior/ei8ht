import { hasInstance } from "../api/domain/constants";
import { Polytype } from "../api/domain/polytype";
import { Scope, StringRecord } from "./domain.model";

/**
 * @description
 * the type of a unit. This is used to determine if the unit is sync or async.
 */
export enum UnitType {
    SYNC = "sync",
    ASYNC = "async",
}
/**
 * @description
 * the state of an async unit. This is used to determine if the unit is
 * pending, resolved, or rejected.
 */
export enum UnitState {
    PENDING = "pending",
    RESOLVED = "resolved",
    REJECTED = "rejected",
}

/**
 * @description
 * the kind of a unit. This is used to determine if the unit is procedural or
 * pure function.
 */
export enum UnitKind {
    METHODIC = "methodic",
    PROCEDURAL = "procedural",
}

/**
 * @description
 * the output of a unit after its next method is called.
 * @template T the type of the unit's scope.
 */
export type UnitFrame<T = any> = {
    value: T;
    done: boolean;
};

export type ParentScope<
    Parent = unknown,
    Initial = unknown,
    Current = unknown
> = Parent & Initial & Current;
export namespace ParentScope {
    export type Of<U extends Unit> = U extends Unit<infer P, infer I, infer C>
        ? ParentScope<P, I, C>
        : never;
}

export type UnitScope<
    Parent extends ParentScope = unknown,
    Initial extends Scope = any,
    Current extends Scope = any
> = Polytype<Initial, Parent, Current> & ParentScope<Parent, Initial, Current>;
// &
// [parent: Parent, initial: Initial, current: Current];

// ---------------- Unit Methods  ---------------- //
export type AsyncWorkMethod<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: ParentScope<Parent, Initial, Current>,
    branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[],
    self: AsyncUnit<Parent, Initial, Current>
) => PromiseLike<Current>;

export type SyncWorkMethod<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: ParentScope<Parent, Initial, Current>,
    branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[],
    self: SyncUnit<Parent, Initial, Current>
) => Current;

/**
 * @description
 * A work method is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method.
 */
export type WorkMethod<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> =
    | AsyncWorkMethod<Parent, Initial, Current>
    | SyncWorkMethod<Parent, Initial, Current>;

// ---------------- Unit Procedures  ---------------- //
export type AsyncWorkProcedure<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: ParentScope<Parent, Initial, Current>,
    branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[],
    self: AsyncUnit<Parent, Initial, Current>
) => AsyncGenerator<Current | void, Current | void, Parent>;

export type SyncWorkProcedure<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: ParentScope<Parent, Initial, Current>,
    branches: Unit<ParentScope<Parent, Initial, Current>, any, any>[],
    self: SyncUnit<Parent, Initial, Current>
) => Generator<Current | void, Current | void, Parent>;

/**
 * @description
 * A work procedure is a generator function that is used to define the behavior
 * of a unit. It can be either an async or sync procedure.
 */
export type WorkProcedure<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> =
    | AsyncWorkProcedure<Parent, Initial, Current>
    | SyncWorkProcedure<Parent, Initial, Current>;

export type SyncWork<
    P extends Scope = any,
    I extends Scope = P,
    C extends Scope = I
> =
    | SyncWorkMethod<ParentScope<unknown, unknown, P>, I, C>
    | SyncWorkProcedure<ParentScope<unknown, unknown, P>, I, C>;

export type AsyncWork<
    P extends Scope = any,
    I extends Scope = P,
    C extends Scope = I
> =
    | AsyncWorkMethod<ParentScope<unknown, unknown, P>, I, C>
    | AsyncWorkProcedure<ParentScope<unknown, unknown, P>, I, C>;

/**
 * @description
 * Work is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method or procedure.
 */
export type Work<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = SyncWork<Parent, Initial, Current> | AsyncWork<Parent, Initial, Current>;

export type WorkOf<U extends Unit> = U["work"];
export namespace Work {
    /**
     * @description
     * An order is a synchronous method of work.
     * It is a function that returns or yields a value.
     * It can be used to define a unit that repeats one or many order(s).
     * @see SyncWork
     * @see SyncWorkMethod
     * @see SyncWorkProcedure
     */
    export type Order<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = SyncWork<Parent, Initial, Current>;

    /**
     * @description
     * An objective is an asynchronous method of work.
     * It is a function that returns or yields a promise.
     * It can be used to define a unit that repeats one or many objective(s).
     * @see AsyncWork
     * @see AsyncWorkMethod
     * @see AsyncWorkProcedure
     */
    export type Objective<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = AsyncWork<Parent, Initial, Current>;

    /**
     * @description
     * a method is a function that returns a single value or promise of a value.
     * It can be used to define a unit that repeats a single method.
     * It can be either an async or sync.
     * @see WorkMethod
     * @see AsyncWorkMethod
     * @see SyncWorkMethod
     */
    export type Method<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = WorkMethod<Parent, Initial, Current>;

    /**
     * @description
     * A procedure is a generator function that returns or yields a value or promise of a value.
     * It can be used to define a unit that repeats a single procedure.
     * It can be either an async or sync.
     * @see WorkProcedure
     * @see AsyncWorkProcedure
     * @see SyncWorkProcedure
     */
    export type Procedure<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = WorkProcedure<Parent, Initial, Current>;

    /**
     * @description
     * A step is a synchronous method of work.
     * It is a function that returns a value.
     * It can be used to define a unit that repeats a single step.
     * @see SyncWorkMethod
     * @see WorkMethod
     */
    export type Step<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = SyncWorkMethod<Parent, Initial, Current>;

    /**
     * @description
     * A goal is an asynchronous method of work.
     * It is a function that returns a promise.
     * It can be used to define a unit that repeats a single promise of a step.
     * @see AsyncWorkMethod
     * @see WorkMethod
     */
    export type Goal<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = AsyncWorkMethod<Parent, Initial, Current>;

    /**
     * @description
     * A process is a synchronous procedure of work.
     * It is a generator function that yields values and returns a final value.
     * It can be used to define a unit that is composed of multiple steps.
     * @see SyncWorkProcedure
     * @see WorkProcedure
     */
    export type Process<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = SyncWorkProcedure<Parent, Initial, Current>;

    /**
     * @description
     * A pursuit is an asynchronous procedure of work.
     * It is a generator function that yields promises and returns a final promise.
     * It can be used to define a unit that is composed of multiple goals.
     * @see AsyncWorkProcedure
     * @see WorkProcedure
     */
    export type Pursuit<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = AsyncWorkProcedure<Parent, Initial, Current>;

    export type Of<U extends Unit> = WorkOf<U>;
}
// ---------------- Unit Primitives  ---------------- //
/**
 * @description
 * The base unit interface. This is the lowest level of the unit type hierarchy.
 *  It is used to define the common properties of all units.
 */
export type UnitBase<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = {
    type: UnitType;
    kind: UnitKind;
    scope: ParentScope<Parent, Initial, Current>;
    branches: Unit.Branches<Parent, Initial, Current>;
    work: Work<Parent, Initial, Current>;
    next: (
        value: Parent | Initial
    ) => UnitFrame<Current> | PromiseLike<UnitFrame<Current>>;
    [hasInstance]: Set<Work>;
};

export interface AsyncUnitClass<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.ASYNC;
    future?: PromiseLike<UnitFrame<Current>>;
    state: UnitState;
    work: Work.Objective<Parent, Initial, Current>;
    next: (value: Parent | Initial) => PromiseLike<UnitFrame<Current>>;
}

export interface SyncUnitClass<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.SYNC;
    work: Work.Order<Parent, Initial, Current>;
    next: (value: Parent | Initial) => UnitFrame<Current>;
}

export interface ProceduralUnitClass<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> extends UnitBase<Parent, Initial, Current> {
    kind: UnitKind.PROCEDURAL;
    work: Work.Procedure<Parent, Initial, Current>;
    future?: PromiseLike<UnitFrame<Current>>;
    state?: UnitState;
}

export interface MethodicUnitClass<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> extends UnitBase<Parent, Initial, Current> {
    kind: UnitKind.METHODIC;
    work: Work.Method<Parent, Initial, Current>;
    state?: UnitState;
    future?: PromiseLike<UnitFrame<Current>>;
}

/**
 * @description
 * A unit class is a unit that yields a value or a promise.
 */
export type UnitClass<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> =
    | AsyncUnitClass<Parent, Initial, Current>
    | SyncUnitClass<Parent, Initial, Current>;

/**
 * @description
 * A sync unit is a unit that yields a value.
 */
export type SyncUnit<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = SyncUnitClass<Parent, Initial, Current>;
/**
 * @description
 * An async unit is a unit that yields a promise.
 */
export type AsyncUnit<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = AsyncUnitClass<Parent, Initial, Current>;

export type ProceduralUnit<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = ProceduralUnitClass<Parent, Initial, Current>;

export type MethodicUnit<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = MethodicUnitClass<Parent, Initial, Current>;

export type Unit<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> =
    | SyncUnit<Parent, Initial, Current>
    | AsyncUnit<Parent, Initial, Current>
    | ProceduralUnit<Parent, Initial, Current>
    | MethodicUnit<Parent, Initial, Current>;

/**
 * @description
 * A unit branch is a unit that is nested within another unit.
 * it inherits the scope of its parent unit.
 * It inherently runs when its parent unit succesfully yields a value or promise.
 * It can be either an async or sync.
 */
export type UnitBranch<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = Unit<ParentScope<Parent, Initial, Current>, any, any>;

/**
 * @description
 * Unit branches are an array of unit branch.
 * It is used to define the branches of a unit.
 */
export type UnitBranches<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = UnitBranch<Parent, Initial, Current>[];

export type UnitOf<W> = W extends Work<infer P, infer I, infer C>
    ? W extends AsyncWork<P, I, C>
        ? Unit.Lazy<P, I, C>
        : Unit.Eager<P, I, C>
    : never;
export namespace Unit {
    export type Interface<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = UnitBase<Parent, Initial, Current>;
    export type Class<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = UnitClass<Parent, Initial, Current>;
    /**
     * @description
     * alias for `UnitBranch`
     * @see UnitBranch
     */
    export type Branch<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = UnitBranch<Parent, Initial, Current>;
    /**
     * @description
     * alias for `UnitBranches`
     * @see UnitBranches
     */
    export type Branches<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = UnitBranches<Parent, Initial, Current>;

    /**
     * @description
     * A lazy unit is an async unit.
     * It is a unit that yields a promise.
     */
    export type Lazy<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = AsyncUnit<Parent, Initial, Current>;

    /**
     * @description
     * An eager unit is a sync unit.
     * It is a unit that yields a value.
     * @see SyncUnit
     */
    export type Eager<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = SyncUnit<Parent, Initial, Current>;

    /**
     * @description
     * A simple unit is a methodic unit.
     * It is a unit that yields a stable value or a promise.
     * It is stateless.
     * @see MethodicUnit
     * @see Unit
     * @see Work.Method
     */
    export type Simple<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = MethodicUnit<Parent, Initial, Current>;

    /**
     * @description
     * A complex unit is a procedural unit.
     * It is a unit that yields variable values or a promises.
     * It is stateful.
     * @see ProceduralUnit
     * @see Unit
     * @see Work.Procedure
     */
    export type Complex<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = ProceduralUnit<Parent, Initial, Current>;

    /**
     * @description
     * A unit of a sync or async work action.
     * @see UnitOf
     * @see Unit
     * @see Work
     */
    export type Of<W> = UnitOf<W>;

    export type Type = UnitType;
    export type Kind = UnitKind;
}

export namespace Branch {
    export type From<U extends Unit> = U extends Unit<infer P, infer I, infer C>
        ? Unit.Branch<P, I, C>
        : never;
    export type Of<
        U extends Unit,
        Initial extends Scope = any,
        Current extends Scope = Initial
    > = U extends Unit ? Unit<ParentScope.Of<U>, Initial, Current> : never;
}
export namespace Branches {
    export type Of<U extends Unit> = U extends Unit<infer P, infer I, infer C>
        ? Branch.From<U>[]
        : never;
}
