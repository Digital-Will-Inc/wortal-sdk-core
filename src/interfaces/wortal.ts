/**
 * Error that is thrown by the SDK. Some messages are re-thrown from platform SDKs.
 */
export interface ErrorMessage {
    /**
     * Code for the error.
     */
    code: string;
    /**
     * Message details about the error.
     */
    message: string;
    /**
     * Context details about the error.
     */
    context: string;
    /**
     * URL to the relevant API docs.
     */
    url: string | undefined;
}

/** @hidden */
export interface Error_Facebook_Rakuten {
    code: string;
    message: string;
}
