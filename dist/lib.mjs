var UnitType = /* @__PURE__ */ ((UnitType2) => {
  UnitType2["SYNC"] = "sync";
  UnitType2["ASYNC"] = "async";
  return UnitType2;
})(UnitType || {});
var UnitState = /* @__PURE__ */ ((UnitState2) => {
  UnitState2["PENDING"] = "pending";
  UnitState2["RESOLVED"] = "resolved";
  UnitState2["REJECTED"] = "rejected";
  return UnitState2;
})(UnitState || {});
var UnitKind = /* @__PURE__ */ ((UnitKind2) => {
  UnitKind2["PURE"] = "pure";
  UnitKind2["PROCEDURAL"] = "procedural";
  return UnitKind2;
})(UnitKind || {});

const isSync = (fn) => {
  return fn.constructor.name === "Function";
};
const isAsync = (fn) => {
  return fn.constructor.name === "AsyncFunction";
};
const isGenerator = (fn) => {
  return fn.constructor.name === "GeneratorFunction";
};
const isAsyncGenerator = (fn) => {
  return fn.constructor.name === "AsyncGeneratorFunction";
};
const isPromise = (fn) => {
  return fn.constructor.name === "Promise";
};
const isMap = (map) => {
  return typeof map?.get === "function" && typeof map?.set === "function";
};

const mapMethods = /* @__PURE__ */ new Set(["get", "set", "has", "delete", "clear", "forEach"]);
class Polytype {
  chain = new Array(3);
  constructor(identity, before, after) {
    this.chain[0] = before || null;
    this.chain[1] = identity;
    this.chain[2] = after || null;
    return new Proxy(this, {
      get(target, prop) {
        let value = Polytype.getValue(target, prop);
        if (value)
          return value;
        for (let i = 2; i > -1; i--) {
          let obj = target.chain[i];
          value = Polytype.getValue(obj, prop, i);
          if (value)
            return value;
        }
      }
    });
  }
  _set(obj) {
    if (obj) {
      this.chain[1] = obj;
    }
  }
  _extend(obj) {
    if (obj) {
      this.chain[0] = obj;
    }
  }
  _define(obj) {
    if (obj) {
      this.chain[2] = obj;
    }
  }
  *[Symbol.iterator]() {
    for (let obj of this.chain) {
      yield obj;
    }
  }
  static getValue(target, prop, idx = -1) {
    let value;
    if (idx == 0 && target?.ignore && target.ignore.has(prop)) {
      return void 0;
    } else if (!Polytype.isPolytype(target) && !mapMethods.has(prop) && isMap(target)) {
      value = Reflect.get(target, prop) || target.get(prop);
    } else {
      value = Reflect.get(target || {}, prop);
    }
    return value;
  }
  static isPolytype(obj) {
    return obj instanceof Polytype;
  }
}
const polytype = (base, prev, next) => {
  return new Polytype(base, prev, next);
};

const toFrame = (value, done) => {
  return { value, done };
};
const toCompleteFrame = (value) => {
  return toFrame(value, true);
};

const fromAsyncMethod = (method, init, branches) => {
  const scope = polytype(init);
  const onComplete = (output) => {
    duration--;
    if (output !== void 0) {
      scope._define(output);
      branches.forEach((branch) => branch?.next?.(scope));
    }
    if (duration === 0)
      unit.future = void 0;
    return toCompleteFrame(output);
  };
  let duration = 0;
  const unit = {
    type: UnitType.ASYNC,
    kind: UnitKind.PURE,
    scope,
    branches,
    get state() {
      return duration === 0 ? UnitState.RESOLVED : UnitState.PENDING;
    },
    next: (input) => {
      duration++;
      scope._extend(input);
      if (unit.future) {
        unit.future = unit.future.then(
          () => method(
            scope,
            branches,
            unit
          )
        ).then(onComplete);
      } else {
        unit.future = method(
          scope,
          branches,
          unit
        ).then(onComplete);
      }
      return unit.future;
    }
  };
  duration++;
  unit.future = method(
    scope,
    branches,
    unit
  ).then(onComplete);
  return unit;
};

const fromAsyncProcedure = (procedure, init, branches) => {
  const scope = polytype(init);
  const onComplete = (output) => {
    duration--;
    if (output.value !== void 0) {
      scope._define(output.value);
      branches.forEach((branch) => branch?.next?.(scope));
    }
    if (duration === 0)
      unit.future = void 0;
    lastFrame = output;
    return lastFrame;
  };
  let duration = 0;
  const unit = {
    type: UnitType.ASYNC,
    kind: UnitKind.PROCEDURAL,
    scope,
    branches,
    get state() {
      return duration === 0 ? UnitState.RESOLVED : UnitState.PENDING;
    },
    next: (input) => {
      scope._extend(input);
      if (lastFrame.done) {
        generator = procedure(
          scope,
          branches,
          unit
        );
      }
      if (unit.future) {
        unit.future = unit.future.then(() => generator.next(scope)).then(onComplete);
      } else {
        unit.future = generator.next(scope).then(onComplete);
      }
      return unit.future;
    }
  };
  let generator = procedure(
    scope,
    branches,
    unit
  );
  let lastFrame = {
    value: void 0,
    done: false
  };
  unit.future = generator.next(scope).then(onComplete);
  return unit;
};

const fromSyncMethod = (method, init, branches) => {
  const scope = polytype(init);
  const onComplete = (output2) => {
    if (output2 !== void 0) {
      scope._define(output2);
      branches.forEach((branch) => branch?.next?.(scope));
    }
    return {
      value: output2,
      done: true
    };
  };
  const unit = {
    type: UnitType.SYNC,
    kind: UnitKind.PURE,
    scope,
    branches,
    next: (input) => {
      scope._extend(input);
      const output2 = method(scope, branches, unit);
      return onComplete(output2);
    }
  };
  const output = method(scope, branches, unit);
  onComplete(output);
  return unit;
};

const fromSyncProcedure = (procedure, init, branches) => {
  const scope = polytype(init);
  const onComplete = (output) => {
    if (output.value !== void 0) {
      scope._define(output.value);
      branches.forEach((branch) => branch?.next?.(scope));
    }
    lastFrame = output;
    return lastFrame;
  };
  const unit = {
    type: UnitType.SYNC,
    kind: UnitKind.PROCEDURAL,
    scope,
    branches,
    next: (input) => {
      scope._extend(input);
      if (lastFrame.done) {
        generator = procedure(
          scope,
          branches,
          unit
        );
      }
      const output = generator.next(scope);
      onComplete(output);
      return output;
    }
  };
  let generator = procedure(
    scope,
    branches,
    unit
  );
  let lastFrame = generator.next(scope);
  onComplete(lastFrame);
  return unit;
};

const fromKey = (key, init, branches) => {
  let scheme = () => {
  };
  const getScheme = (props) => {
    if (typeof props[key] === "function") {
      return props[key];
    }
    return scheme;
  };
  let procedure = function* (props, branches2, unit2) {
    props.tag = key;
    unit2 = createUnit(scheme, props, ...branches2);
    let [, init2, output] = unit2.scope;
    while (true) {
      const result = yield output;
      let currentScheme = getScheme(result);
      if (!Object.is(currentScheme, scheme)) {
        scheme = currentScheme;
        unit2 = createUnit(scheme, props, ...branches2);
      } else {
        unit2?.next(result);
      }
      output = unit2.scope.chain[2];
    }
  };
  return createUnit(procedure, init, ...branches);
};
const fromKeyAsync = (key, init, branches) => {
  let scheme = () => {
  };
  const getScheme = (props) => {
    if (typeof props[key] === "function") {
      return props[key];
    }
    return scheme;
  };
  let procedure = async function* (props, branches2, unit2) {
    unit2 = createUnit(scheme, props, ...branches2);
    await unit2.future;
    let [, init2, output] = unit2.scope;
    while (true) {
      const result = yield output;
      let currentScheme = getScheme(result);
      if (!Object.is(currentScheme, scheme)) {
        scheme = currentScheme;
        unit2 = createUnit(scheme, props, ...branches2);
        await unit2.future;
      } else {
        await unit2?.next(result);
      }
      output = unit2.scope.chain[2];
    }
  };
  return createUnit(procedure, init, ...branches);
};

const createUnit = (method, init, ...branches) => {
  if (typeof method !== "function") {
    if (init?.await) {
      return fromKeyAsync(method, init, branches);
    }
    return fromKey(method, init, branches);
  } else if (isAsyncGenerator(method)) {
    return fromAsyncProcedure(method, init, branches);
  } else if (isGenerator(method)) {
    return fromSyncProcedure(method, init, branches);
  } else if (isAsync(method)) {
    return fromAsyncMethod(method, init, branches);
  } else {
    return fromSyncMethod(
      method,
      init,
      branches
    );
  }
};

const NOOP = Symbol.for("NOOP");
const noop = NOOP;
const hasInstance = Symbol("hasInstance");

const isPlacement = (props) => {
  return props.place && typeof props.place === "string";
};
const hasId = (props) => {
  return props.id && typeof props.id === "string";
};
let index = 0;
const getIndex = () => {
  return index++;
};
const convertCSSToPx = (value) => {
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
};
const convertHtmlProp = (prop) => {
  if (prop == "className")
    return "class";
  return prop.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
};

const htmlEvents = [
  "click",
  "resize",
  "scroll",
  "contextmenu",
  "dblclick",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "wheel",
  "keydown",
  "keypress",
  "keyup",
  "abort",
  "afterprint",
  "beforeprint",
  "beforeunload",
  "error",
  "hashchange",
  "load",
  "pageshow",
  "pagehide",
  "popstate",
  "resize",
  "storage",
  "unload",
  "blur",
  "change",
  "focus",
  "focusin",
  "focusout",
  "input",
  "invalid",
  "reset",
  "search",
  "select",
  "submit",
  "drag",
  "dragend",
  "dragenter",
  "dragleave",
  "dragover",
  "dragstart",
  "drop",
  "copy",
  "cut",
  "paste",
  "abort",
  "canplay",
  "canplaythrough",
  "durationchange",
  "emptied",
  "ended",
  "error",
  "loadeddata",
  "loadedmetadata",
  "loadstart",
  "pause",
  "play",
  "playing",
  "progress",
  "ratechange",
  "seeked",
  "seeking",
  "stalled",
  "suspend",
  "timeupdate",
  "volumechange",
  "waiting",
  "show",
  "toggle",
  "wheel",
  "load",
  "error",
  "abort"
];
const htmlEventHandlers = htmlEvents.map(
  (event) => `on${event[0].toUpperCase()}${event.slice(1)}`
);

class CaseInsensitiveSet extends Set {
  constructor(values) {
    super(Array.from(values, (it) => it.toLowerCase()));
  }
  add(str) {
    return super.add(str.toLowerCase());
  }
  has(str) {
    return super.has(str.toLowerCase());
  }
  delete(str) {
    return super.delete(str.toLowerCase());
  }
}
const htmlTags = new CaseInsensitiveSet(
  `a,abbr,acronym,abbr,address,applet,embed,object,area,article
,aside,audio,b,base,basefont,bdi,bdo,big,blockquote,body,br,button,canvas,caption,center,cite
,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,dir,ul,div,dl,dt,em,embed,fieldset
,figcaption,figure,font,footer,form,frame,frameset,h1 to <h6>,head,header,hr,html,i,iframe,img
,input,ins,kbd,label,legend,li,link,main,map,mark,meta,meter,nav,noframes,noscript,object,ol
,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select
,small,source,span,strike,del,s,strong,style,sub,summary,sup,svg,table,tbody,td,template,textarea
,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr`.split(",")
);

const resolveSelector = (children, selector) => {
  let unit;
  let id;
  switch (typeof selector) {
    case "string":
      id = selector;
      unit = children.get(selector);
      break;
    case "object":
      unit = selector;
      id = unit.scope.id;
      break;
  }
  return [unit, id];
};
const createElement = function* (props, branches, self) {
  const child = document.createElement(props.tag);
  child.id = props.id;
  let output = {
    container: child
  };
  if (props.id) {
    props.child.set(props.id, self);
  }
  if (props.style) {
    props.restyle.call(output, props.style);
  }
  props.children.set(child, self);
  props.container.appendChild(child);
  while (true) {
    const frame = yield output;
    if (frame.type === "event") {
      props[`on${frame.event}`]?.(frame.payload, child);
    }
    if (frame.type === "update") {
      props.onUpdate?.(frame.payload, child);
    }
    output = void 0;
  }
};
const Html = (props, branches, self) => {
  const root = isPlacement(props) ? document.querySelector(props.place) : document.createElement(props.use);
  root.id = `root-${getIndex()}${hasId(props) ? ` ${props.id}` : ""}`;
  const children = /* @__PURE__ */ new Map();
  const child = /* @__PURE__ */ new Map();
  htmlEvents.forEach((event) => {
    root.addEventListener(event, (e) => {
      const child2 = e.detail?.target || e.target;
      const unit = children.get(child2);
      const type = "event";
      const eventType = e.type[0].toUpperCase() + e.type.slice(1);
      unit?.next?.({ type, event: eventType, payload: e });
    });
  });
  return {
    root,
    container: root,
    children,
    child,
    remove(selector) {
      let element, id;
      if (selector) {
        let [unit, newId] = resolveSelector(child, selector);
        id = newId;
        element = unit?.scope.container;
        unit?.scope.trigger("remove");
      } else {
        element = this.container;
        id = this.id;
        this.trigger("remove");
      }
      if (element) {
        children.delete(element);
        child.delete(id);
        element.remove();
        return true;
      }
      return false;
    },
    trigger(event, payload) {
      this.container.dispatchEvent(
        new CustomEvent(event, {
          detail: payload,
          bubbles: true
        })
      );
    },
    change(props2) {
      Object.entries(props2).forEach(([key, value]) => {
        if (key == "style") {
          this.restyle(value);
        } else {
          this.container.setAttribute(
            convertHtmlProp(key),
            value
          );
        }
      });
      this.children.get(this.container)?.next?.({
        type: "update",
        payload: new CustomEvent("update", {
          detail: props2,
          bubbles: true
        })
      });
    },
    restyle(style) {
      Object.entries(style).forEach(([key, value]) => {
        this.container.style.setProperty(
          convertHtmlProp(key),
          convertCSSToPx(value)
        );
      });
    },
    get(key) {
      if (typeof key == "string" && htmlTags.has(key))
        return createElement;
    },
    set(key, value) {
    },
    ignore: /* @__PURE__ */ new Set(["id", "style", ...htmlEventHandlers])
  };
};

export { Html, NOOP, Polytype, createUnit, fromAsyncMethod, fromAsyncProcedure, fromKey, fromKeyAsync, fromSyncMethod, fromSyncProcedure, hasInstance, isAsync, isAsyncGenerator, isGenerator, isMap, isPromise, isSync, noop, polytype, toCompleteFrame, toFrame };
//# sourceMappingURL=lib.mjs.map
