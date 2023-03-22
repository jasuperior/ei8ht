import { normalizeFn, normalizePrimitive } from "./normalize";

export const createTree = (source: any, field: any, ...branches: any[]) => {
    let builtin = {};
    let root =
        typeof source !== "function"
            ? normalizePrimitive(source, field, branches)
            : normalizeFn(source, field, branches);
    branches = branches.map((branch) => {
        if (branch?.next) {
            branch.next(root.value);
        } else {
            //extra case for primitives
            branch = normalizeFn(branch, root.value, branches);
        }
        //handle other types like primitives
        return branch;
    });
    const updateBranches = (
        frame: { value: any; done: boolean },
        value: any
    ) => {
        if (!Object.is(frame.value, value)) {
            branches.forEach((branch) => {
                branch.next(frame.value);
            });
        }
    };
    return {
        get value() {
            return this.root.value;
        },
        root,
        branches,
        next(field: any) {
            let { value } = this.root;
            // if(field && this.value?.inherit) {
            //     field.inherit = Object.assign(field.inherit||{}, this.value.inherit);
            // }
            let frame = this.root.next(field);
            if (field?.inherit && typeof frame.value == "object") {
                let proto = Object.create(field.inherit);
                frame.value.inherit = Object.assign(
                    proto,
                    frame.value.inherit || {}
                );
            }
            if (frame.then) {
                return frame.then((frame: { value: any; done: boolean }) => {
                    updateBranches(frame, value);
                    return frame;
                });
            } else {
                updateBranches(frame, value);
                return frame;
            }
        },
    };
};
