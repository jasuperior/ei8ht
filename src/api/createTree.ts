//@ts-nocheck
import { Primitive, Unit, UnitIterator, UnitMethod } from "../model/api.model";
import { isPromise, isUndefined } from "../utils/helpers";
import { normalizeFn, normalizePrimitive } from "./normalize";

// export const createTree = (source: any, field: any, ...branches: any[]) => {
//     let builtin = {};
//     let root =
//         typeof source !== "function"
//             ? normalizePrimitive(source, field, branches)
//             : normalizeFn(source, field, branches);
//     branches = branches.map((branch) => {
//         if (branch?.next) {
//             branch.next(root.value);
//         } else {
//             //extra case for primitives
//             branch = normalizeFn(branch, root.value, branches);
//         }
//         //handle other types like primitives
//         return branch;
//     });
//     const updateBranches = (
//         frame: { value: any; done: boolean },
//         value: any
//     ) => {
//         if (!Object.is(frame.value, value)) {
//             branches.forEach((branch) => {
//                 branch.next(frame.value);
//             });
//         }
//     };
//     return {
//         get value() {
//             return this.root.value;
//         },
//         root,
//         branches,
//         next(field: any) {
//             let { value } = this.root;
//             // if(field && this.value?.inherit) {
//             //     field.inherit = Object.assign(field.inherit||{}, this.value.inherit);
//             // }
//             let frame = this.root.next(field);
//             if (field?.inherit && typeof frame.value == "object") {
//                 let proto = Object.create(field.inherit);
//                 frame.value.inherit = Object.assign(
//                     proto,
//                     frame.value.inherit || {}
//                 );
//             }
//             if (frame.then) {
//                 return frame.then((frame: { value: any; done: boolean }) => {
//                     updateBranches(frame, value);
//                     return frame;
//                 });
//             } else {
//                 updateBranches(frame, value);
//                 return frame;
//             }
//         },
//     };
// };

export const createTree = <T extends Record<any, any>, U>(
    source: UnitMethod<T, U> | Primitive,
    props: U = {},
    ...branches: (Unit<any, T> | Primitive | UnitMethod<T, U>)[]
): Unit<T, U> => {
    if (!props) props = {};
    let unit: Unit<T, U>;
    let root: typeof source extends Function
        ? UnitIterator<T, U>
        : UnitIterator<any, any> =
        typeof source == "function"
            ? normalizeFn(source, props, branches as Unit<any, T>[])
            : normalizePrimitive(source, props, branches);
    let hasParent = false;
    let nextBranch = (branch) => {
        branch.next(root.value);
        return branch;
    };
    const updateBranches = () => {
        if (isUndefined(root.value)) return;
        let newBranches = branches.map(nextBranch);
        return newBranches;
    };

    // if (root.future) {
    //     root.future.then(() => (unit.branches = updateBranches()));
    // } else {
    //     branches = updateBranches();
    // }
    // mapper = (branch) => {
    //     branch.next(root.value);
    //     return branch;
    // }; //swap mapper after initial run
    const resolveProto = (root, parent) => {
        if (root.parent)
            return Object.assign(
                Object.create(resolveProto(root.parent)),
                root.value
            );
        return root.value;
    };
    return (unit = {
        root,
        branches,
        next(props: U = {}) {
            let frame = root.next(props);
            if (isPromise(frame)) {
                return frame.then((frame) => {
                    updateBranches();
                });
            } else {
                updateBranches();
            }
        },
        init() {
            console.log("initializing", root.value);
            this.branches = branches = branches.map((branch) => {
                if (branch?.next) {
                    // root.parent = parent;
                    // branch.init(root);
                    // console.log(
                    //     "root parent",
                    //     root.value,
                    //     resolveProto(branch)
                    // );
                    branch.root.parent = root.parent
                        ? Object.assign(Object.create(root.parent), root.value)
                        : root.value;
                    branch.init();
                    console.log("after initial ", branch.root.parent);
                    nextBranch(branch);
                } else {
                    branch = normalizeFn(branch, root.value, branches);
                    branch.parent = root;
                }
                //handle other types like primitives
                return branch;
            });
        },
    });
};
