import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { initializationError, notSupported, rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Facebook } from "../../errors/interfaces/facebook-error";
import Wortal from "../../index";
import { debug, info } from "../../utils/logger";
import { CoreBase } from "../core-base";
import { API_URL, SDK_SRC, WORTAL_API } from "../../data/core-data";

/**
 * Facebook implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreFacebook extends CoreBase {
    constructor() {
        super();
    }

    protected authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse> {
        return Promise.reject(notSupported(undefined, WORTAL_API.AUTHENTICATE_ASYNC, API_URL.AUTHENTICATE_ASYNC));
    }

    protected initializeAsyncImpl(): Promise<void> {
        debug(`Initializing SDK for Facebook platform.`);
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
            .catch((error: ErrorMessage_Facebook) => {
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
        return Wortal._internalPlatformSDK.performHapticFeedbackAsync()
            .catch((error: ErrorMessage_Facebook) => {
                rethrowError_Facebook_Rakuten(error, WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC, API_URL.PERFORM_HAPTIC_FEEDBACK_ASYNC);
            });
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
            .catch((error: ErrorMessage_Facebook) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.startGameAsync: ${error.message}`,
                    WORTAL_API.START_GAME_ASYNC,
                    API_URL.START_GAME_ASYNC);
            });
    }

    protected _initializePlatformAsyncImpl(): Promise<void> {
        return new Promise((resolve, reject) => {
            const facebookSDK = document.createElement("script");
            facebookSDK.src = SDK_SRC.FACEBOOK;

            facebookSDK.onload = () => {
                if (typeof FBInstant === "undefined") {
                    reject(initializationError("Failed to load Facebook SDK.", "_initializePlatformAsyncImpl"));
                }

                debug("Facebook platform SDK initialized.");
                Wortal._internalPlatformSDK = FBInstant;
                resolve();
            }

            facebookSDK.onerror = () => {
                reject(initializationError("Failed to load Facebook SDK.", "_initializePlatformAsyncImpl"));
            }

            document.head.appendChild(facebookSDK);
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
                            .catch((error: ErrorMessage_Facebook) => {
                                throw initializationError(`Failed to initialize SDK during platformSDK.startGameAsync: ${error.message}`, `_initializeSDKAsyncImpl()`);
                            });
                    })
                    .catch((error: any) => {
                        throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`, `_initializeSDKAsyncImpl()`);
                    });
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.initializeAsync: ${error.message}`, `_initializeSDKAsyncImpl()`);
            });
    }

    protected _supportedAPIs: string[] = [
        WORTAL_API.INITIALIZE_ASYNC,
        WORTAL_API.START_GAME_ASYNC,
        WORTAL_API.SET_LOADING_PROGRESS,
        WORTAL_API.ON_PAUSE,
        WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC,
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
        WORTAL_API.CONTEXT_SHARE_LINK_ASYNC,
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
        WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC,
        WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC,
        WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC,
        WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC,
        WORTAL_API.PLAYER_GET_ID,
        WORTAL_API.PLAYER_GET_NAME,
        WORTAL_API.PLAYER_GET_PHOTO,
        WORTAL_API.PLAYER_IS_FIRST_PLAY,
        WORTAL_API.PLAYER_GET_DATA_ASYNC,
        WORTAL_API.PLAYER_SET_DATA_ASYNC,
        WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC,
        WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC,
        WORTAL_API.PLAYER_FLUSH_DATA_ASYNC,
        WORTAL_API.PLAYER_GET_ASID_ASYNC,
        WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC,
        WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC,
        WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC,
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
        WORTAL_API.SESSION_SWITCH_GAME_ASYNC,
        WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC,
        WORTAL_API.TOURNAMENT_GET_ALL_ASYNC,
        WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC,
        WORTAL_API.TOURNAMENT_CREATE_ASYNC,
        WORTAL_API.TOURNAMENT_SHARE_ASYNC,
        WORTAL_API.TOURNAMENT_JOIN_ASYNC,
    ];
}
