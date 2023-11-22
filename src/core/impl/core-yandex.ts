import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { API_URL, SDK_SRC, WORTAL_API } from "../../data/core-data";
import { initializationError, notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { onPauseFunctions, removeLoadingCover } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";
import { YandexSDK } from "../interfaces/yandex-sdk";

/**
 * Yandex implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreYandex extends CoreBase {
    protected authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse> {
        return Wortal._internalPlatformSDK.auth.openAuthDialog()
            .then(() => {
                return { success: true };
            })
            .catch((error: Error) => {
                return { success: false, error: error.message };
            });
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
        Wortal._internalPlatformSDK.features.LoadingAPI?.ready();
        Wortal.analytics._logGameStart();
        return Promise.resolve();
    }

    protected _initializePlatformAsyncImpl(): Promise<void> {
        return new Promise((resolve, reject) => {
            const yandexSDK = document.createElement("script");
            yandexSDK.src = SDK_SRC.YANDEX;

            yandexSDK.onload = () => {
                YaGames.init()
                    .then((ysdk: YandexSDK) => {
                        if (typeof ysdk === "undefined") {
                            reject(initializationError("Failed to load Yandex SDK.", "_initializePlatformAsyncImpl"));
                        }

                        // We don't access the window object ourselves in the SDK, so we may not need this. But it's
                        // possible the Yandex SDK does, so we'll set it just in case until we test it.
                        //TODO: check if this window object is needed or not, remove if not
                        Wortal._log.debug("Yandex platform SDK loaded.");
                        window.ysdk = ysdk;
                        Wortal._internalPlatformSDK = ysdk;
                        resolve();
                    })
                    .catch((error: Error) => {
                        reject(initializationError(error.message, "_initializePlatformAsyncImpl"));
                    });
            }

            yandexSDK.onerror = () => {
                reject(initializationError("Failed to load Yandex SDK.", "_initializePlatformAsyncImpl"));
            }

            document.head.appendChild(yandexSDK);
        });
    }

    protected _initializeSDKAsyncImpl(): Promise<void> {
        return Promise.all([Wortal.ads._internalAdConfig.initialize(), Wortal.player._internalPlayer.initialize()])
            .then(() => {
                Wortal.ads._internalAdConfig.setPrerollShown(true);
                Wortal.iap._internalTryEnableIAP();
                removeLoadingCover();
                Wortal._internalPlatformSDK.features.LoadingAPI?.ready();
                Wortal._log.debug(`SDK initialized for ${Wortal._internalPlatform} platform.`);
            })
            .catch((error: any) => {
                throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`, `_initializeSDKAsyncImpl`);
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
    ];

}
