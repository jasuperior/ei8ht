export const isPromise = <T extends PromiseLike<any>>(value: T): boolean => {
    return typeof value?.then == "function";
};

export const isGenerator = <T extends Iterator<any> | AsyncIterator<any>>(
    value: T
): boolean => {
    return typeof value?.next == "function";
};

export const isUndefined = (value: any) => {
    return value === undefined || value === null;
};

export const isAsyncGenerator = <T extends AsyncGenerator<any>>(
    value: T
): boolean => {
    return isGenerator(value) && !!value[Symbol.asyncIterator];
};
