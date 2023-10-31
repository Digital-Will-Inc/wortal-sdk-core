import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { debug, exception } from "../../utils/logger";
import { onPauseFunctions, waitForTelegramCallback } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";
import { API_URL, TELEGRAM_API, WORTAL_API } from "../../data/core-data";

/**
 * Telegram implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreTelegram extends CoreBase {
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
        window.parent.postMessage({playdeck: {method: "loading", value: progress}}, "*");
    }

    protected startGameAsyncImpl(): Promise<void> {
        return this.defaultStartGameAsyncImpl();
    }

    protected _initializePlatformAsyncImpl(): Promise<void> {
        return Promise.resolve().then(() => {
            // This is just to check if we can successfully communicate with the Telegram SDK as it exists in the wrapper
            // the game is rendered in.
            // Also, getLocale requires a callback on Telegram and session.getLocale is synchronous,
            // so we can grab it here and cache it for later use as it likely won't change during the session.
            window.parent.postMessage({playdeck: {method: TELEGRAM_API.GET_LOCALE}}, "*");
            return waitForTelegramCallback(TELEGRAM_API.GET_LOCALE)
                .then((locale: string) => {
                    //TODO: remove this when Telegram ads are implemented
                    Wortal.ads._internalAdConfig.setAdBlocked(true);
                    Wortal.session._internalSession.locale = locale;
                    debug("Telegram platform SDK loaded.");
                })
                .catch((error) => {
                    exception("Failed to fetch user locale.", error);
                });
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
        WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
        WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC,
        WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC,
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
