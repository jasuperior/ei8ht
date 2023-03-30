import { Scope } from "../../../model/domain.model";

export const isPlacement = (props: any): props is { place: string } => {
    return props.place && typeof props.place === "string";
};
export const hasId = (props: any): props is { id: string } => {
    return props.id && typeof props.id === "string";
};

let index = 0;
export const getIndex = (): number => {
    return index++;
};

export const convertCSSToPx = (value: string | number): string => {
    if (typeof value === "number") {
        return `${value}px`;
    }
    return value;
};

export const convertHtmlProp = (prop: string): string => {
    if (prop == "className") return "class";
    return prop.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
};
