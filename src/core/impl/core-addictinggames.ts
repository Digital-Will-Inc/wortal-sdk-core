import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { API_URL, SDK_SRC, WORTAL_API } from "../../data/core-data";
import { initializationError, notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { onPauseFunctions } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";

/**
 * CrazyGames implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreAddictingGames extends CoreBase {
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
            const addictingGamesSDK = document.createElement("script");
            addictingGamesSDK.src = SDK_SRC.ADDICTING_GAMES_SDK;

            //TODO: do we need this? we're not using their popup dialogs so maybe not
            const addictingGamesCSS = document.createElement("link");
            addictingGamesCSS.rel = "stylesheet";
            addictingGamesCSS.type = "text/css";
            addictingGamesCSS.href = SDK_SRC.ADDICTING_GAMES_CSS;

            addictingGamesSDK.onload = () => {
                if (typeof SWAGAPI === "undefined") {
                    reject(initializationError("Failed to load AddictingGames SDK.", "_initializePlatformAsyncImpl"));
                }

                Wortal._internalPlatformSDK = SWAGAPI.getInstance({
                    wrapper: document.body,
                    api_key: window.addictingGamesID,
                    theme: "shockwave", // Are there other themes? This is the only one I see in the SDK docs.
                    debug: true
                });

                Wortal._internalPlatformSDK.startSession().then(() => {
                    Wortal._log.debug("AddictingGames platform SDK loaded.");
                    resolve();
                });
            }

            addictingGamesSDK.onerror = () => {
                reject(initializationError("Failed to load AddictingGames SDK.", "_initializePlatformAsyncImpl"));
            }

            document.head.appendChild(addictingGamesSDK);
            document.head.appendChild(addictingGamesCSS);
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
        WORTAL_API.ACHIEVEMENTS_GET_ACHIEVEMENTS_ASYNC,
        WORTAL_API.ACHIEVEMENTS_UNLOCK_ACHIEVEMENT_ASYNC,
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
        WORTAL_API.SESSION_GAMEPLAY_START,
        WORTAL_API.SESSION_GAMEPLAY_STOP,
        WORTAL_API.STATS_GET_STATS_ASYNC,
        WORTAL_API.STATS_POST_STATS_ASYNC,
    ];
}
