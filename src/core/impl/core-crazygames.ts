import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { initializationError, notSupported, rethrowError_CrazyGames } from "../../errors/error-handler";
import Wortal from "../../index";
import { CrazyGamesPlayer } from "../../player/classes/crazygames-player";
import { onPauseFunctions } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";
import { API_URL, SDK_SRC, WORTAL_API } from "../../data/core-data";

/**
 * CrazyGames implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreCrazyGames extends CoreBase {
    protected authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await Wortal._internalPlatformSDK.user.showAuthPrompt();
                Wortal._log.debug("Crazy Games user authenticated: ", user);
                Wortal.player._internalPlayer = new CrazyGamesPlayer(user);

                const response: AuthResponse = {
                    status: "success",
                };

                resolve(response);
            } catch (error: any) {
                reject(rethrowError_CrazyGames(error, WORTAL_API.AUTHENTICATE_ASYNC, API_URL.AUTHENTICATE_ASYNC));
            }
        });
    }

    protected initializeAsyncImpl(): Promise<void> {
        return this.defaultInitializeAsyncImpl();
    }

    protected linkAccountAsyncImpl(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await Wortal._internalPlatformSDK.user.showAccountLinkPrompt();
                if (response.response === "yes") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error: any) {
                reject(rethrowError_CrazyGames(error, WORTAL_API.LINK_ACCOUNT_ASYNC, API_URL.LINK_ACCOUNT_ASYNC));
            }
        });
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
            const crazyGamesSDK = document.createElement("script");
            crazyGamesSDK.src = SDK_SRC.CRAZY_GAMES;

            // Need better place to init this for other platforms
            var xsollaPayStation = document.createElement('script');
            xsollaPayStation.type = "text/javascript";
            xsollaPayStation.src = SDK_SRC.XSOLLA_PAY_STATION;
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(xsollaPayStation);

            xsollaPayStation.addEventListener('load', function (e) {
                Wortal.iap._payStationWidget = window.XPayStationWidget;
            }, false);

            crazyGamesSDK.onload = async () => {
                if (typeof window.CrazyGames.SDK === "undefined") {
                    reject(initializationError("Failed to load Crazy Games SDK.", "_initializePlatformAsyncImpl"));
                }
                
                Wortal._log.debug("Crazy Games platform SDK loaded.");
                await (window.CrazyGames.SDK as any).init();
                Wortal._internalPlatformSDK = window.CrazyGames.SDK;
                try {
                    const result = await Wortal._internalPlatformSDK.ad.hasAdblock();
                    Wortal._log.debug("CrazyGames adblock check complete.", result);
                    Wortal.ads._internalAdConfig.setAdBlocked(result);
                } catch (error: any) {
                    Wortal._log.exception(error);
                }
                
                resolve();
            }

            crazyGamesSDK.onerror = () => {
                reject(initializationError("Failed to load Crazy Games SDK.", "_initializePlatformAsyncImpl"));
            }

            document.head.appendChild(crazyGamesSDK);
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
        WORTAL_API.AUTHENTICATE_ASYNC,
        WORTAL_API.LINK_ACCOUNT_ASYNC,
        WORTAL_API.SET_LOADING_PROGRESS,
        WORTAL_API.ADS_IS_AD_BLOCKED,
        WORTAL_API.ADS_SHOW_INTERSTITIAL,
        WORTAL_API.ADS_SHOW_REWARDED,
        WORTAL_API.CONTEXT_SHARE_LINK_ASYNC,
        WORTAL_API.IAP_IS_ENABLED,
        WORTAL_API.PLAYER_GET_ID,
        WORTAL_API.PLAYER_GET_NAME,
        WORTAL_API.PLAYER_GET_PHOTO,
        WORTAL_API.PLAYER_IS_FIRST_PLAY,
        WORTAL_API.PLAYER_GET_DATA_ASYNC,
        WORTAL_API.PLAYER_SET_DATA_ASYNC,
        WORTAL_API.PLAYER_GET_TOKEN_ASYNC,
        WORTAL_API.PLAYER_ON_LOGIN,
        WORTAL_API.SESSION_GET_LOCALE,
        WORTAL_API.SESSION_GET_PLATFORM,
        WORTAL_API.SESSION_GET_DEVICE,
        WORTAL_API.SESSION_GET_ORIENTATION,
        WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
        WORTAL_API.SESSION_GAME_LOADING_START,
        WORTAL_API.SESSION_GAME_LOADING_STOP,
        WORTAL_API.SESSION_HAPPY_TIME,
        WORTAL_API.SESSION_GAMEPLAY_START,
        WORTAL_API.SESSION_GAMEPLAY_STOP,
    ];
}
