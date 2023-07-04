import { ErrorMessage } from "../interfaces/wortal";

/** @hidden */
export function rethrowPlatformError(original: any, context: string): ErrorMessage {
    return {
        code: original.code,
        message: original.message,
        context: context,
    }
}

/** @hidden */
export function invalidParams(message: string, context: string): ErrorMessage {
    return {
        code: 'INVALID_PARAM',
        message: message,
        context: context,
    }
}

/** @hidden */
export function notSupported(message: string, context: string): ErrorMessage {
    return {
        code: 'NOT_SUPPORTED',
        message: message,
        context: context,
    }
}

/** @hidden */
export function operationFailed(message: string, context: string): ErrorMessage {
    return {
        code: 'OPERATION_FAILED',
        message: message,
        context: context,
    }
}
