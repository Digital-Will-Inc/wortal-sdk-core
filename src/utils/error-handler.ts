import { ErrorMessage } from "../interfaces/wortal";

/** @hidden */
export function rethrowPlatformError(original: any, context: string, url?: string): ErrorMessage {
    return {
        code: original.code,
        message: original.message,
        context: context,
        url: url,
    }
}

/** @hidden */
export function invalidParams(message: string, context: string, url?: string): ErrorMessage {
    return {
        code: 'INVALID_PARAM',
        message: message,
        context: context,
        url: url,
    }
}

/** @hidden */
export function invalidOperation(message: string, context: string, url?: string): ErrorMessage {
    return {
        code: 'INVALID_OPERATION',
        message: message,
        context: context,
        url: url,
    }
}

/** @hidden */
export function notSupported(message: string, context: string, url?: string): ErrorMessage {
    return {
        code: 'NOT_SUPPORTED',
        message: message,
        context: context,
        url: url || "https://sdk.html5gameportal.com/api/wortal/#getsupportedapis",
    }
}

/** @hidden */
export function operationFailed(message: string, context: string, url?: string): ErrorMessage {
    return {
        code: 'OPERATION_FAILED',
        message: message,
        context: context,
        url: url,
    }
}

/** @hidden */
export function initializationError(message: string, context: string, url?: string): ErrorMessage {
    return {
        code: 'INITIALIZATION_ERROR',
        message: message,
        context: context,
        url: url,
    }
}
