import { createTree } from "../api/index";
import { Html } from "./html";

const Parent = (props, branches) => {
    //this is getting called twice.
    console.log(props);
    return {
        name: props?.prop + " hello",
        age: 99,
    };
};

const Child = async function* (props, branches) {
    console.log(props);
    let result = yield { name: props.name + " cole" };
    console.log(result.age);
    return { name: "finished " + props.name };
};

const el = (
    <Parent prop="jamel">
        <Child name="something">
            <Child name="other" extra></Child>
            {/* {Child} */}
        </Child>
    </Parent>
);

el.init();
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
