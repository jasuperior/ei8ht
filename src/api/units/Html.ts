import {
    AsyncUnitMethod,
    SyncUnitCategory,
    SyncUnitMethod,
    Unit,
    UnitScope,
} from "../../model/api.model";
import { getValue } from "../helpers/DynamicPrototype";
import { htmlEvents } from "./htmlEvents";

type HtmlElementUnit<T extends keyof HTMLElementTagNameMap> = SyncUnitCategory<
    { parent: HTMLElementTagNameMap[T] },
    any
>;
type HtmlInput = {
    container: keyof HTMLElementTagNameMap;
};
type HtmlOutput = { parent: HTMLElement } & {
    [key in keyof HTMLElementTagNameMap]?: HtmlElementUnit<key>;
};
const applyStyles = (element: HTMLElement, styles: any) => {};
const applyAttributes = (element: HTMLElement, attrs: any) => {};
export const Html: AsyncUnitMethod<HtmlOutput, HtmlInput> = async ({
    container,
}) => {
    const root = document.createElement(container);
    const children = new Map<HTMLElement, Unit<any, any, any>>();
    //delegate events to children
    htmlEvents.forEach((event) => {
        root.addEventListener(event, (e) => {
            console.log("event fired", e);
            const target = e.target as HTMLElement;
            const child = children.get(target);
            if (child) {
                child.next(e);
            }
        });
    });
    return {
        parent: root,
        *div(props, branches, self) {
            // console.log("props", props.onclick);
            const div = document.createElement("div");
            //check if props has onEvent
            //check if props has style
            //the rest of props are attributes
            let context: any = { parent: div };
            props.parent.appendChild(div);
            children.set(div, self as unknown as Unit<any, any, any>);
            while (true) {
                const update: UnitScope = yield context;
                if (update) {
                    if (update.type && htmlEvents.includes(update.type)) {
                        //if update is Event, then fire onEvent with event
                        // console.log("event", update);
                        const { type } = update;
                        //@ts-ignore
                        const event = update[getValue](1);
                        const onEvent = props[`on${type}`];
                        if (onEvent) {
                            onEvent(event);
                        }
                    } else {
                        //if update has style, then apply style
                        //if update has attributes, then apply attribute
                        let { style } = update;
                        if (update.style) {
                            applyStyles(div, style);
                        }
                        delete update.style;
                        applyAttributes(div, update);
                    }
                }
                // context = undefined;
            }
            return context;
        },
    };
};
