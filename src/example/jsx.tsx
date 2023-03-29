import { createUnit } from "../api/factories/createUnit";
import { Html } from "../api/units/Html/Html";
import { AsyncUnit, SyncUnitProcedure } from "../model/unit.model";

let count = 0;
const unit: AsyncUnit = (
    <Html use="main">
        <div
            id="parent"
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
                onBlur={() => {
                    console.log("blur");
                }}
            />
        </div>
        <input
            id="input"
            onFocus={() => {
                console.log("focus");
            }}
        />
    </Html>
);

setImmediate(() => {
    unit.scope.container.outerHTML; //?
    unit.branches[0].branches[0].scope.trigger("click", {
        target: unit.branches[0].scope.container,
    });
    // unit.branches[0].branches[0].scope.trigger("click");
    // unit.scope.container.outerHTML; //?
    // unit.branches[0].branches[0].scope.chain; //?
    unit.future; //?
    unit.state; //?
});
