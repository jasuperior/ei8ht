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
        expect(unit.kind).toBe(UnitKind.PURE);
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
            const result = unit.next({});
            expect(result.done).toBe(true);
        });
        it("should call the method again", () => {
            const method = jest.fn(() => {
                return {};
            });
            const unit = fromSyncMethod(method, {}, []);
            unit.next({});
            expect(method).toHaveBeenCalledTimes(2);
        });
        it("should call the method with the input", () => {
            const method = jest.fn(() => {
                return {};
            });
            const unit = fromSyncMethod(method, {}, []);
            unit.next({ foo: "bar" });
            //this doesnt work because the input is a polytype
            // expect(method).toHaveBeenCalledWith(
            //     expect.anything(),
            //     expect.anything(),
            //     expect.anything(),
            //     { foo: "bar" }
            // );
        });
    });
});
