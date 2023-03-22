import { createTree } from "../api/index";
import { Html } from "./html";

const Parent = (props, branches) => {
    //this is getting called twice.
    console.log(props?.inherit);
    return {
        name: props?.prop + " hello",
    };
};

const Child = function* (props, branches) {
    let [result, children] = yield { name: props.name + " cole" };
    console.log(result);
    yield { name: "dion" };
    console.log("called again");
    return { name: "finished" };
};
let el = (
    <Html>
        {/* <div hhello="something">
            <div name="something" style="width: 10px;">
                <div></div>
            </div>
        </div> */}
        <Parent>
            <main></main>
        </Parent>
        {/* <span></span> */}
    </Html>
);
el.value.body.innerHTML; //?
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
