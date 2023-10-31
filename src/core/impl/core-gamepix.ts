import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { initializationError, notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { debug } from "../../utils/logger";
import { onPauseFunctions } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";
import { API_URL, SDK_SRC, WORTAL_API } from "../../data/core-data";

/**
 * GamePix implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreGamePix extends CoreBase {
    constructor() {
        super();
    }

    protected authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse> {
        return Promise.reject(notSupported(undefined, WORTAL_API.AUTHENTICATE_ASYNC, API_URL.AUTHENTICATE_ASYNC));
    }

    protected initializeAsyncImpl(): Promise<void> {
        return this.defaultInitializeAsyncImpl();
    }

    protected linkAccountAsyncImpl(): Promise<boolean> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LINK_ACCOUNT_ASYNC, API_URL.LINK_ACCOUNT_ASYNC));
    }

    protected onPauseImpl(callback: () => void): void {
        onPauseFunctions.push(callback);
    }

    protected performHapticFeedbackAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC, API_URL.PERFORM_HAPTIC_FEEDBACK_ASYNC));
    }

    protected setLoadingProgressImpl(progress: number): void {
        return;
    }

    protected startGameAsyncImpl(): Promise<void> {
        return this.defaultStartGameAsyncImpl();
    }

    protected _initializePlatformAsyncImpl(): Promise<void> {
        return new Promise((resolve, reject) => {
                const gamePixSDK = document.createElement("script");
                gamePixSDK.src = SDK_SRC.GAME_PIX;

                gamePixSDK.onload = () => {
                    if (typeof GamePix === "undefined") {
                        reject(initializationError("Failed to load GamePix SDK.", "_initializePlatformAsyncImpl"));
                    }

                    debug("GamePix platform SDK loaded.");
                    Wortal._internalPlatformSDK = GamePix;
                    resolve();
                }

                gamePixSDK.onerror = () => {
                    reject(initializationError("Failed to load GamePix SDK.", "_initializePlatformAsyncImpl"));
                }

                document.head.appendChild(gamePixSDK);
            });
    }

    protected _initializeSDKAsyncImpl(): Promise<void> {
        return this.defaultInitializeSDKAsyncImpl();
    }

    protected _supportedAPIs: string[] = [
        WORTAL_API.INITIALIZE_ASYNC,
        WORTAL_API.START_GAME_ASYNC,
        WORTAL_API.SET_LOADING_PROGRESS,
        WORTAL_API.ON_PAUSE,
        WORTAL_API.ADS_IS_AD_BLOCKED,
        WORTAL_API.ADS_SHOW_INTERSTITIAL,
        WORTAL_API.ADS_SHOW_REWARDED,
        WORTAL_API.IAP_IS_ENABLED,
        WORTAL_API.PLAYER_GET_ID,
        WORTAL_API.PLAYER_GET_NAME,
        WORTAL_API.PLAYER_GET_PHOTO,
        WORTAL_API.PLAYER_IS_FIRST_PLAY,
        WORTAL_API.PLAYER_GET_DATA_ASYNC,
        WORTAL_API.PLAYER_SET_DATA_ASYNC,
        WORTAL_API.SESSION_GET_LOCALE,
        WORTAL_API.SESSION_GET_PLATFORM,
        WORTAL_API.SESSION_GET_DEVICE,
        WORTAL_API.SESSION_GET_ORIENTATION,
        WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
        WORTAL_API.SESSION_GAME_LOADING_START,
        WORTAL_API.SESSION_GAME_LOADING_STOP,
        WORTAL_API.SESSION_HAPPY_TIME,
    ];

}
