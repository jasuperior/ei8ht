import { Polytype } from "../api/domain/polytype";
import { Scope } from "./domain.model";

export enum UnitType {
    SYNC = "sync",
    ASYNC = "async",
}
export enum UnitState {
    PENDING = "pending",
    RESOLVED = "resolved",
    REJECTED = "rejected",
}
export enum UnitKind {
    PURE = "pure",
    PROCEDURAL = "procedural",
}
export type UnitFrame<T> = {
    value: T;
    done: boolean;
};

export type UnitScope<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = Polytype<Initial, Parent, Current> &
    Parent &
    Current &
    Initial &
    [parent: Parent, initial: Initial, current: Current];

// ---------------- Unit Methods  ---------------- //
export type AsyncUnitMethod<
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
> = (
    input: UnitScope<Parent, Initial, Current>,
    branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[],
    self: AsyncUnit<Parent, Initial, Current>
) => PromiseLike<Current>;

export type SyncUnitMethod<
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
> = (
    input: UnitScope<Parent, Initial, Current>,
    branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[],
    self: SyncUnit<Parent, Initial, Current>
) => Current;

/**
 * @description
 * A unit method is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method.
 */
export type UnitMethod<
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
> =
    | AsyncUnitMethod<Parent, Initial, Current>
    | SyncUnitMethod<Parent, Initial, Current>;

// ---------------- Unit Procedures  ---------------- //
export type AsyncUnitProcedure<
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
> = (
    input: UnitScope<Parent, Initial, Current>,
    branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[],
    self: AsyncUnit<Parent, Initial, Current>
) => AsyncGenerator<Current, Current, Parent>;

export type SyncUnitProcedure<
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
> = (
    input: UnitScope<Parent, Initial, Current>,
    branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[],
    self: SyncUnit<Parent, Initial, Current>
) => Generator<Current, Current, Parent>;

/**
 * @description
 * A unit procedure is a generator function that is used to define the behavior
 * of a unit. It can be either an async or sync procedure.
 */
export type UnitProcedure<
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
> =
    | AsyncUnitProcedure<Parent, Initial, Current>
    | SyncUnitProcedure<Parent, Initial, Current>;

/**
 * @description
 * A unit scheme is a function that is used to define the behavior of a unit.
 * It can be either an async or sync method or procedure.
 */
export type UnitScheme<
    Parent extends UnitScope,
    Initial extends Scope,
    Current extends Scope
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
    branches: Unit<UnitScope<Parent, Initial, Current>, any, any>[];
    next: (
        value: Parent
    ) => UnitFrame<Current> | PromiseLike<UnitFrame<Current>>;
};

/**
 * @description
 * An async unit is a unit that returns a promise. It is used to define the
 * properties of an async unit.
 */
export interface AsyncUnit<
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
export interface SyncUnit<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> extends UnitBase<Parent, Initial, Current> {
    type: UnitType.SYNC;
    next: (value: Parent) => UnitFrame<Current>;
}
/**
 * @description
 * A unit is a unit that returns a value or a promise. It is used to define the
 * properties of a unit.
 */
export type Unit<
    Parent extends UnitScope = any,
    Initial extends Scope = any,
    Current extends Scope = any
> = AsyncUnit<Parent, Initial, Current> | SyncUnit<Parent, Initial, Current>;
