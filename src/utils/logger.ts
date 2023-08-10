/** @hidden */
const logPrefix: string = "[Wortal] ";

/** @hidden */
export function debug(message: string, args?: any): void {
    if (args !== undefined) {
        console.debug(logPrefix + message, args);
    } else {
        console.debug(logPrefix + message);
    }
}

/** @hidden */
export function info(message: string, args?: any) {
    if (args !== undefined) {
        console.info(logPrefix + message, args);
    } else {
        console.log(logPrefix + message);
    }
}

/** @hidden */
export function warn(message: string, args?: any) {
    if (args !== undefined) {
        console.warn(logPrefix + message, args);
    } else {
        console.warn(logPrefix + message);
    }
}

/** @hidden */
export function exception(message: string, args?: any) {
    if (args !== undefined) {
        console.error(logPrefix + message, args);
    } else {
        console.error(logPrefix + message);
    }
}
