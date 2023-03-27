import { createUnit } from "../api/factories/createUnit";

const Example = (initial: any, branches: any, self: any) => {
    // console.log("Example", initial, branches, self);

    return new Map([["name", "Example"]]);
};
const ExampleGen = function* (initial: any, branches: any, self: any) {
    // console.log("ExampleGen", initial, branches, self);

    let result = yield { name: "Example Yielded" };
    return {
        name2: result.something,
    };
};
const unit = (
    <Example age="66">
        <ExampleGen someprop />
    </Example>
);
unit.next({ something: "Example Input" });
// unit.branches[0].scope._extend({ othername: "ExampleGen Input" });
console.log(unit.branches[0].scope);
