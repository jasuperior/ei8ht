declare namespace JSX {
    declare type CSSProperties<L, T> = import("csstype").Properties<L, T>;
    declare type Unit<T = any> = import("./model").Unit<T>;

    type TagNames = keyof HTMLElementTagNameMap;
    type IntrinsicElements = {
        [element in TagNames]: UnitElement;
    };

    /**
     * Copied from https://github.com/Pathgather/jsx-render-dom
     **/

    interface UnitElementEvents {
        // Clipboard Events
        onCopy?: ClipboardEventHandler;
        onCopyCapture?: ClipboardEventHandler;
        onCut?: ClipboardEventHandler;
        onCutCapture?: ClipboardEventHandler;
        onPaste?: ClipboardEventHandler;
        onPasteCapture?: ClipboardEventHandler;

        // Composition Events
        onCompositionEnd?: CompositionEventHandler;
        onCompositionEndCapture?: CompositionEventHandler;
        onCompositionStart?: CompositionEventHandler;
        onCompositionStartCapture?: CompositionEventHandler;
        onCompositionUpdate?: CompositionEventHandler;
        onCompositionUpdateCapture?: CompositionEventHandler;

        // Focus Events
        onFocus?: FocusEventHandler;
        onFocusCapture?: FocusEventHandler;
        onBlur?: FocusEventHandler;
        onBlurCapture?: FocusEventHandler;

        // Form Events
        onChange?: FormEventHandler;
        onChangeCapture?: FormEventHandler;
        onInput?: FormEventHandler;
        onInputCapture?: FormEventHandler;
        onReset?: FormEventHandler;
        onResetCapture?: FormEventHandler;
        onSubmit?: FormEventHandler;
        onSubmitCapture?: FormEventHandler;

        // Image Events
        onLoad?: EventHandler<Event>;
        onLoadCapture?: EventHandler<Event>;
        onError?: EventHandler<Event>;
        onErrorCapture?: EventHandler<Event>;

        // Keyboard Events
        onKeyDown?: KeyboardEventHandler;
        onKeyDownCapture?: KeyboardEventHandler;
        onKeyPress?: KeyboardEventHandler;
        onKeyPressCapture?: KeyboardEventHandler;
        onKeyUp?: KeyboardEventHandler;
        onKeyUpCapture?: KeyboardEventHandler;

        // Media Events
        onAbort?: EventHandler<Event>;
        onAbortCapture?: EventHandler<Event>;
        onCanPlay?: EventHandler<Event>;
        onCanPlayCapture?: EventHandler<Event>;
        onCanPlayThrough?: EventHandler<Event>;
        onCanPlayThroughCapture?: EventHandler<Event>;
        onDurationChange?: EventHandler<Event>;
        onDurationChangeCapture?: EventHandler<Event>;
        onEmptied?: EventHandler<Event>;
        onEmptiedCapture?: EventHandler<Event>;
        onEncrypted?: EventHandler<Event>;
        onEncryptedCapture?: EventHandler<Event>;
        onEnded?: EventHandler<Event>;
        onEndedCapture?: EventHandler<Event>;
        onLoadedData?: EventHandler<Event>;
        onLoadedDataCapture?: EventHandler<Event>;
        onLoadedMetadata?: EventHandler<Event>;
        onLoadedMetadataCapture?: EventHandler<Event>;
        onLoadStart?: EventHandler<Event>;
        onLoadStartCapture?: EventHandler<Event>;
        onPause?: EventHandler<Event>;
        onPauseCapture?: EventHandler<Event>;
        onPlay?: EventHandler<Event>;
        onPlayCapture?: EventHandler<Event>;
        onPlaying?: EventHandler<Event>;
        onPlayingCapture?: EventHandler<Event>;
        onProgress?: EventHandler<Event>;
        onProgressCapture?: EventHandler<Event>;
        onRateChange?: EventHandler<Event>;
        onRateChangeCapture?: EventHandler<Event>;
        onSeeked?: EventHandler<Event>;
        onSeekedCapture?: EventHandler<Event>;
        onSeeking?: EventHandler<Event>;
        onSeekingCapture?: EventHandler<Event>;
        onStalled?: EventHandler<Event>;
        onStalledCapture?: EventHandler<Event>;
        onSuspend?: EventHandler<Event>;
        onSuspendCapture?: EventHandler<Event>;
        onTimeUpdate?: EventHandler<Event>;
        onTimeUpdateCapture?: EventHandler<Event>;
        onVolumeChange?: EventHandler<Event>;
        onVolumeChangeCapture?: EventHandler<Event>;
        onWaiting?: EventHandler<Event>;
        onWaitingCapture?: EventHandler<Event>;

        // MouseEvents
        onClick?: MouseEventHandler;
        onClickCapture?: MouseEventHandler;
        onContextMenu?: MouseEventHandler;
        onContextMenuCapture?: MouseEventHandler;
        onDoubleClick?: MouseEventHandler;
        onDoubleClickCapture?: MouseEventHandler;
        onDrag?: DragEventHandler;
        onDragCapture?: DragEventHandler;
        onDragEnd?: DragEventHandler;
        onDragEndCapture?: DragEventHandler;
        onDragEnter?: DragEventHandler;
        onDragEnterCapture?: DragEventHandler;
        onDragExit?: DragEventHandler;
        onDragExitCapture?: DragEventHandler;
        onDragLeave?: DragEventHandler;
        onDragLeaveCapture?: DragEventHandler;
        onDragOver?: DragEventHandler;
        onDragOverCapture?: DragEventHandler;
        onDragStart?: DragEventHandler;
        onDragStartCapture?: DragEventHandler;
        onDrop?: DragEventHandler;
        onDropCapture?: DragEventHandler;
        onMouseDown?: MouseEventHandler;
        onMouseDownCapture?: MouseEventHandler;
        onMouseEnter?: MouseEventHandler;
        onMouseLeave?: MouseEventHandler;
        onMouseMove?: MouseEventHandler;
        onMouseMoveCapture?: MouseEventHandler;
        onMouseOut?: MouseEventHandler;
        onMouseOutCapture?: MouseEventHandler;
        onMouseOver?: MouseEventHandler;
        onMouseOverCapture?: MouseEventHandler;
        onMouseUp?: MouseEventHandler;
        onMouseUpCapture?: MouseEventHandler;

        // Selection Events
        onSelect?: EventHandler<Event>;
        onSelectCapture?: EventHandler<Event>;

        // Touch Events
        onTouchCancel?: TouchEventHandler;
        onTouchCancelCapture?: TouchEventHandler;
        onTouchEnd?: TouchEventHandler;
        onTouchEndCapture?: TouchEventHandler;
        onTouchMove?: TouchEventHandler;
        onTouchMoveCapture?: TouchEventHandler;
        onTouchStart?: TouchEventHandler;
        onTouchStartCapture?: TouchEventHandler;

        // UI Events
        onScroll?: UIEventHandler;
        onScrollCapture?: UIEventHandler;

        // Wheel Events
        onWheel?: WheelEventHandler;
        onWheelCapture?: WheelEventHandler;

        // Animation Events
        onAnimationStart?: AnimationEventHandler;
        onAnimationStartCapture?: AnimationEventHandler;
        onAnimationEnd?: AnimationEventHandler;
        onAnimationEndCapture?: AnimationEventHandler;
        onAnimationIteration?: AnimationEventHandler;
        onAnimationIterationCapture?: AnimationEventHandler;

        // Transition Events
        onTransitionEnd?: TransitionEventHandler;
        onTransitionEndCapture?: TransitionEventHandler;

        onRemove?: EventHandler<CustomEvent<void>>;
        onUpdate?: EventHandler<CustomEvent<UnitElementAttributes>>;
    }

    type SyntheticEvent<T extends Event> = T & {
        target: HTMLElement;
    };

    interface EventHandler<E extends SyntheticEvent> {
        (event: E, unit?: Unit): void;
    }

    type ClipboardEventHandler = EventHandler<SyntheticEvent<ClipboardEvent>>;
    type CompositionEventHandler = EventHandler<
        SyntheticEvent<CompositionEvent>
    >;
    type DragEventHandler = EventHandler<SyntheticEvent<DragEvent>>;
    type FocusEventHandler = EventHandler<SyntheticEvent<FocusEvent>>;
    type FormEventHandler = EventHandler<SyntheticEvent<Event>>;
    type KeyboardEventHandler = EventHandler<SyntheticEvent<KeyboardEvent>>;
    type MouseEventHandler = EventHandler<SyntheticEvent<MouseEvent>>;
    type TouchEventHandler = EventHandler<SyntheticEvent<TouchEvent>>;
    type UIEventHandler = EventHandler<SyntheticEvent<UIEvent>>;
    type WheelEventHandler = EventHandler<SyntheticEvent<WheelEvent>>;
    type AnimationEventHandler = EventHandler<SyntheticEvent<AnimationEvent>>;
    type TransitionEventHandler = EventHandler<SyntheticEvent<TransitionEvent>>;

    // type UnitElementAttributes = (Partial<HTMLElement> | Partial<SVGElement>) &
    //     UnitElementEvents;
    interface UnitElementAttributes extends UnitElementEvents {
        children?: any;

        // React-specific Attributes
        defaultChecked?: boolean;
        defaultValue?: string | string[];

        // Standard HTML Attributes
        accept?: string;
        acceptCharset?: string;
        accessKey?: string;
        action?: string;
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        alt?: string;
        async?: boolean;
        autoComplete?: string;
        autoFocus?: boolean;
        autoPlay?: boolean;
        capture?: boolean;
        cellPadding?: number | string;
        cellSpacing?: number | string;
        charSet?: string;
        challenge?: string;
        checked?: boolean;
        classID?: string;
        className?: string;
        class?: string;
        cols?: number;
        colSpan?: number;
        content?: string;
        contentEditable?: boolean;
        contextMenu?: string;
        controls?: boolean;
        coords?: string;
        crossOrigin?: string;
        data?: string;
        dateTime?: string;
        default?: boolean;
        defer?: boolean;
        dir?: string;
        disabled?: boolean;
        download?: any;
        draggable?: boolean;
        encType?: string;
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        frameBorder?: number | string;
        headers?: string;
        height?: number | string;
        hidden?: boolean;
        high?: number;
        href?: string;
        hrefLang?: string;
        htmlFor?: string;
        httpEquiv?: string;
        id?: string;
        inputMode?: string;
        integrity?: string;
        is?: string;
        keyParams?: string;
        keyType?: string;
        kind?: string;
        label?: string;
        lang?: string;
        list?: string;
        loop?: boolean;
        low?: number;
        manifest?: string;
        marginHeight?: number;
        marginWidth?: number;
        max?: number | string;
        maxLength?: number;
        media?: string;
        mediaGroup?: string;
        method?: string;
        min?: number | string;
        minLength?: number;
        multiple?: boolean;
        muted?: boolean;
        name?: string;
        nonce?: string;
        noValidate?: boolean;
        open?: boolean;
        optimum?: number;
        pattern?: string;
        placeholder?: string;
        playsInline?: boolean;
        poster?: string;
        preload?: string;
        radioGroup?: string;
        readOnly?: boolean;
        rel?: string;
        required?: boolean;
        reversed?: boolean;
        role?: string;
        rows?: number;
        rowSpan?: number;
        sandbox?: string;
        scope?: string;
        scoped?: boolean;
        scrolling?: string;
        seamless?: boolean;
        selected?: boolean;
        shape?: string;
        size?: number;
        sizes?: string;
        span?: number;
        spellCheck?: boolean;
        src?: string;
        srcDoc?: string;
        srcLang?: string;
        srcSet?: string;
        start?: number;
        step?: number | string;
        style?: CSSProperties<string | number, number>;
        summary?: string;
        tabIndex?: number;
        target?: string;
        title?: string;
        type?: string;
        useMap?: string;
        value?: string | string[] | number;
        width?: number | string;
        wmode?: string;
        wrap?: string;

        // RDFa Attributes
        about?: string;
        datatype?: string;
        inlist?: any;
        prefix?: string;
        property?: string;
        resource?: string;
        typeof?: string;
        vocab?: string;

        // Non-standard Attributes
        autoCapitalize?: string;
        autoCorrect?: string;
        autoSave?: string;
        color?: string;
        itemProp?: string;
        itemScope?: boolean;
        itemType?: string;
        itemID?: string;
        itemRef?: string;
        results?: number;
        security?: string;
        unselectable?: boolean;
    }
    // interface CSSProperties extends CSS.Properties<string | number> {}
    interface UnitElement extends UnitElementAttributes {
        // style?: CSSProperties;
        await?: boolean;
    }
}
