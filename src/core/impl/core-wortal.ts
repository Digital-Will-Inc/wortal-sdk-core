import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { initializationError, notSupported } from "../../errors/error-handler";
import { debug, warn } from "../../utils/logger";
import { isValidString } from "../../utils/validators";
import { getParameterByName, onPauseFunctions, removeLoadingCover } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";
import { API_URL, SDK_SRC, WORTAL_API } from "../../data/core-data";

/**
 * Wortal implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreWortal extends CoreBase {
    constructor() {
        super();
    }

    protected authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse> {
        throw notSupported(undefined, WORTAL_API.AUTHENTICATE_ASYNC);
    }

    protected initializeAsyncImpl(): Promise<void> {
        return this.defaultInitializeAsyncImpl();
    }

    protected linkAccountAsyncImpl(): Promise<boolean> {
        throw notSupported(undefined, WORTAL_API.LINK_ACCOUNT_ASYNC);
    }

    protected onPauseImpl(callback: () => void): void {
        onPauseFunctions.push(callback);
    }

    protected performHapticFeedbackAsyncImpl(): Promise<void> {
        throw notSupported(undefined, WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC, API_URL.PERFORM_HAPTIC_FEEDBACK_ASYNC);
    }

    protected setLoadingProgressImpl(progress: number): void {
        return;
    }

    protected startGameAsyncImpl(): Promise<void> {
        return this.defaultStartGameAsyncImpl();
    }

    protected _initializePlatformAsyncImpl(): Promise<void> {
        const functionName = "_initializePlatformAsyncImpl";
        return new Promise((resolve, reject) => {
            const metaElement = document.createElement("meta");
            const googleAdsSDK = document.createElement("script");

            const clientIdParam = getParameterByName("clientid");
            const hostIdParam = getParameterByName("hostid");
            const channelIdParam = getParameterByName("channelid");

            if (!isValidString(clientIdParam)) {
                reject(initializationError("Configuration \"clientid\" missing.", functionName));
            }

            // We don't reject these because they are likely not present in the test environment.
            if (!isValidString(hostIdParam)) {
                warn("Configuration \"hostid\" missing. Using default value. If testing in the Wortal dashboard than this can be safely ignored.");
            }

            if (!isValidString(channelIdParam)) {
                warn("Configuration \"channelid\" missing. Using default value. If testing in the Wortal dashboard than this can be safely ignored.");
            }

            window.Wortal.ads._internalAdConfig.setClientID(clientIdParam!);
            window.Wortal.ads._internalAdConfig.setHostID(hostIdParam || "");
            window.Wortal.ads._internalAdConfig.setChannelID(channelIdParam || "");

            const debugParam = getParameterByName("debug");
            const frequencyCapParam = `${getParameterByName("freqcap") || 30}s`;
            //TODO: deprecate this when player persistence is implemented
            window.wortalSessionId = getParameterByName('sessid') ?? "";

            if (debugParam === "true") {
                googleAdsSDK.setAttribute("data-ad-client", "ca-pub-123456789");
                googleAdsSDK.setAttribute("data-adbreak-test", "on");
            } else {
                googleAdsSDK.setAttribute("data-ad-host", window.Wortal.ads._internalAdConfig.hostID);
                googleAdsSDK.setAttribute("data-ad-client", window.Wortal.ads._internalAdConfig.clientID);
                googleAdsSDK.setAttribute("data-ad-host-channel", window.Wortal.ads._internalAdConfig.channelID);
                googleAdsSDK.setAttribute("data-ad-frequency-hint", frequencyCapParam);
            }

            googleAdsSDK.setAttribute("src", SDK_SRC.GOOGLE);
            googleAdsSDK.setAttribute("type", "text/javascript");

            metaElement.setAttribute("name", "google-adsense-platform-account");
            metaElement.setAttribute("content", window.Wortal.ads._internalAdConfig.hostID);

            googleAdsSDK.onload = () => {
                debug("Wortal platform SDK initialized with ads.");
                resolve();
            }

            //TODO: find a workaround for ad blockers on Wortal
            googleAdsSDK.onerror = () => {
                debug("Ad blocker detected. Wortal platform SDK initialized without ads.");
                window.Wortal.ads._internalAdConfig.setAdBlocked(true);
                resolve();
            };

            document.head.appendChild(metaElement);
            document.head.appendChild(googleAdsSDK);
        });
    }

    protected _initializeSDKAsyncImpl(): Promise<void> {
        return Promise.all([window.Wortal.ads._internalAdConfig.initialize(), window.Wortal.player._internalPlayer.initialize()])
            .then(() => {
                window.Wortal.iap._internalTryEnableIAP();
                debug(`SDK initialized for ${window.Wortal._internalPlatform} platform.`);

                if (window.Wortal.ads._internalAdConfig.isAdBlocked) {
                    removeLoadingCover();
                    return;
                }

                debug("Showing pre-roll ad.");
                window.Wortal.ads.showInterstitial("preroll", "Preroll",
                    () => {
                        window.Wortal.ads._internalAdConfig.adCalled();
                    },
                    () => {
                        window.Wortal.ads._internalAdConfig.setPrerollShown(true);
                        window.Wortal.ads._internalAdConfig.adShown();
                        removeLoadingCover();
                    });
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
