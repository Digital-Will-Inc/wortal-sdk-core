import { Platform } from "../../session/types/session-types";

/**
 * Options to pass when initializing the Wortal SDK.
 */
export interface InitializationOptions {
    /**
     * Whether to automatically initialize the SDK or not. Default is true.
     */
    autoInitialize: boolean,
    /**
     * The platform the game is running on.
     */
    platform: Platform,
    /**
     * Enable or disable debug mode. Default is disabled.
     */
    debugMode?: boolean,
}
