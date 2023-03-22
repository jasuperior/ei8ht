const validElements = new Set([
    "div",
    "span",
    "main",
    "b",
    "br",
    "table",
    "td",
    "tr",
    "th",
]);
const elementGetter = {
    parent: null,
    children: new Map(),
    get(tag: string) {
        if (validElements.has(tag)) {
            let element = document.createElement(tag);
            let applyProps = (props: any = {}) => {
                for (let [key, value] of Object.entries(props)) {
                    if (["inherit", "body"].includes(key)) continue;
                    element.setAttribute(key, value as string);
                }
            };
            let self = this;
            return function* (props, branches, state) {
                applyProps(props);
                // console.log(props.inherit.children);
                self.children.set(element, state);
                if (self.parent) {
                    self.parent?.appendChild?.(element);
                }
                while (true) {
                    let [newProps] = yield {};
                    applyProps(newProps || {});
                }
            };
        }
    },
};
export const Html = function* (props: any, branches: any[]) {
    let body = document.createElement("body");
    let inherit = Object.assign(Object.create(elementGetter), {
        parent: body,
    });
    body.addEventListener("click", (e) => {
        let element = inherit.children.get(e.target);
        //element.next(e)
        console.log(inherit.children.get(e.target));
    });
    yield { body, inherit };
};
