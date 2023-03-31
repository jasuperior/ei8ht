import { fromSyncMethod } from "../../index";
import { UnitKind, UnitType } from "../../model/unit.model";

describe("fromSyncMethod", () => {
    it("should be a function", () => {
        expect(typeof fromSyncMethod).toBe("function");
    });
    it("should return a pure sync unit", () => {
        const unit = fromSyncMethod(
            () => {
                return {};
            },
            {},
            []
        );
        expect(unit.type).toBe(UnitType.SYNC);
        expect(unit.kind).toBe(UnitKind.METHODIC);
    });
    describe("when next is called", () => {
        it("should return a done iterator result", () => {
            const unit = fromSyncMethod(
                () => {
                    return {};
                },
                {},
                []
            );
            const result = unit.next({} as any);
            expect(result.done).toBe(true);
            expect(result.value).toMatchObject({});
        });
        it("should call the method again", () => {
            const method = jest.fn(() => {
                return {};
            });
            const unit = fromSyncMethod(method, {}, []);
            unit.next({} as any);
            expect(method).toHaveBeenCalledTimes(2);
        });
        it("should call the method with the input", () => {
            const method = jest.fn((props) => {
                return props.chain[0];
            });
            const unit = fromSyncMethod(method, {}, []);
            unit.next({ foo: "bar" } as any);
            expect(method).toHaveLastReturnedWith({ foo: "bar" });
        });
    });
});
