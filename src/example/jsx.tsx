import { createUnitTree } from "../api/create/createUnitTree";
import { chainLength } from "../api/helpers/DynamicPrototype";
import { AsyncUnitMethod, UnitScope } from "../model/api.model";
const Parent: AsyncUnitMethod<
    UnitScope,
    { prop: string; prop2: string }
> = async (props, branches) => {
    //this is getting called twice.
    console.log(props);
    return {
        name: props?.prop + " hello",
        [props.prop2]: 99,
    };
};

const Child = async function* (props, branches) {
    console.log(props.name);
    let result = yield { uuu: props.name + " cole" };
    console.log(result.name);
    return { name: "finished " + props.name };
};

const el = (
    <Parent prop="jamel" prop2="age">
        <Child prop="jamel 2" juju="year"></Child>
    </Parent>
);

el.next({ prop: "breaking", prop2: "up" });
// setTimeout(() => {
//     el; //?
// }, 1000);
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
