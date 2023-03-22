//@ts-nocheck
import { Unit, UnitFrame, UnitIterator, UnitMethod } from "../model/api.model";
import { isGenerator, isPromise } from "../utils/helpers";
// export const normalizeFn = (fn: Function, props: any, branches: any[] = []) => {
//     let state: any = {};
//     let fnReturn = fn(props, branches, state);
//     let future: PromiseLike<any> | undefined;
//     if (!fnReturn?.next) {
//         if (fnReturn?.then) {
//             future = fnReturn.then((value: any) => {
//                 fnReturn.value = value;
//             });
//             state = Object.assign(state, {
//                 future,
//                 next(props: any = {}) {
//                     return fn(props, branches, state).then((value: any) => {
//                         state.value = value;
//                         return {
//                             value,
//                             done: true,
//                         };
//                     });
//                 },
//             });
//         } else {
//             state = Object.assign(state, {
//                 value: fnReturn,
//                 future,
//                 next(props: any = {}) {
//                     state.value = fn(props, branches, state);
//                     return {
//                         value: state.value,
//                         done: true,
//                     };
//                 },
//             });
//         }
//     } else {
//         let currentState = fnReturn;
//         let frame = fnReturn.next();

//         if (frame.then) {
//             let newFuture = frame.then(
//                 (newFrame: { value: any; done: boolean }) => {
//                     frame = newFrame;
//                     state.value = frame.value;
//                     if (future == newFuture) future = undefined;
//                     return frame;
//                 }
//             );
//             future = newFuture;
//             frame = {
//                 value: undefined,
//                 done: false,
//             };
//         }

//         state = Object.assign(state, {
//             value: frame.value,
//             future,
//             next(props: any = {}): any {
//                 if (future) {
//                     return (future = future.then(() => {
//                         return this.next(props);
//                     }));
//                 } else {
//                     if (frame.done) {
//                         currentState = fn(props, branches, state);
//                     }
//                     let value = currentState.next([props, branches, state]);
//                     if (value.then) {
//                         const newFuture = value.then(
//                             (nextFrame: { value: any; done: boolean }) => {
//                                 frame = nextFrame;
//                                 fnReturn.value = frame.value;
//                                 if (future == newFuture) future = undefined;
//                                 return frame;
//                             }
//                         );
//                         return (future = newFuture);
//                     } else {
//                         frame = value;
//                         fnReturn.value = frame.value;
//                     }
//                 }
//                 return frame;
//             },
//         });
//     }

//     state[Symbol.iterator] = function* () {
//         let value = fnReturn.next();
//         while (!value.done) {
//             yield value.value;
//             value = fnReturn.next(value.value); //wraps on itself
//         }
//         return value.value;
//     };

//     state[Symbol.asyncIterator] = async function* () {
//         let value = await fnReturn.next();
//         while (!value.done) {
//             yield value.value;
//             value = await fnReturn.next(value.value);
//         }
//         return value.value;
//     };
//     return state;
// };
export const normalizeFn = <T extends Record<any, any>, U>(
    fn: UnitMethod<T, U>,
    props: U,
    branches: Unit<any, T>[] = []
): UnitIterator<T, U> => {
    let state: UnitIterator<T, U> = {} as UnitIterator<T, U>;
    let result = fn(props, branches, state);
    let future: PromiseLike<UnitFrame<T>> | undefined;
    let frame: UnitFrame<T, U>;
    const makeSetValue = (getValue, getDone = () => true) => {
        return (value: T) => {
            state.value = getValue(value);
            return (frame = {
                value: getValue(value),
                done: getDone(value),
            });
        };
    };
    const setNextValue = (props: U = {}, setValue) => {
        return fn(props, branches, state).then(setValue);
    };
    switch (true) {
        case isGenerator(result): {
            frame = result.next();
            let currentState = state; //state resets when its done.
            const setValue = makeSetValue(
                getValue(
                    (value) => value.value,
                    (value) => value.done
                )
            );
            let next = (props: U) => {
                frame = currentState.next(props); //branches and state done change.
                setValue(frame);
            };
            if (isPromise(frame)) {
                future = frame.finally(setValue);
                //provide default frame since frame is being awaited.
                next = (props: U) => {
                    let nextValue = setNextValue.bind(null, props, setValue);
                    state.future = state.future.finally((newFrame) => {
                        if (frame.done) {
                            currentState = fn(props, branches, state);
                        }
                        return nextValue(newFrame);
                    });
                };
                frame = {
                    value: undefined,
                    done: false,
                };
            }

            state.next = next;
        }
        case isPromise(result): {
            const setValue = makeSetValue(
                getValue(
                    (value) => value,
                    (value) => true
                )
            );
            future = (result as PromiseLike<T>).finally(setValue);

            state.next = (props: U = {}) => {
                let nextValue = setNextValue.bind(null, props, setValue);
                return (state.future = state.future?.finally(nextValue));
            };
        }
        default: {
            state = Object.assign(state, {
                value: result,
                future,
                next:
                    state.next ||
                    ((props: U = {}) => {
                        state.value = fn(props, branches, state) as T;
                        return {
                            value: state.value,
                            done: true,
                        };
                    }),
            });
        }
    }

    return state;
};
export const normalizePrimitive = (
    primitive: any,
    props: any = {},
    branches: any[] = []
) => {
    let fn = () => {};
    const getInherited = (inherited: any = {}) => {
        switch (true) {
            case typeof inherited.get == "function": {
                return inherited.get(primitive) || fn;
            }
            default: {
                return inherited[primitive] || fn;
            }
        }
    };
    // let proto = Object.create(props);
    props = props || {};
    fn = getInherited(props?.inherit);
    let iterator = normalizeFn(fn, props, branches);
    return {
        value: iterator.value,
        future: iterator.future,
        next(newProps: any = {}) {
            let newFn = getInherited(newProps?.inherit);
            let frame = { value: undefined, done: false };
            if (!Object.is(fn, newFn)) {
                fn = newFn;
                iterator = normalizeFn(
                    fn,
                    Object.assign(props, newProps), //should it be assigned?
                    branches
                );
                frame.value = iterator.value;
                frame.done = iterator.done;
            } else {
                frame = iterator.next(Object.assign(props, newProps));
            }
            this.value = frame.value;
            this.future = iterator.future;
            return frame;
        },
    };
};
