import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { initializationError, notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { addExternalCallback, externalSDKEventTrigger, onPauseFunctions } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";
import { API_URL, GD_GAME_MONETIZE_API, SDK_SRC, WORTAL_API } from "../../data/core-data";

/**
 * Game Distribution (GD) implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreGD extends CoreBase {
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
        // GD SDK docs assign this ID to their SDK script, so we'll do the same as it might be important.
        // See: https://gamedistribution.com/sdk/html5
        const id = "gamedistribution-jssdk";

        return new Promise((resolve, reject) => {
            window.GD_OPTIONS = {
                gameId: this._getPlatformGameID(),
                onEvent: (event: () => void) => {
                    externalSDKEventTrigger(event.name);
                },
            };

            // Check for an existing GD SDK script tag. If it exists, we can just use that. Otherwise, we need to create it.
            let gdSDK = document.getElementsByTagName("script")[0];
            const firstScript = document.getElementsByTagName("script")[0];
            if (document.getElementById(id)) {
                if (typeof gdsdk === "undefined") {
                    reject(initializationError("Failed to load Game Distribution SDK.", "_initializePlatformAsyncImpl"));
                }

                Wortal._log.debug("Game Distribution platform SDK initialized.");
                Wortal._internalPlatformSDK = gdsdk;
                resolve();
            } else {
                gdSDK = document.createElement("script");
                gdSDK.src = SDK_SRC.GD;
                gdSDK.id = id;
                firstScript.parentNode?.insertBefore(gdSDK, firstScript);

                gdSDK.onload = () => {
                    if (typeof gdsdk === "undefined") {
                        reject(initializationError("Failed to load Game Distribution SDK.", "_initializePlatformAsyncImpl"));
                    }

                    Wortal._internalPlatformSDK = gdsdk;
                    addExternalCallback(GD_GAME_MONETIZE_API.SDK_READY, () => {
                        Wortal._log.debug("Game Distribution platform SDK initialized.");
                        resolve();
                    });
                }

                gdSDK.onerror = () => {
                    reject(initializationError("Failed to load Game Distribution SDK.", "_initializePlatformAsyncImpl"));
                }
            }
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
    ];

    private _getPlatformGameID(): string {
        // Example URL: https://revision.gamedistribution.com/b712105e1fff4bceb87667522d798f97
        // ID: b712105e1fff4bceb87667522d798f97
        const url = document.URL.split("/");
        const id = url[3];
        Wortal._log.debug("Initializing Game Distribution SDK with game ID: " + id);
        return id;
    }

}
