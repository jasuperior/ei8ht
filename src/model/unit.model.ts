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
    PURE = "pure",
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

export type PolyScope<
    Parent = unknown,
    Initial = unknown,
    Current = unknown
> = Parent & Initial & Current;

export type UnitScope<
    Parent extends PolyScope = unknown,
    Initial extends Scope = any,
    Current extends Scope = any
> = Polytype<Initial, Parent, Current> & PolyScope<Parent, Initial, Current>;
// &
// [parent: Parent, initial: Initial, current: Current];

// ---------------- Unit Methods  ---------------- //
export type AsyncWorkMethod<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: PolyScope<Parent, Initial, Current>,
    branches: Unit<PolyScope<Parent, Initial, Current>, any, any>[],
    self: AsyncUnit<Parent, Initial, Current>
) => PromiseLike<Current>;

export type SyncWorkMethod<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: PolyScope<Parent, Initial, Current>,
    branches: Unit<PolyScope<Parent, Initial, Current>, any, any>[],
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
    input: PolyScope<Parent, Initial, Current>,
    branches: Unit<PolyScope<Parent, Initial, Current>, any, any>[],
    self: AsyncUnit<Parent, Initial, Current>
) => AsyncGenerator<Current | void, Current | void, Parent>;

export type SyncWorkProcedure<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: PolyScope<Parent, Initial, Current>,
    branches: Unit<PolyScope<Parent, Initial, Current>, any, any>[],
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
    | SyncWorkMethod<PolyScope<unknown, unknown, P>, I, C>
    | SyncWorkProcedure<PolyScope<unknown, unknown, P>, I, C>;

export type AsyncWork<
    P extends Scope = any,
    I extends Scope = P,
    C extends Scope = I
> =
    | AsyncWorkMethod<PolyScope<unknown, unknown, P>, I, C>
    | AsyncWorkProcedure<PolyScope<unknown, unknown, P>, I, C>;

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
    export type Sync<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = SyncWork<Parent, Initial, Current>;

    export type Async<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = AsyncWork<Parent, Initial, Current>;

    export type Method<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = WorkMethod<Parent, Initial, Current>;

    export type Procedure<
        Parent extends Scope = any,
        Initial extends Scope = Parent,
        Current extends Scope = Initial
    > = WorkProcedure<Parent, Initial, Current>;

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
    scope: PolyScope<Parent, Initial, Current>;
    branches: Unit<PolyScope<Parent, Initial, Current>, any, any>[];
    work: Work<Parent, Initial, Current>;
    next: (
        value: Parent | Initial
    ) => UnitFrame<Current> | PromiseLike<UnitFrame<Current>>;
    [hasInstance]: Set<Work>;
};

/**
 * @description
 * An async unit is a unit that returns a promise. It is used to define the
 * properties of an async unit.
 */
export interface AsyncUnitClass<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.ASYNC;
    future?: PromiseLike<UnitFrame<Current>>;
    state: UnitState;
    next: (value: Parent | Initial) => PromiseLike<UnitFrame<Current>>;
}

/**
 * @description
 * A sync unit is a unit that returns a value. It is used to define the
 * properties of a sync unit.
 */
export interface SyncUnitClass<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.SYNC;
    next: (value: Parent | Initial) => UnitFrame<Current>;
}

/**
 * @description
 * A unit class is a unit that returns a value or a promise. It is used to define the
 * properties of a unit.
 */
export type UnitClass<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> =
    | AsyncUnitClass<Parent, Initial, Current>
    | SyncUnitClass<Parent, Initial, Current>;

export type SyncUnit<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = SyncUnitClass<Parent, Initial, Current>;

export type AsyncUnit<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = AsyncUnitClass<Parent, Initial, Current>;

export type Unit<
    Parent extends Scope = any,
    Initial extends Scope = Parent,
    Current extends Scope = Initial
> = SyncUnit<Parent, Initial, Current> | AsyncUnit<Parent, Initial, Current>;

export type UnitOf<W> = W extends Work<infer P, infer I, infer C>
    ? W extends AsyncWork<P, I, C>
        ? AsyncUnit<P, I, C>
        : SyncUnit<P, I, C>
    : never;
export namespace Unit {
    export type Base<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = UnitBase<Parent, Initial, Current>;
    export type Class<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = UnitClass<Parent, Initial, Current>;
    export type Async<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = AsyncUnitClass<Parent, Initial, Current>;
    export type Sync<
        Parent extends Scope = any,
        Initial extends Scope = any,
        Current extends Scope = any
    > = SyncUnitClass<Parent, Initial, Current>;
    export type Of<W> = UnitOf<W>;
}
