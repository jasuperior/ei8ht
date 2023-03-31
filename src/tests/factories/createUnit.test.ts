import { createUnit } from "../../api/factories/createUnit";
import {
    AsyncUnit,
    SyncUnit,
    Unit,
    UnitFrame,
    UnitKind,
    UnitType,
} from "../../model";

describe("createUnit", () => {
    describe("when called with a sync unit method", () => {
        it("should return a pure sync unit", () => {
            const unit = createUnit(() => ({}), {});
            expect(unit.type).toBe(UnitType.SYNC);
            expect(unit.kind).toBe(UnitKind.PURE);
        });
    });
    describe("when called with an async unit method", () => {
        it("should return a pure async unit", () => {
            const unit = createUnit(async () => ({}), {});
            expect(unit.type).toBe(UnitType.ASYNC);
            expect(unit.kind).toBe(UnitKind.PURE);
        });
    });
    describe("when called with a sync unit procedure", () => {
        it("should return a procedural sync unit", () => {
            const unit = createUnit(function* () {}, {});
            expect(unit.type).toBe(UnitType.SYNC);
            expect(unit.kind).toBe(UnitKind.PROCEDURAL);
        });
    });
    describe("when called with an async unit procedure", () => {
        it("should return a procedural async unit", () => {
            const unit = createUnit(async function* () {}, {});
            expect(unit.type).toBe(UnitType.ASYNC);
            expect(unit.kind).toBe(UnitKind.PROCEDURAL);
        });
    });
    describe("when called with a primitive", () => {
        let unit: Unit;
        beforeEach(() => {
            unit = createUnit("key", {}) as SyncUnit;
        });
        it("should return a procedural sync unit", () => {
            expect(unit.type).toBe(UnitType.SYNC);
            expect(unit.kind).toBe(UnitKind.PROCEDURAL);
        });
        describe("and the next scope contains the primitive key", () => {
            describe("and the scope is an object", () => {
                it("should become a unit of the function defined by the key on the scope", () => {
                    const value = {};
                    const scope = {
                        key: function* () {
                            return value;
                        },
                    };
                    const frame = unit.next(scope) as UnitFrame;
                    expect(frame.value).toBe(value);
                });
            });
            describe("and the scope is map like", () => {
                it("should become a unit of the function defined by the key on the scope", () => {
                    const value = {};
                    const scope = {
                        get(key: string) {
                            if (key === "key") {
                                return function* () {
                                    return value;
                                };
                            }
                            return undefined;
                        },
                    };
                    const frame = unit.next(scope) as UnitFrame;
                    expect(frame.value).toBe(value);
                });
            });
        });
        describe("and the next scope does not contain the primitive key", () => {
            it("should remain still be an instance of the noop unit", () => {
                const scope = {
                    someOtherKey: function* () {
                        return {};
                    },
                };
                const frame = unit.next(scope) as UnitFrame;
                expect(unit.type).toBe(UnitType.SYNC);
                expect(unit.kind).toBe(UnitKind.PROCEDURAL);
                expect(frame.value).toBeNull();
            });
        });
        describe("and an initial scope includes await key set to true", () => {
            beforeEach(() => {
                unit = createUnit("key", { await: true }) as AsyncUnit;
            });
            it("should return a procedural async unit", () => {
                expect(unit.type).toBe(UnitType.ASYNC);
                expect(unit.kind).toBe(UnitKind.PROCEDURAL);
            });
        });
    });
    describe("when called with a primitive and an initial scope", () => {
        it("should contain a scope with values from the initial scope", () => {
            const initialScope = { key: "value" };
            const unit = createUnit("key", initialScope) as SyncUnit;
            expect(unit.scope.key).toBe(initialScope.key);
        });
    });
    describe("when called with branches", () => {
        it("should return a unit containing the branches", () => {
            const branch = createUnit(jest.fn(), {});
            const unit = createUnit(jest.fn(), {}, branch);
            expect(unit.branches).toHaveLength(1);
            expect(unit.branches).toContain(branch);
        });
    });
});
