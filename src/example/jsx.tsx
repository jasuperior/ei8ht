import { createUnit } from "../api/factories/createUnit";
import { from } from "../api/hooks/from";
import { Html, HtmlChildUnit, HtmlUnit } from "../api/units/Html/Html";

import { Work, Unit, UnitKind, Branch } from "../model/unit.model";

let count = 0;
const Example: Work.Of<Html.Child<{ name: string }, { component?: any }>> =
    function* (_, branches) {
        const component = (
            <div
                id="example"
                onRemove={() => {
                    branches.splice(branches.indexOf(component), 1);
                }}
                onUpdate={(payload, unit) => {
                    console.log("update", payload.detail);
                }}
            >
                Example
            </div>
        );
        branches.push(component);
        yield;
        return {
            component,
        };
    };

const unit: HtmlUnit = (
    <Html use="main" id="something">
        <div
            id="parent"
            style={{ width: 100, height: 100 }}
            onClick={() => {
                console.log("click");
            }}
            onBlur={() => {
                console.log("blur");
            }}
        >
            <div
                id="test"
                onClick={(e) => {
                    count++;
                    e.target.innerHTML = `count ${count}`; //?
                }}
            >
                <div id="child" />
            </div>
        </div>
        <input
            id="input"
            onFocus={() => {
                console.log("focus");
            }}
        />
        <Example name="string" />
    </Html>
);

let { child, container, remove, [0]: first } = from(unit);
const example = from(child.get("example")!);
container.outerHTML; //?
example.change({
    style: { width: 200, height: 200, borderRadius: 38 },
    className: "test",
});
container.outerHTML; //?
child.get("parent")!.scope.trigger("click", {}); //?

// let unit2: Unit.Of<typeof Example> = <Example component="test" other="sdfs" />;
// let unit3: Unit;
// let u: Work.Of<typeof unit>;
// let w: Unit.Of<typeof Example>;
// let pro: Unit.Type;
let b: Work.Of<HtmlUnit>;
