const logPrefix: string = " Wortal ";
const callLogPrefix: string = " API ";
const internalCallLogPrefix: string = " INTERNAL ";
const performanceLogPrefix: string = " PERFORMANCE ";
const statusLogPrefix: string = " STATUS ";

const logTextStyle: string = `font-weight: normal;`;

const logPrefixStyle: string = `
    background: #8258A4;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

const logCallTagStyle: string = `
    background: #A45882;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

const logInternalTagStyle: string = `
    background: #5F5666;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

const logPerformanceTagStyle: string = `
    background: #75AA00;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

const logStatusTagStyle: string = `
    background: #007FFF;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

/**
 * Logs a debug message to the console. Logs at the verbose level.
 * @hidden
 */
export function debug(message: string, args?: unknown): void {
    console.debug(`%c${logPrefix}%c ${message}`, logPrefixStyle, logTextStyle);
    if (args !== undefined) {
        console.debug(args);
    }
}

/**
 * Logs an info message to the console. Logs at the info level.
 * @hidden
 */
export function info(message: string, args?: unknown) {
    console.info(`%c${logPrefix}%c ${message}`, logPrefixStyle, logTextStyle);
    if (args !== undefined) {
        console.info(args);
    }
}

/**
 * Logs a warning message to the console. Logs at the warning level.
 * @hidden
 */
export function warn(message: string, args?: unknown) {
    console.warn(`%c${logPrefix}%c ${message}`, logPrefixStyle, logTextStyle);
    if (args !== undefined) {
        console.warn(args);
    }
}

/**
 * Logs an error message to the console. Logs at the error level. Does not throw an exception, just logs the message.
 * @hidden
 */
export function exception(message: string, args?: unknown) {
    console.error(`%c${logPrefix}%c ${message}`, logPrefixStyle, logTextStyle);
    if (args !== undefined) {
        console.error(args);
    }
}

/**
 * Logs a status message to the console. This is used to track SDK status. Logs at the verbose level.
 * @hidden
 */
export function status(message: string, args?: unknown) {
    console.debug(`%c${logPrefix}%c${statusLogPrefix}%c ${message}`, logPrefixStyle, logStatusTagStyle, logTextStyle);
    if (args !== undefined) {
        console.debug(args);
    }
}

/**
 * Logs an SDK function call to the console. This is used to track API usage. Logs at the verbose level.
 * @hidden
 */
export function apiCall(fn: string, args?: unknown): void {
    console.debug(`%c${logPrefix}%c${callLogPrefix}%c ${fn}`, logPrefixStyle, logCallTagStyle, logTextStyle);
    if (args !== undefined) {
        console.debug(args);
    }
}

/**
 * Logs an internal SDK function call to the console. This is used to track internal SDK usage. Logs at the verbose level.
 * @hidden
 */
export function internalCall(fn: string, args?: unknown): void {
    console.debug(`%c${logPrefix}%c${internalCallLogPrefix}%c ${fn}`, logPrefixStyle, logInternalTagStyle, logTextStyle);
    if (args !== undefined) {
        console.debug(args);
    }
}

/**
 * Logs a performance message to the console. This is used to track performance of the SDK. Logs at the verbose level.
 * @hidden
 */
export function performanceLog(message: string, args?: unknown): void {
    console.debug(`%c${logPrefix}%c${performanceLogPrefix}%c ${message}`, logPrefixStyle, logPerformanceTagStyle, logTextStyle);
    if (args !== undefined) {
        console.debug(args);
    }
}

