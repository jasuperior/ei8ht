import { createUnit } from "../api/factories/createUnit";
import { Html } from "../api/units/Html/Html";
import { AsyncUnit, SyncUnitProcedure } from "../model/unit.model";

const Example = async (
    initial: { age: string },
    branches: string[],
    self: any
) => {
    // console.log("Example", initial, branches, self);
    await new Promise((resolve) => setTimeout(resolve, 0));
    return new Map([
        [
            "name",
            () => {
                console.log("Example Branch");
            },
        ],
        [
            "div",
            () => {
                console.log("Example Branch");
            },
        ],
    ]);
};
const ExampleGen: SyncUnitProcedure = function* (
    initial: any,
    branches: any,
    self: any
) {
    // console.log("ExampleGen", initial, branches, self);

    let result = yield { name: "Example Yielded" };
    // console.log(branches[1]);
    return {
        name2: result.something,
    };
};
const unit: AsyncUnit = (
    <Html root="main">
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
                onClick={() => {
                    console.log("click");
                }}
                onBlur={() => {
                    console.log("blur");
                }}
            />
        </div>
        <input
            onFocus={() => {
                console.log("focus");
            }}
        />
    </Html>
);

setImmediate(() => {
    // unit.branches[0].scope.container.dispatchEvent(new Event("click"));
    // unit.branches[0].scope.container.dispatchEvent(
    //     new CustomEvent("blur", { bubbles: true, cancelable: false })
    // );
    // unit.branches[0].scope.container.dispatchEvent(
    //         new CustomEvent("blur", { bubbles: true, cancelable: false })
    //     ); //?
    unit.branches[0].branches[0].scope.trigger("click");
    unit.branches[0].branches[0].scope.chain; //?
    unit.future; //?
    unit.state; //?
});
