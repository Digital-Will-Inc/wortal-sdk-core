/**
 * Logger class for the SDK. This is used to log messages to the console. Use this over console logging directly.
 * @module Logger
 */
export class WortalLogger {
    private _logPrefix: string = " Wortal ";
    private _callLogPrefix: string = " API ";
    private _internalCallLogPrefix: string = " INTERNAL ";
    private _performanceLogPrefix: string = " PERFORMANCE ";
    private _statusLogPrefix: string = " STATUS ";

    private _logTextStyle: string = `font-weight: normal;`;

    private _logPrefixStyle: string = `
    background: #8258A4;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

    private _logCallTagStyle: string = `
    background: #A45882;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

    private _logInternalTagStyle: string = `
    background: #5F5666;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

    private _logPerformanceTagStyle: string = `
    background: #75AA00;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

    private _logStatusTagStyle: string = `
    background: #007FFF;
    border-radius: 5px;
    color: white;
    font-weight: bold;`;

    /**
     * Logs a debug message to the console. Logs at the verbose level.
     * @hidden
     */
    debug(message: string, args?: unknown): void {
        console.debug(`%c${this._logPrefix}%c ${message}`, this._logPrefixStyle, this._logTextStyle);

        if (args !== undefined) {
            console.debug(args);
        }
    }

    /**
     * Logs an info message to the console. Logs at the info level.
     * @hidden
     */
    info(message: string, args?: unknown) {
        console.info(`%c${this._logPrefix}%c ${message}`, this._logPrefixStyle, this._logTextStyle);

        if (args !== undefined) {
            console.info(args);
        }
    }

    /**
     * Logs a warning message to the console. Logs at the warning level.
     * @hidden
     */
    warn(message: string, args?: unknown) {
        console.warn(`%c${this._logPrefix}%c ${message}`, this._logPrefixStyle, this._logTextStyle);

        if (args !== undefined) {
            console.warn(args);
        }
    }

    /**
     * Logs an error message to the console. Logs at the error level. Does not throw an exception, just logs the message.
     * @hidden
     */
    exception(message: string, args?: unknown) {
        console.error(`%c${this._logPrefix}%c ${message}`, this._logPrefixStyle, this._logTextStyle);

        if (args !== undefined) {
            console.error(args);
        }
    }

    /**
     * Logs a status message to the console. This is used to track SDK status. Logs at the verbose level.
     * @hidden
     */
    status(message: string, args?: unknown) {
        console.debug(`%c${this._logPrefix}%c${this._statusLogPrefix}%c ${message}`,
            this._logPrefixStyle, this._logStatusTagStyle, this._logTextStyle);

        if (args !== undefined) {
            console.debug(args);
        }
    }

    /**
     * Logs an SDK function call to the console. This is used to track API usage. Logs at the verbose level.
     * @hidden
     */
    apiCall(fn: string, args?: unknown): void {
        console.debug(`%c${this._logPrefix}%c${this._callLogPrefix}%c ${fn}`,
            this._logPrefixStyle, this._logCallTagStyle, this._logTextStyle);

        if (args !== undefined) {
            console.debug(args);
        }
    }

    /**
     * Logs an internal SDK function call to the console. This is used to track internal SDK usage. Logs at the verbose level.
     * @hidden
     */
    internalCall(fn: string, args?: unknown): void {
        console.debug(`%c${this._logPrefix}%c${this._internalCallLogPrefix}%c ${fn}`,
            this._logPrefixStyle, this._logInternalTagStyle, this._logTextStyle);

        if (args !== undefined) {
            console.debug(args);
        }
    }

    /**
     * Logs a performance message to the console. This is used to track performance of the SDK. Logs at the verbose level.
     * @hidden
     */
    performanceLog(message: string, args?: unknown): void {
        console.debug(`%c${this._logPrefix}%c${this._performanceLogPrefix}%c ${message}`,
            this._logPrefixStyle, this._logPerformanceTagStyle, this._logTextStyle);

        if (args !== undefined) {
            console.debug(args);
        }
    }
}
