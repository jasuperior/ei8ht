```tsx
const Component = (props, branches, self) => {
    let { prop, prop2 } = props;
    return { newProp: !prop };
};
```

```tsx
<Component prop prop2 />
```

    - Denotes a single call to to the component function
    - Stops at the first return or yeild expression

```tsx
let Component2 = Component;
<Component prop prop2>
    <Component2 prop></Component2>
</Component>;
```

    - Will call component 2 once to initialize, then again to be passed the return of Component
    - On the second call, receives context from outer scope.
    - All child elements will have the two call signature on initalization
