import { createUnitTree } from "../api/create/createUnitTree";
import { chainLength } from "../api/helpers/DynamicPrototype";
import { AsyncUnitMethod, UnitScope } from "../model/api.model";
const Parent: AsyncUnitMethod<UnitScope, UnitScope> = async (
    props,
    branches
) => {
    //this is getting called twice.
    console.log(props.year);
    return {
        name: props?.prop + " hello",
        [props.prop2]: 99,
    };
};

const Child = function* (props, branches) {
    console.log(props.name);
    let result = yield { name: props.name + " cole" };
    console.log(result.prop2);
    return { name: "finished " + props.name };
};

const el = (
    <Parent prop="jamel" prop2="age">
        <Parent prop="jamel 2" prop2="year"></Parent>
    </Parent>
);

el.next({ prop: "breaking", prop2: "up" });
// el.branches[0].next({ prop: "breaking", morning: "brew" }); //?
// el.value.inherit.children.keys().next().value.click() //?
// let el2 = <el.next /> //valid!!
//how does this interface with html?
//html context where?

// el.next({ prop: 99 });
// el.next({ prop: 990 });
// el.next({ prop: 919 });
// el.next({ prop: 919 });

/**
 * <element>
 *      <onClick>{(event)=>{ ... }}</onClick>
 *      <onResize>{(event)=>{ ... }}</onResize>
 *      <child />
 * </element>
 */
