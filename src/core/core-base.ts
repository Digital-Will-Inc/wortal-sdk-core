import { AuthPayload } from "../auth/interfaces/auth-payload";
import { AuthResponse } from "../auth/interfaces/auth-response";
import { initializationError, invalidParams } from "../errors/error-handler";
import { ErrorMessage } from "../errors/interfaces/error-message";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { apiCall, debug, info, internalCall } from "../utils/logger";
import { isValidNumber } from "../utils/validators";
import { delayUntilConditionMet, removeLoadingCover } from "../utils/wortal-utils";
import { API_URL, WORTAL_API } from "../data/core-data";

/**
 * Base class for implementations of the Wortal SDK core functionality. Extend this class to implement the core functionality.
 * @hidden
 */
export abstract class CoreBase {
    protected abstract _supportedAPIs: string[];

    constructor() {
    }

//#region Public API

    public async initializeAsync(): Promise<void> {
        apiCall(WORTAL_API.INITIALIZE_ASYNC);

        if (!Wortal._internalIsPlatformInitialized) {
            debug("Platform not initialized yet, awaiting platform initialization..");
            await delayUntilConditionMet(() => Wortal._internalIsPlatformInitialized,
                "Platform not initialized yet, awaiting platform initialization..");
        }

        const validationResult: ValidationResult = this.validateInitializeAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.initializeAsyncImpl();
    }

    public async startGameAsync(): Promise<void> {
        apiCall(WORTAL_API.START_GAME_ASYNC);

        const validationResult: ValidationResult = this.validateStartGameAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.startGameAsyncImpl();
    }

    public authenticateAsync(payload?: AuthPayload): Promise<AuthResponse> {
        apiCall(WORTAL_API.AUTHENTICATE_ASYNC);
        //TODO: validate auth payload
        return this.authenticateAsyncImpl(payload);
    }

    public linkAccountAsync(): Promise<boolean> {
        apiCall(WORTAL_API.LINK_ACCOUNT_ASYNC);

        return this.linkAccountAsyncImpl();
    }

    public setLoadingProgress(progress: number): void {
        // Turn this on at your own risk. Some engines or games will flood the logs with this.
        // apiCall(WORTAL_API.SET_LOADING_PROGRESS);

        const validationResult: ValidationResult = this.validateSetLoadingProgress(progress);
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.setLoadingProgressImpl(progress);
    }

    public onPause(callback: () => void): void {
        apiCall(WORTAL_API.ON_PAUSE);

        const validationResult: ValidationResult = this.validateOnPause(callback);
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.onPauseImpl(callback);
    }

    public performHapticFeedbackAsync(): Promise<void> {
        apiCall(WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC);

        return this.performHapticFeedbackAsyncImpl();
    }

    public getSupportedAPIs(): string[] {
        apiCall(WORTAL_API.GET_SUPPORTED_APIS);

        return this._supportedAPIs;
    }

//#endregion
//#region Internal API

    /**
     * Initializes the platform SDK for the current platform. This is called after the SDK config has been initialized and
     * before the SDK initialization. This should not be called by the game developer.
     * @returns {Promise<void>} Promise that resolves when the platform SDK has been initialized.
     * @internal
     * @hidden
     */
    _initializePlatformAsync(): Promise<void> {
        internalCall("_initializePlatformAsync");

        return this._initializePlatformAsyncImpl();
    }

    /**
     * Initializes the Wortal SDK. This is called after the platform has been initialized.
     * This should not be called by the game developer.
     * @internal
     * @hidden
     */
    _initializeSDKAsync(): Promise<void> {
        internalCall("_initializeSDKAsync");

        return this._initializeSDKAsyncImpl();
    }

//#endregion
//#region Implementation interface

    protected abstract initializeAsyncImpl(): Promise<void>;
    protected abstract startGameAsyncImpl(): Promise<void>;
    protected abstract authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse>;
    protected abstract linkAccountAsyncImpl(): Promise<boolean>;
    protected abstract setLoadingProgressImpl(progress: number): void;
    protected abstract onPauseImpl(callback: () => void): void;
    protected abstract performHapticFeedbackAsyncImpl(): Promise<void>;
    protected abstract _initializePlatformAsyncImpl(): Promise<void>;
    protected abstract _initializeSDKAsyncImpl(): Promise<void>;

    protected defaultInitializeAsyncImpl(): Promise<void> {
        return this._initializeSDKAsyncImpl()
            .then(() => {
                Wortal.analytics._logGameStart();
                Wortal.isInitialized = true;
                window.dispatchEvent(new Event("wortal-sdk-initialized"));
                info("SDK initialization complete.");
            })
            .catch((error: any) => {
                throw initializationError(`Failed to initialize SDK during _initializeSDK: ${error.message}`,
                    WORTAL_API.INITIALIZE_ASYNC,
                    API_URL.INITIALIZE_ASYNC);
            });
    }

    protected defaultStartGameAsyncImpl(): Promise<void> {
        Wortal.analytics._logGameStart();
        return Promise.resolve();
    }

    // This is used when there's nothing specific to the platform that needs to happen at this point.
    protected defaultInitializeSDKAsyncImpl(): Promise<void> {
        return Promise.all([Wortal.ads._internalAdConfig.initialize(), Wortal.player._internalPlayer.initialize()])
            .then(() => {
                Wortal.ads._internalAdConfig.setPrerollShown(true);
                Wortal.iap._internalTryEnableIAP();
                removeLoadingCover();
                debug(`SDK initialized for ${Wortal._internalPlatform} platform.`);
            })
            .catch((error: any) => {
                throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`, `_initializeSDKAsyncGenericImpl`);
            });
    }

//#endregion
//#region Validation

    protected validateInitializeAsync(): ValidationResult {
        if (Wortal._internalIsAutoInit) {
            return {
                valid: false,
                error: initializationError("SDK is configured to auto initialize. Only call this when manual initialization is enabled.",
                    WORTAL_API.INITIALIZE_ASYNC,
                    API_URL.INITIALIZE_ASYNC)
            };
        }

        if (Wortal.isInitialized) {
            return {
                valid: false,
                error: initializationError("SDK already initialized.",
                    WORTAL_API.INITIALIZE_ASYNC,
                    API_URL.INITIALIZE_ASYNC)
            };
        }

        return {valid: true};
    }

    protected validateStartGameAsync(): ValidationResult {
        if (Wortal._internalIsAutoInit) {
            return {
                valid: false,
                error: initializationError("SDK is configured to auto initialize. Only call this when manual initialization is enabled.",
                    WORTAL_API.START_GAME_ASYNC,
                    API_URL.START_GAME_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: initializationError("SDK not initialized. Call initializeAsync first.",
                    WORTAL_API.START_GAME_ASYNC,
                    API_URL.START_GAME_ASYNC)
            };
        }

        return {valid: true};
    }

    protected validateSetLoadingProgress(progress: number): ValidationResult {
        if (!isValidNumber(progress) || progress < 0 || progress > 100) {
            return {
                valid: false,
                error: invalidParams("Progress must be a number between 0 and 100.",
                    WORTAL_API.SET_LOADING_PROGRESS,
                    API_URL.SET_LOADING_PROGRESS)
            };
        }

        return {valid: true};
    }

    protected validateOnPause(callback: () => void): ValidationResult {
        if (typeof callback !== "function") {
            return {
                valid: false,
                error: invalidParams("Callback must be a function.",
                    WORTAL_API.ON_PAUSE,
                    API_URL.ON_PAUSE)
            };
        }

        return {valid: true};
    }

//#endregion
}
