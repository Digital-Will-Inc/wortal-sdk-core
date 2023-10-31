import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { initializationError, notSupported } from "../../errors/error-handler";
import { ErrorMessage_Viber } from "../../errors/interfaces/viber-error";
import Wortal from "../../index";
import { debug, info } from "../../utils/logger";
import { CoreBase } from "../core-base";
import { API_URL, SDK_SRC, WORTAL_API } from "../../data/core-data";

/**
 * Viber implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreViber extends CoreBase {
    constructor() {
        super();
    }

    protected authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse> {
        return Promise.reject(notSupported(undefined, WORTAL_API.AUTHENTICATE_ASYNC, API_URL.AUTHENTICATE_ASYNC));
    }

    protected initializeAsyncImpl(): Promise<void> {
        debug("Initializing SDK for Viber platform.");
        return Wortal._internalPlatformSDK.initializeAsync()
            .then(() => {
                Wortal.iap._internalTryEnableIAP();
                return Promise.all([Wortal.ads._internalAdConfig.initialize(), Wortal.player._internalPlayer.initialize()])
                    .then(() => {
                        Wortal.isInitialized = true;
                        window.dispatchEvent(new Event("wortal-sdk-initialized"));
                        info("SDK initialization complete.");
                    })
                    .catch((error: any) => {
                        throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`,
                            WORTAL_API.INITIALIZE_ASYNC,
                            API_URL.INITIALIZE_ASYNC);
                    })
            })
            .catch((error: ErrorMessage_Viber) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.initializeAsync: ${error.message}`,
                    WORTAL_API.INITIALIZE_ASYNC,
                    API_URL.INITIALIZE_ASYNC);
            });
    }

    protected linkAccountAsyncImpl(): Promise<boolean> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LINK_ACCOUNT_ASYNC, API_URL.LINK_ACCOUNT_ASYNC));
    }

    protected onPauseImpl(callback: () => void): void {
        Wortal._internalPlatformSDK.onPause(() => {
            debug("onPause callback invoked.");
            callback();
        });
    }

    protected performHapticFeedbackAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC, API_URL.PERFORM_HAPTIC_FEEDBACK_ASYNC));
    }

    protected setLoadingProgressImpl(progress: number): void {
        Wortal._internalPlatformSDK.setLoadingProgress(progress);
    }

    protected startGameAsyncImpl(): Promise<void> {
        return Wortal._internalPlatformSDK.startGameAsync()
            .then(() => {
                Wortal.session._gameLoadingStop();
                Wortal.analytics._logTrafficSource();
                Wortal.analytics._logGameStart();
            })
            .catch((error: ErrorMessage_Viber) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.startGameAsync: ${error.message}`,
                    WORTAL_API.START_GAME_ASYNC,
                    API_URL.START_GAME_ASYNC);
            });
    }

    protected _initializePlatformAsyncImpl(): Promise<void> {
        return new Promise((resolve, reject) => {
            const viberSDK = document.createElement("script");
            viberSDK.src = SDK_SRC.VIBER;

            viberSDK.onload = () => {
                if (typeof ViberPlay === "undefined") {
                    reject(initializationError("Failed to load Viber SDK.", "_initializePlatformAsyncImpl"));
                }

                debug("Viber platform SDK initialized.");
                Wortal._internalPlatformSDK = ViberPlay;
                resolve();
            }

            viberSDK.onerror = () => {
                reject(initializationError("Failed to load Viber SDK.", "_initializePlatformAsyncImpl"));
            }

            document.head.appendChild(viberSDK);
        });
    }

    protected _initializeSDKAsyncImpl(): Promise<void> {
        return Wortal._internalPlatformSDK.initializeAsync()
            .then(() => {
                return Promise.all([Wortal.ads._internalAdConfig.initialize(), Wortal.player._internalPlayer.initialize()])
                    .then(() => {
                        Wortal.iap._internalTryEnableIAP();
                        debug(`SDK initialized for ${Wortal._internalPlatform} platform.`);
                        return Wortal._internalPlatformSDK.startGameAsync()
                            .then(() => {
                                Wortal.analytics._logTrafficSource();
                            })
                            .catch((error: ErrorMessage_Viber) => {
                                throw initializationError(`Failed to initialize SDK during platformSDK.startGameAsync: ${error.message}`, `_initializeSDKAsyncImpl()`);
                            });
                    })
                    .catch((error: any) => {
                        throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`, `_initializeSDKAsyncImpl()`);
                    });
            })
            .catch((error: ErrorMessage_Viber) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.initializeAsync: ${error.message}`, `_initializeSDKAsyncImpl()`);
            });
    }

    protected _supportedAPIs: string[] = [
        WORTAL_API.INITIALIZE_ASYNC,
        WORTAL_API.START_GAME_ASYNC,
        WORTAL_API.SET_LOADING_PROGRESS,
        WORTAL_API.ON_PAUSE,
        WORTAL_API.ADS_IS_AD_BLOCKED,
        WORTAL_API.ADS_SHOW_INTERSTITIAL,
        WORTAL_API.ADS_SHOW_REWARDED,
        WORTAL_API.CONTEXT_CHOOSE_ASYNC,
        WORTAL_API.CONTEXT_CREATE_ASYNC,
        WORTAL_API.CONTEXT_GET_ID,
        WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC,
        WORTAL_API.CONTEXT_GET_TYPE,
        WORTAL_API.CONTEXT_INVITE_ASYNC,
        WORTAL_API.CONTEXT_IS_SIZE_BETWEEN,
        WORTAL_API.CONTEXT_SHARE_ASYNC,
        WORTAL_API.CONTEXT_SWITCH_ASYNC,
        WORTAL_API.CONTEXT_UPDATE_ASYNC,
        WORTAL_API.IAP_IS_ENABLED,
        WORTAL_API.IAP_GET_CATALOG_ASYNC,
        WORTAL_API.IAP_GET_PURCHASES_ASYNC,
        WORTAL_API.IAP_MAKE_PURCHASE_ASYNC,
        WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC,
        WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC,
        WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
        WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC,
        WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC,
        WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC,
        WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC,
        WORTAL_API.PLAYER_GET_ID,
        WORTAL_API.PLAYER_GET_NAME,
        WORTAL_API.PLAYER_GET_PHOTO,
        WORTAL_API.PLAYER_IS_FIRST_PLAY,
        WORTAL_API.PLAYER_GET_DATA_ASYNC,
        WORTAL_API.PLAYER_SET_DATA_ASYNC,
        WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC,
        WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC,
        WORTAL_API.PLAYER_FLUSH_DATA_ASYNC,
        WORTAL_API.SESSION_GET_LOCALE,
        WORTAL_API.SESSION_GET_PLATFORM,
        WORTAL_API.SESSION_GET_TRAFFIC_SOURCE,
        WORTAL_API.SESSION_GET_DEVICE,
        WORTAL_API.SESSION_GET_ORIENTATION,
        WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
        WORTAL_API.SESSION_GET_ENTRY_POINT_DATA,
        WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC,
        WORTAL_API.SESSION_GAME_LOADING_START,
        WORTAL_API.SESSION_GAME_LOADING_STOP,
        WORTAL_API.SESSION_SET_SESSION_DATA,
    ];
}
