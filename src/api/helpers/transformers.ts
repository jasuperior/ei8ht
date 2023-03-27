import { UnitFrame } from "../../model/unit.model";

export const toFrame = <T>(value: T, done: boolean): UnitFrame<T> => {
    return { value, done };
};

export const toCompleteFrame = <T>(value: T): UnitFrame<T> => {
    return toFrame(value, true);
};
