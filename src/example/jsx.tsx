import { createUnit } from "../api/factories/createUnit";
import { Html } from "../api/units/Html/Html";
import { Scope } from "../model/domain.model";
import {
    AsyncUnit,
    AsyncUnitClass,
    SyncUnitProcedure,
} from "../model/unit.model";

let count = 0;
const unit: AsyncUnit<Scope, { container: JSX.UnitElement }> = (
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

unit.scope.container.outerHTML; //?
unit.branches[0].branches[0].scope.trigger("click", {
    target: unit.branches[0].scope.container,
});
