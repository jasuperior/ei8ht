import { createUnitTree } from "../api/create/createUnitTree";
import { chainLength } from "../api/helpers/DynamicPrototype";
import {
    AsyncUnitCategory,
    AsyncUnitGenerator,
    AsyncUnitMethod,
    SyncUnitGenerator,
    UnitIterator,
    UnitScope,
} from "../model/api.model";
import { Html } from "../api/units/Html.tsx";
const Parent: AsyncUnitMethod<
    { div: any },
    { prop: string; prop2: string }
> = async (props, branches) => {
    //this is getting called twice.

    return {
        div(props, branches, self) {
            console.log(props);
            return { ageh: 323 };
        },
    };
};

const Child = function* (props: { name: string }) {
    console.log(props.name);
    let result: typeof props = yield { name: props.name + " cole" };
    // console.log(result.prop);
    return { name: "finished " + props.name };
};

// const el = (
//     <Parent prop="jamel" prop2="age">
//         <div></div>
//         {/* <Child name="hello" /> */}
//     </Parent>
// );

// const el2 = createUnitTree(Child, { name: "jamel" }, <div></div>);

const el = (
    <Html container="div">
        <div
            onclick={(e) => {
                console.log("click", e);
            }}
        ></div>
    </Html>
);
// Html.toString() //?
setImmediate(() => {
    el.branches[0].output.parent.click();
});
// el.branches[0].next(new Event("click")); //?
// el.branches[0].next(new Event("click")); //?
/**
 * <element>
 *      <onClick>{(event)=>{ ... }}</onClick>
 *      <onResize>{(event)=>{ ... }}</onResize>
 *      <child />
 * </element>
 */
