declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: UnitElement;
    }

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
    }

    type SyntheticEvent<T extends Event> = T & {
        target: HTMLElement;
    };

    interface EventHandler<E extends SyntheticEvent> {
        (event: E): void;
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

    type UnitElementAttributes = (Partial<HTMLElement> | Partial<SVGElement>) &
        UnitElementEvents;

    type UnitElement = UnitElementAttributes & {
        await?: boolean;
    };
}
