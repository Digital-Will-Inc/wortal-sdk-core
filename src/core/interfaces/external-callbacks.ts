/**
 * Some platform SDKs, such as GD and GameMonetize, rely on a global window object to trigger event callbacks.
 * We use the ExternalCallbacks interface to define the callbacks we attach to the window object.
 * @hidden
 */
export interface ExternalCallbacks {
    [key: string]: () => void;
}
