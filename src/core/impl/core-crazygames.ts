import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { AuthResponse_CrazyGames } from "../../auth/interfaces/crazygames-auth";
import { initializationError, notSupported, rethrowError_CrazyGames } from "../../errors/error-handler";
import { Error_CrazyGames } from "../../errors/types/crazygames-error-types";
import Wortal from "../../index";
import { CrazyGamesPlayer } from "../../player/classes/crazygames-player";
import { ICrazyGamesPlayer } from "../../player/interfaces/crazygames-player";
import { debug, exception } from "../../utils/logger";
import { onPauseFunctions } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";
import { API_URL, SDK_SRC, WORTAL_API } from "../../data/core-data";

/**
 * CrazyGames implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreCrazyGames extends CoreBase {
    constructor() {
        super();
    }

    protected authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse> {
        return new Promise((resolve, reject) => {
            const callback = (error: Error_CrazyGames, user: ICrazyGamesPlayer) => {
                if (error) {
                    reject(rethrowError_CrazyGames(error, WORTAL_API.AUTHENTICATE_ASYNC, API_URL.AUTHENTICATE_ASYNC));
                } else {
                    debug("Crazy Games user authenticated: ", user);
                    Wortal.player._internalPlayer = new CrazyGamesPlayer(user);

                    const response: AuthResponse = {
                        status: "success",
                    };

                    resolve(response);
                }
            };

            Wortal._internalPlatformSDK.user.showAuthPrompt(callback);
        });
    }

    protected initializeAsyncImpl(): Promise<void> {
        return this.defaultInitializeAsyncImpl();
    }

    protected linkAccountAsyncImpl(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const callback = (error: Error_CrazyGames, response: AuthResponse_CrazyGames) => {
                if (error) {
                    reject(rethrowError_CrazyGames(error, WORTAL_API.LINK_ACCOUNT_ASYNC, API_URL.LINK_ACCOUNT_ASYNC));
                } else {
                    if (response.response === "yes") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            };

            Wortal._internalPlatformSDK.user.showAccountLinkPrompt(callback);
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

            crazyGamesSDK.onload = () => {
                if (typeof window.CrazyGames.SDK === "undefined") {
                    reject(initializationError("Failed to load Crazy Games SDK.", "_initializePlatformAsyncImpl"));
                }

                debug("Crazy Games platform SDK loaded.");
                Wortal._internalPlatformSDK = window.CrazyGames.SDK;

                const callback = (error: Error_CrazyGames, result: any) => {
                    if (error) {
                        // Don't reject here because not being able to check for adblock shouldn't prevent the SDK from working.
                        exception(error);
                        resolve();
                    } else {
                        // This seems to always return false as of v1.6.9. We still guard against this when we show ads
                        // as the CrazyGames SDK will return the adError callback, which triggers our noFill callback.
                        debug("CrazyGames adblock check complete.", result);
                        Wortal.ads._internalAdConfig.setAdBlocked(result);
                        resolve();
                    }
                };

                Wortal._internalPlatformSDK.ad.hasAdblock(callback);
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
