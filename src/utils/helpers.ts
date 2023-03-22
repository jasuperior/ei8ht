export const isPromise = <T extends PromiseLike<any>>(value: T): boolean => {
    return typeof value.then == "function";
};

export const isGenerator = <T extends Generator<any>>(value: T): boolean => {
    return typeof value.next == "function";
};
