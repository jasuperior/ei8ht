import { hasInstance } from "../api/domain/constants";
import { Polytype } from "../api/domain/polytype";
import { Scope } from "./domain.model";

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

export type UnitScope<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = Polytype<Initial, Parent, Current> & Parent & Current & Initial;
// &
// [parent: Parent, initial: Initial, current: Current];

// ---------------- Unit Methods  ---------------- //
export type AsyncUnitMethod<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: UnitScope<Parent, Initial, Current>,
    branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[],
    self: AsyncUnitClass<Parent, Initial, Current>
) => PromiseLike<Current>;

export type SyncUnitMethod<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: UnitScope<Parent, Initial, Current>,
    branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[],
    self: SyncUnitClass<Parent, Initial, Current>
) => Current;

/**
 * @description
 * A unit method is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method.
 */
export type UnitMethod<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> =
    | AsyncUnitMethod<Parent, Initial, Current>
    | SyncUnitMethod<Parent, Initial, Current>;

// ---------------- Unit Procedures  ---------------- //
export type AsyncUnitProcedure<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: UnitScope<Parent, Initial, Current>,
    branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[],
    self: AsyncUnitClass<Parent, Initial, Current>
) => AsyncGenerator<Current, Current, Parent>;

export type SyncUnitProcedure<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = (
    input: UnitScope<Parent, Initial, Current>,
    branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[],
    self: SyncUnitClass<Parent, Initial, Current>
) => Generator<Current, Current, Parent>;

/**
 * @description
 * A unit procedure is a generator function that is used to define the behavior
 * of a unit. It can be either an async or sync procedure.
 */
export type UnitProcedure<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> =
    | AsyncUnitProcedure<Parent, Initial, Current>
    | SyncUnitProcedure<Parent, Initial, Current>;

/**
 * @description
 * A unit scheme is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method or procedure.
 */
export type UnitScheme<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> =
    | UnitMethod<Parent, Initial, Current>
    | UnitProcedure<Parent, Initial, Current>;

// ---------------- Unit Primitives  ---------------- //
/**
 * @description
 * The base unit interface. This is the lowest level of the unit type hierarchy.
 *  It is used to define the common properties of all units.
 */
export type UnitBase<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = {
    type: UnitType;
    kind: UnitKind;
    scope: UnitScope<Parent, Initial, Current>;
    branches: UnitClass<UnitScope<Parent, Initial, Current>, any, any>[];
    next: (
        value: Parent
    ) => UnitFrame<Current> | PromiseLike<UnitFrame<Current>>;
    [hasInstance]: Set<UnitScheme>;
};

/**
 * @description
 * An async unit is a unit that returns a promise. It is used to define the
 * properties of an async unit.
 */
export interface AsyncUnitClass<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> extends UnitBase<Parent, Initial, Current> {
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
export interface SyncUnitClass<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.SYNC;
    next: (value: Parent) => UnitFrame<Current>;
}

/**
 * @description
 * A unit class is a unit that returns a value or a promise. It is used to define the
 * properties of a unit.
 */
export type UnitClass<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> =
    | AsyncUnitClass<Parent, Initial, Current>
    | SyncUnitClass<Parent, Initial, Current>;

export type SyncUnit<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = SyncUnitClass<UnitScope<Scope, Scope, Parent>, Initial, Current>;

export type AsyncUnit<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = AsyncUnitClass<UnitScope<Scope, Scope, Parent>, Initial, Current>;

export type Unit<
    Parent extends Scope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = SyncUnit<Parent, Initial, Current> | AsyncUnit<Parent, Initial, Current>;
