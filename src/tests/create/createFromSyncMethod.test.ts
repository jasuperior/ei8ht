//create test for createFromSyncMethod
//  - test that it returns a UnitIterator
//  - test that it returns a UnitIterator with a type of UnitType.SYNC
//  - test that it returns a UnitIterator with a chain that contains the value
//  - test that it returns a UnitIterator with a chain that contains the input
//  - test that it nexts the value
// - test that it calls the function with the chain, branches, and this
// - test that it nexts the branches with the chain if the value is not undefined

import { createFromSyncMethod } from "../../api/create/createFromSyncMethod";

describe("createFromSyncMethod", () => {
    let value: {},
        fn: jest.Mock<any, any, any>,
        input: {},
        output,
        branches,
        chain;
    beforeEach(() => {
        jest.resetAllMocks();
        input = {};
        value = {};
        fn = jest.fn();
    });
    it("should return a UnitIterator", () => {
        expect(createFromSyncMethod(value, fn, input, [])).toBeDefined();
    });
    it("should return a UnitIterator with a type of UnitType.SYNC", () => {
        expect(createFromSyncMethod(value, fn, input, []).type).toEqual("SYNC");
    });
    it("should return a UnitIterator with a chain that contains the value", () => {
        expect(createFromSyncMethod(value, fn, input, []).chain).toContain({});
    });
    it("should next the value and be done", () => {
        let value2 = {};
        expect(createFromSyncMethod(value, fn, input, []).next(value2)).toEqual(
            {
                value: value2,
                done: true,
            }
        );
    });
    it("should call the function with the chain, branches, and this", () => {
        const iterator = createFromSyncMethod(value, fn, input, []);
        iterator.next({});
        expect(fn).toHaveBeenCalledWith(
            iterator.chain,
            iterator.branches,
            iterator
        );
    });
    it("should next the branches with the chain if the value is not undefined", () => {
        const iterator = createFromSyncMethod(value, fn, input, []);
        iterator.next({});
        expect(iterator.branches[0].next).toHaveBeenCalledWith(iterator.chain);
    });
});
