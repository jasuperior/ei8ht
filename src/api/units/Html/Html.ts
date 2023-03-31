import { MapLike, Scope, KeyedScope } from "../../../model/domain.model";
import {
    ParentScope,
    SyncUnit,
    Unit,
    UnitClass,
    UnitScope,
} from "../../../model/unit.model";
import {
    convertCSSToPx,
    convertHtmlProp,
    getIndex,
    hasId,
    isPlacement,
} from "./helpers";
import { htmlEventHandlers, htmlEvents } from "./htmlEvents";
import { htmlTags } from "./htmlTags";

// ------------------ Html Types ------------------
type HtmlTags = keyof HTMLElementTagNameMap;
type HtmlInput = KeyedScope<
    (
        | {
              use: HtmlTags;
              id?: string | number;
              place?: never;
          }
        | {
              use?: never;
              place: string;
          }
    ) & {
        event?: string;
    }
>;
interface IHtmlOutput extends JSX.UnitElement {
    root: HTMLElement;
    container: HTMLElement;
    children: Map<HTMLElement, Unit>;
    child: Map<string, Unit<HtmlOutput, HtmlOutput, HtmlOutput>>;
    remove: (id: Unit | string) => boolean;
    trigger: (event: string, payload?: any) => void;
    restyle: (
        style: Partial<JSX.CSSProperties<string | number, number>>
    ) => void;
    change: (props: Partial<JSX.UnitElement>) => void;
    ignore: Set<string>;
    id: string;
    type?: string;
    payload?: any;
}
export type HtmlOutput = IHtmlOutput &
    MapLike<HtmlTags, Unit<Scope, Scope, IHtmlOutput>>;
type HtmlProps = UnitScope<HtmlInput, HtmlInput, HtmlOutput>;

const resolveSelector = (
    children: Map<string, Unit>,
    selector: Unit<any> | string
): [unit: Unit | undefined, id: string] => {
    let unit: Unit | undefined;
    let id: string;
    switch (typeof selector) {
        case "string":
            id = selector;
            unit = children.get(selector);
            break;
        case "object":
            unit = selector;
            id = unit.scope.id;
            break;
    }
    return [unit, id];
};

// ------------------ Html Element Unit ------------------
const createElement = function* (
    props: HtmlProps,
    branches: any[],
    self: UnitClass
) {
    const child = document.createElement(props.tag!);
    child.id = props.id;
    let output: Scope | undefined = {
        container: child,
    };
    if (props.id) {
        props.child.set(props.id, self);
    }
    if (props.style) {
        props.restyle.call(output, props.style);
    }
    props.children.set(child, self);
    props.container.appendChild(child);
    while (true) {
        const frame = (yield output) as unknown as HtmlProps;
        if (frame.type === "event") {
            // console.log("child", frame.event, props.id);
            props[`on${frame.event!}` as keyof HtmlOutput]?.(
                frame.payload,
                child
            );
        }
        if (frame.type === "update") {
            props.onUpdate?.(frame.payload, self);
        }
        output = undefined;
    }
};

// ------------------ Html Unit ------------------
/**
 * @description
 * Html is a unit that can be used to create a context for html elements.
 * @param props - The props of the unit.
 * @param branches - The branches of the unit.
 * @param self - The unit itself.
 * @returns
 * @example
 * <Html use="div" id="some-div">
 * <Html place="#some-id">
 * <Html use="main">
 *      <div id="some-div"></div>
 * </Html>
 */
export const Html = (
    props: HtmlInput,
    branches: SyncUnit<{ id: string }>[],
    self: SyncUnit<HtmlInput, HtmlInput, HtmlOutput>
) => {
    const root = isPlacement(props)
        ? document.querySelector(props.place)!
        : document.createElement(props.use);
    root.id = `root-${getIndex()}${hasId(props) ? ` ${props.id}` : ""}`;
    const children = new Map();
    const child = new Map();
    htmlEvents.forEach((event) => {
        root.addEventListener(event, (e) => {
            const child = ((e as CustomEvent).detail?.target ||
                e.target) as HTMLElement;
            const unit = children.get(child);
            const type = "event";
            const eventType = e.type[0].toUpperCase() + e.type.slice(1);
            // console.log("container", eventType, child.id);
            unit?.next?.({ type, event: eventType, payload: e });
        });
    });
    return {
        root,
        container: root,
        children,
        child,
        remove(selector?: Unit | string) {
            let element: any, id: string;
            if (selector) {
                let [unit, newId] = resolveSelector(child, selector);
                id = newId;
                element = unit?.scope.container;
                unit?.scope.trigger("remove");
            } else {
                element = this.container;
                id = this.id;
                this.trigger("remove");
            }
            if (element) {
                children.delete(element);
                child.delete(id);
                element.remove();
                return true;
            }
            return false;
        },
        trigger(event: string, payload?: any) {
            this.container.dispatchEvent(
                new CustomEvent(event, {
                    detail: payload,
                    bubbles: true,
                })
            );
        },
        change(props: Partial<JSX.UnitElement>) {
            Object.entries(props).forEach(([key, value]) => {
                if (key == "style") {
                    this.restyle(value as any);
                } else {
                    this.container.setAttribute(
                        convertHtmlProp(key),
                        value as any
                    );
                }
            });
            this.children.get(this.container)?.next?.({
                type: "update",
                payload: new CustomEvent("update", {
                    detail: props,
                    bubbles: true,
                }),
            });
        },
        restyle(style: Partial<JSX.CSSProperties<string | number, number>>) {
            Object.entries(style).forEach(([key, value]) => {
                this.container.style.setProperty(
                    convertHtmlProp(key),
                    convertCSSToPx(value)
                );
            });
        },
        get(key) {
            if (typeof key == "string" && htmlTags.has(key))
                return createElement;
        },
        set(key, value) {},
        ignore: new Set(["id", "style", ...htmlEventHandlers]),
    } as HtmlOutput;
};

export type HtmlUnit = Unit.Eager<HtmlInput, HtmlInput, HtmlOutput>;
export type HtmlChildUnit<
    I extends Scope = any,
    C extends Scope = I
> = Unit.Eager<Partial<ParentScope.Of<HtmlUnit>>, I, C>;

export namespace Html {
    export type Unit = HtmlUnit;
    export type Child<
        I extends Scope = any,
        C extends Scope = I
    > = HtmlChildUnit<I, C>;
    export type Children<
        I extends Scope = any,
        C extends Scope = I
    > = HtmlChildUnit<I, C>[];
}
