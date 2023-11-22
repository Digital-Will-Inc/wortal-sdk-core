import Wortal from "../index";
import { ErrorMessage_AddictingGames } from "./interfaces/addictinggames-error";
import { ErrorMessage } from "./interfaces/error-message";
import { ErrorMessage_Facebook } from "./interfaces/facebook-error";
import { ErrorMessage_Link } from "./interfaces/link-error";
import { ErrorMessage_Viber } from "./interfaces/viber-error";
import { Error_CrazyGames } from "./types/crazygames-error-types";

/**
 * Rethrows an error from the Facebook, Link or Viber SDKs as a Wortal error. Use this in a catch block when
 * calling these SDKs to catch their errors and convert them to Wortal errors for consistent error handling.
 * @hidden
 */
export function rethrowError_Facebook_Rakuten(original: ErrorMessage_Facebook | ErrorMessage_Link | ErrorMessage_Viber,
                                              context: string, url?: string): ErrorMessage {
    const error: ErrorMessage = {
        code: original.code || "UNKNOWN",
        message: original.message || "No message provided by the platform SDK.",
        context: context,
        url: url,
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * Rethrows an error from the CrazyGames SDK as a Wortal error. Use this in the error callback when calling the
 * CrazyGames SDK to catch its errors and convert them to Wortal errors for consistent error handling.
 * @hidden
 */
export function rethrowError_CrazyGames(original: Error_CrazyGames, context: string, url?: string): ErrorMessage {
    const error: ErrorMessage = {
        code: ErrorMessages_CrazyGames[original] || "UNKNOWN",
        message: ErrorMessages[ErrorMessages_CrazyGames[original]] || "No message provided by the platform SDK.",
        context: context,
        url: url,
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * Rethrows an error from the AddictingGames SDK as a Wortal error. Use this in the error callback when calling the
 * AddictingGames SDK to catch its errors and convert them to Wortal errors for consistent error handling.
 * @hidden
 */
export function rethrowError_AddictingGames(original: ErrorMessage_AddictingGames, context: string, url?: string): ErrorMessage {
    const error: ErrorMessage = {
        code: original.status.toString(),
        message: original.message || "No message provided by the platform SDK.",
        context: context,
        url: url,
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * Rethrows an error from the Yandex SDK as a Wortal error. Use this in the error callback when calling the
 * Yandex SDK to catch its errors and convert them to Wortal errors for consistent error handling.
 * @hidden
 */
export function rethrowError_Yandex(original: string, context: string, url?: string): ErrorMessage {
    //TODO: create interface for Yandex errors
    const error: ErrorMessage = {
        code: ErrorMessages_Yandex[original] || "UNKNOWN",
        message: ErrorMessages[ErrorMessages_Yandex[original]] || "No message provided by the platform SDK.",
        context: context,
        url: url,
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * Throw this in validation functions to indicate that the parameter is invalid.
 * @hidden
 */
export function invalidParams(message: string = "", context: string, url?: string): ErrorMessage {
    const error: ErrorMessage = {
        code: "INVALID_PARAM",
        message: message || ErrorMessages["INVALID_PARAM"],
        context: context,
        url: url,
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * Throw this in situations where the caller does not have permission to perform the requested operation or the
 * current state does permit the requested operation. Ex: calling a function that requires authentication when the
 * user is not authenticated, or calling a function that requires a context when the game is in solo mode.
 * @hidden
 */
export function invalidOperation(message: string, context: string, url?: string): ErrorMessage {
    const error: ErrorMessage = {
        code: "INVALID_OPERATION",
        message: message,
        context: context,
        url: url,
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * Throw this to indicate the called function is not supported on the current platform.
 * @hidden
 */
export function notSupported(message: string = "", context: string, url?: string): ErrorMessage {
    const error: ErrorMessage = {
        code: "NOT_SUPPORTED",
        message: message || ErrorMessages["NOT_SUPPORTED"],
        context: context,
        url: url || "https://sdk.html5gameportal.com/api/wortal/#getsupportedapis",
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * Throw this to indicate an operation, such as fetch, has failed. This is typically thrown during a failed web
 * request and the message should include additional details about the failure such as the response code.
 * @hidden
 */
export function operationFailed(message: string, context: string, url?: string): ErrorMessage {
    const error: ErrorMessage = {
        code: "OPERATION_FAILED",
        message: message,
        context: context,
        url: url,
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * Throw this to indicate the SDK failed to initialize. This can occur if the Wortal SDK encountered an error during
 * initialization or if the platform SDK failed to initialize. This should be a fatal error that prevents the SDK
 * from being used.
 * @hidden
 */
export function initializationError(message: string, context: string, url?: string): ErrorMessage {
    const error: ErrorMessage = {
        code: "INITIALIZATION_ERROR",
        message: message,
        context: context,
        url: url || "https://sdk.html5gameportal.com/wortal-html5/#initialization",
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * Throw this to indicate the SDK has not been initialized yet. This can occur if the game attempts to call an SDK
 * function before the SDK has been initialized.
 * @hidden
 */
export function notInitialized(message: string = "", context: string, url?: string): ErrorMessage {
    const error: ErrorMessage = {
        code: "NOT_INITIALIZED",
        message: message || ErrorMessages["NOT_INITIALIZED"],
        context: context,
        url: url,
    }

    Wortal._log.exception(error.code, error);
    return error;
}

/**
 * All error codes and messages defined by the Wortal SDK.
 * @hidden
 */
const ErrorMessages: Record<string, string> = {
    ACHIEVEMENT_NOT_FOUND: "No achievement with the requested name was found. Either the achievement does not exist yet, or the name did not match any registered achievement configuration for the game.",
    AUTH_IN_PROGRESS: "The game attempted to show an authentication prompt, but a prompt to authenticate is already in progress.",
    AUTH_NOT_ENABLED: "The game attempted to perform an operation that requires authentication, but the game has not enabled authentication.",
    CLIENT_UNSUPPORTED_OPERATION: "The client does not support the current operation. This may be due to lack of support on the client version or platform, or because the operation is not allowed for the game or player.",
    INITIALIZATION_ERROR: "The SDK failed to initialize, this can occur if the Wortal SDK encountered an error during initialization or if the platform SDK failed to initialize.",
    INVALID_OPERATION: "The requested operation is invalid for the current game state. This may include requests that violate limitations, such as exceeding storage thresholds, or are not available in a certain state, such as making a context-specific request in a solo context.",
    INVALID_PARAM: "The parameter(s) passed to the API are invalid. Could indicate an incorrect type, invalid number of arguments, or a semantic issue (for example, passing an unserializable object to a serializing function).",
    LEADERBOARD_NOT_FOUND: "No leaderboard with the requested name was found. Either the leaderboard does not exist yet, or the name did not match any registered leaderboard configuration for the game.",
    LEADERBOARD_WRONG_CONTEXT: "Attempted to write to a leaderboard that's associated with a context other than the one the game is currently being played in.",
    LINK_IN_PROGRESS: "The game attempted to show an account linking prompt, but a prompt to link accounts is already in progress.",
    NETWORK_FAILURE: "The client experienced an issue with a network request. This is likely due to a transient issue, such as the player's internet connection dropping.",
    NOT_INITIALIZED: "The SDK has not been initialized yet. This can occur if the game attempts to call an SDK function before the SDK has been initialized. Check Wortal.isInitialized or wait for Wortal.initializeAsync to complete before calling other SDK functions.",
    NOT_SUPPORTED: "Function or feature is not currently supported on the platform currently being played on.",
    OPERATION_FAILED: "The operation failed, this is typically thrown during a failed web request and the message may include additional details about the failure.",
    PAYMENTS_NOT_INITIALIZED: "The client has not completed setting up payments or is not accepting payments API calls.",
    PAYMENTS_OPERATION_FAILURE: "The client encountered an error while performing a payments operation.",
    PENDING_REQUEST: "Represents a rejection due an existing request that conflicts with this one. For example, we will reject any calls that would surface a Facebook UI when another request that depends on a Facebook UI is pending.",
    RATE_LIMITED: "Some APIs or operations are being called too often. This is likely due to the game calling a particular API an excessive amount of times in a very short period. Reducing the rate of requests should cause this error to go away.",
    SAME_CONTEXT: "The game attempted to perform a context switch into the current context.",
    TOURNAMENT_NOT_FOUND: "No tournament with the given ID was found. Either the tournament does not exist yet, or has expired.",
    UNKNOWN: "An unknown or unspecified issue occurred. This is the default error code returned when the client does not specify a code.",
    USER_ALREADY_AUTHENTICATED: "The game attempted to authenticate a user, but the user is already authenticated.",
    USER_INPUT: "The user made a choice that resulted in a rejection. For example, if the game calls up the Context Switch dialog and the player closes it, this error code will be included in the promise rejection.",
    USER_NOT_AUTHENTICATED: "The game attempted to perform an operation that requires authentication, but the user is not authenticated.",
}

/**
 * Maps CrazyGames error codes to Wortal error codes.
 * @hidden
 */
const ErrorMessages_CrazyGames: Record<string, string> = {
    authNotEnabled: "AUTH_NOT_ENABLED",
    userNotAuthenticated: "USER_NOT_AUTHENTICATED",
    showAuthPromptInProgress: "AUTH_IN_PROGRESS",
    userAlreadySignedIn: "USER_ALREADY_AUTHENTICATED",
    userCancelled: "USER_INPUT",
    showAccountLinkPromptInProgress: "LINK_IN_PROGRESS",
    unexpectedError: "UNKNOWN",
}

/**
 * Maps Yandex error codes to Wortal error codes.
 * @hidden
 */
const ErrorMessages_Yandex: Record<string, string> = {
    USER_NOT_AUTHORIZED: "The game attempted to perform an operation that requires authentication, but the user is not authenticated.",
}
