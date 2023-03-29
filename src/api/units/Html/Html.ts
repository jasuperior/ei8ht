import { MapLike } from "../../../model/domain.model";
import {
    AsyncUnitClass,
    AsyncUnitMethod,
    UnitClass,
    UnitScheme,
    UnitScope,
} from "../../../model/unit.model";
import { htmlEvents } from "./htmlEvents";
import { htmlTags } from "./htmlTags";

type HtmlTags = keyof HTMLElementTagNameMap;
type HtmlProps = {
    use: HtmlTags;
};
type HtmlOutput = MapLike<HtmlTags, UnitScheme> & {
    container: HTMLElement;
};

export const Html = (
    props: HtmlProps,
    branches: any[],
    self: AsyncUnitClass<HtmlProps, HtmlProps, any>
) => {
    const root = document.createElement(props.use);
    root.id = "root";
    const children = new Map();
    htmlEvents.forEach((event) => {
        root.addEventListener(event, (e) => {
            const child = ((e as CustomEvent).detail?.target ||
                e.target) as HTMLElement;
            const unit = children.get(child);
            const eventType = e.type[0].toUpperCase() + e.type.slice(1);
            // console.log("container", eventType, child.id);
            unit?.next?.({ type: "event", event: eventType, payload: e });
        });
    });
    return {
        container: root,
        get(key) {
            if (typeof key == "string" && htmlTags.has(key))
                return function* (
                    props: UnitScope,
                    branches: any[],
                    self: UnitClass
                ) {
                    const child = document.createElement(key);
                    child.id = props.id;
                    let output: any = {
                        container: child,
                        trigger: (event: string, payload: any = null) => {
                            child.dispatchEvent(
                                new CustomEvent(event, {
                                    detail: payload,
                                    bubbles: true,
                                })
                            );
                        },
                    };
                    children.set(child, self);
                    props.container.appendChild(child);
                    while (true) {
                        const frame = (yield output) as unknown as UnitScope;
                        if (frame.type === "event") {
                            // console.log("child", frame.event, props.id);
                            props[`on${frame.event}`]?.(frame.payload, child);
                        }
                        output = undefined;
                    }
                };
        },
        set(key, value) {},
    } as HtmlOutput;
};
