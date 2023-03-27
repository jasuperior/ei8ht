import { AsyncFunction, MapLike, SyncFunction } from "../../model/domain.model";
import { AsyncUnitProcedure } from "../../model/unit.model";

export const isSync = (fn: Function): fn is SyncFunction => {
    return fn.constructor.name === "Function";
};
export const isAsync = (fn: Function): fn is AsyncFunction => {
    return fn.constructor.name === "AsyncFunction";
};
export const isGenerator = (fn: Function): fn is GeneratorFunction => {
    return fn.constructor.name === "GeneratorFunction";
};
export const isAsyncGenerator = (
    fn: Function
): fn is AsyncUnitProcedure<any, any, any> => {
    return fn.constructor.name === "AsyncGeneratorFunction";
};
export const isPromise = (fn: any): fn is Promise<any> => {
    return fn.constructor.name === "Promise";
};
export const isMap = (map: any): map is MapLike<any, any> => {
    return typeof map?.get === "function" && typeof map?.set === "function";
};
