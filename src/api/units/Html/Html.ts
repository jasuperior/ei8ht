import { MapLike } from "../../../model/domain.model";
import {
    AsyncUnit,
    AsyncUnitMethod,
    Unit,
    UnitScheme,
    UnitScope,
} from "../../../model/unit.model";
import { htmlEvents } from "./htmlEvents";

type HtmlTags = keyof HTMLElementTagNameMap;
type HtmlProps = {
    root: HtmlTags;
};
type HtmlOutput = MapLike<HtmlTags, UnitScheme> & {
    container: HTMLElement;
};

export const Html: AsyncUnitMethod<HtmlProps, HtmlProps, HtmlOutput> = async (
    props: HtmlProps,
    branches: any[],
    self: AsyncUnit<HtmlProps, HtmlProps, any>
) => {
    const root = document.createElement(props.root);
    root.id = "root";
    const children = new Map();
    htmlEvents.forEach((event) => {
        root.addEventListener(event, (e) => {
            const child = e.target as HTMLElement;
            const unit = children.get(child);
            const eventType = e.type[0].toUpperCase() + e.type.slice(1);
            console.log("container", eventType, child.id);
            unit?.next?.({ type: "event", event: eventType, payload: e });
        });
    });
    return {
        container: root,
        get(key) {
            return function* (props: UnitScope, branches: any[], self: Unit) {
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
                root.appendChild(child);
                // props.container.appendChild(child);
                while (true) {
                    const frame = (yield output) as unknown as UnitScope;
                    // console.log(frame.type === "event", frame.chain);
                    if (frame.type === "event") {
                        console.log("child", frame.event, props.id);
                        props[`on${frame.event}`]?.(frame.payload);
                    }
                    output = undefined;
                }
            };
        },
        set(key, value) {},
    };
};
