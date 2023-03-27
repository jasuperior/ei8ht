import { createUnit } from "../api/factories/createUnit";
import { SyncUnitProcedure } from "../model/unit.model";

const Example = async (initial: any, branches: any, self: any) => {
    // console.log("Example", initial, branches, self);

    return new Map([["name", "Example"]]);
};
const ExampleGen: SyncUnitProcedure = function* (
    initial: any,
    branches: any,
    self: any
) {
    // console.log("ExampleGen", initial, branches, self);

    let result = yield { name: "Example Yielded" };
    console.log(result);
    return {
        name2: result.something,
    };
};
const unit = (
    <Example age="66">
        <ExampleGen someprop />
    </Example>
);
unit.future.then((result) => {
    // unit.next({ something: "Example Input" }).then((result) => {
    //     console.log(unit.branches[0].scope);
    // });
});
// console.log(unit.scope.something);
// unit.branches[0].scope._extend({ othername: "ExampleGen Input" });
