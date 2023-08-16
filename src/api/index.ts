import * as _ads from './ads';
import * as _analytics from './analytics';
import * as _context from './context';
import * as _iap from './iap';
import * as _leaderboard from './leaderboard';
import * as _notifications from './notifications';
import * as _player from './player';
import * as _session from './session';
import * as _tournament from './tournament';
import { InitializationOptions } from "../interfaces/session";
import SDKConfig from "../utils/config";
import { debug, exception, info } from "../utils/logger";
import { initializationError, invalidParams, notSupported, rethrowPlatformError } from "../utils/error-handler";
import { isValidNumber, isValidString } from "../utils/validators";
import {
    addGameEndEventListener,
    addLoadingListener,
    getParameterByName,
    gdEventTrigger,
    removeLoadingCover,
    tryEnableIAP
} from "../utils/wortal-utils";

// This is the version of the SDK. It is set by the build process.
declare var __VERSION__: string;

// References to the platform SDKs. They are declared here so that we can map these to config.platformSDK
// once they are initialized.

declare const LinkGame: any;
declare const ViberPlay: any;
declare const FBInstant: any;
declare const gdsdk: any;

// URLs for the platform SDKs. They are declared here so that we can use them to load the SDKs when we
// initialize the platforms.

const GOOGLE_SDK_SRC: string = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const LINK_SDK_SRC: string = "https://lg.rgames.jp/libs/link-game-sdk/1.3.0/bundle.js";
const VIBER_SDK_SRC: string = "https://vbrpl.io/libs/viber-play-sdk/1.14.0/bundle.js";
const FB_SDK_SRC: string = "https://connect.facebook.net/en_US/fbinstant.7.1.js";
const GD_SDK_SRC: string = "https://html5.api.gamedistribution.com/main.min.js";

/**
 * Contains the configuration for the SDK. This includes the current session, game state, platform SDK, etc.
 * @hidden
 */
export const config = new SDKConfig();

/** Ads API */
export const ads = _ads;
/** Analytics API */
export const analytics = _analytics;
/** Context API */
export const context = _context;
/** In-app purchase API */
export const iap = _iap;
/** Leaderboard API */
export const leaderboard = _leaderboard;
/** Notifications API */
export const notifications = _notifications;
/** Player API */
export const player = _player;
/** Session API */
export const session = _session;
/** Tournament API */
export const tournament = _tournament;

/**
 * Returns true if the SDK Core has been initialized.
 */
export let isInitialized: boolean = false;

/**
 * Initializes the SDK. This should be called before any other SDK functions. It is recommended to call this
 * as soon as the script has been loaded to shorten the initialization time.
 *
 * NOTE: This is only available if the manual initialization option is set to true. Otherwise, the SDK will initialize automatically.
 *
 * PLATFORM NOTE: Only supported on Viber, Link and Facebook.
 * @example
 * Wortal.initializeAsync().then(() => {
 *    // SDK is ready to use, wait for game to finish loading.
 *    Wortal.setLoadingProgress(100);
 *    Wortal.startGameAsync();
 * });
 * @returns {Promise<void>} Promise that resolves when the SDK initialized successfully.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INITIALIZATION_ERROR</li>
 * <li>NOT_SUPPORTED</li>
 * </ul>
 */
export async function initializeAsync(): Promise<void> {
    if (config.isAutoInit) {
        return Promise.reject(initializationError("SDK is configured to auto initialize. Only call this when manual initialization is enabled.", "initializeAsync"));
    }

    if (config.isInitialized) {
        return Promise.reject(initializationError("SDK already initialized.", "initializeAsync"));
    }

    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform !== "viber" && platform !== "link" && platform !== "facebook") {
            throw notSupported(`initializeAsync not supported on platform: ${platform}`, "initializeAsync");
        }

        debug(`Initializing SDK for ${config.session.platform} platform.`);
        return config.platformSDK.initializeAsync().then(() => {
            config.lateInitialize();
        }).catch((error: any) => {
            throw initializationError(`Failed to initialize SDK: ${error.message}`, "initializeAsync");
        });
    });
}

/**
 * This indicates that the game has finished initial loading and is ready to start. Context information will be
 * up-to-date when the returned promise resolves. The loading screen will be removed after this is called along with
 * the following conditions:
 * <ul>
 * <li>initializeAsync has been called and resolved</li>
 * <li>setLoadingProgress has been called with a value of 100</li>
 * </ul>
 *
 * NOTE: This is only available if the manual initialization option is set to true. Otherwise, the game will start automatically.
 *
 * PLATFORM NOTE: Only supported on Viber, Link and Facebook.
 * @example
 * Wortal.startGameAsync().then(() => {
 *    // Game is rendered to player.
 * });
 * @returns {Promise<void>} Promise that resolves when the game has started successfully.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INITIALIZATION_ERROR</li>
 * <li>NOT_SUPPORTED</li>
 * </ul>
 */
export async function startGameAsync(): Promise<void> {
    if (config.isAutoInit) {
        return Promise.reject(initializationError("SDK is configured to auto initialize. Only call this when manual initialization is enabled.", "startGameAsync"));
    }

    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform !== "viber" && platform !== "link" && platform !== "facebook") {
            throw notSupported(`startGameAsync not supported on platform: ${platform}`, "startGameAsync");
        }

        return config.platformSDK.startGameAsync().then(() => {
            tryEnableIAP();
            analytics._logTrafficSource();
            analytics._logGameStart();

            isInitialized = true;
            window.dispatchEvent(new Event("wortal-sdk-initialized"));

            debug(`SDK initialized for ${config.session.platform} platform.`);
            info("SDK initialization complete.");
        }).catch((error: any) => {
            throw initializationError(`Failed to initialize SDK: ${error.message}`, "startGameAsync");
        });
    });
}

/**
 * Sets the loading progress value for the game. This is required for the game to start. Failure to call this with 100
 * once the game is fully loaded will prevent the game from starting.
 * @example
 * onGameLoadProgress(percent) {
 *     Wortal.setLoadingProgress(percent);
 * }
 *
 * onGameLoaded() {
 *     Wortal.setLoadingProgress(100);
 * }
 * @param value Percentage of loading complete. Range is 0 to 100.
 */
export function setLoadingProgress(value: number): void {
    const platform = config.session.platform;
    if (!isValidNumber(value) || value < 0 || value > 100) {
        throw invalidParams("value must be a number between 0 and 100.", "setLoadingProgress");
    }

    if (platform === "link" || platform === "viber" || platform === "facebook") {
        if (config.platformSDK) {
            debug(`Setting loading progress to: ${value}`);
            config.platformSDK.setLoadingProgress(value);
        }
    }
}

/**
 * Sets a callback which will be invoked when the app is brought to the background.
 * @param callback Callback to invoke.
 */
export function onPause(callback: Function): void {
    if (typeof callback !== "function") {
        throw invalidParams("callback needs to be a function.", "onPause");
    }

    const platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        if (config.platformSDK) {
            config.platformSDK.onPause(() => {
                debug("onPause callback invoked.");
                callback();
            });
        }
    }
}

/**
 * Requests and performs haptic feedback on supported devices.
 * @returns {Promise<void>} Haptic feedback requested successfully
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * <li>INVALID_OPERATION</li>
 * </ul>
 */
export function performHapticFeedbackAsync(): Promise<void> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform !== "facebook") {
            throw notSupported(`Haptic feedback not supported on platform: ${platform}`, "performHapticFeedbackAsync");
        }

        return config.platformSDK.performHapticFeedbackAsync()
            .catch((error: any) => {
                rethrowPlatformError(error, "performHapticFeedbackAsync");
            });
    });
}

/**
 * Gets the supported APIs for the current platform.
 * @example
 * const supportedAPIs = Wortal.getSupportedAPIs();
 * if (supportedAPIs.includes("context.shareAsync")) {
 *    shareWithFriendsDialog.show();
 * }
 * @returns {string[]} Array of supported APIs.
 */
export function getSupportedAPIs(): string[] {
    return config._supportedAPIs[config.session.platform];
}

/**
 * Initializes the SDK. This should be called as soon as the script has been loaded and any configuration options
 * have been set. This will first initialize the SDK config which determines which platform the game is running on.
 * Next it will initialize the platform's SDK. Finally, it will initialize the SDK Core. It's important that this
 * process happens in this sequence as the SDK Core initialization may depend on the platform SDK being initialized to
 * access its APIs.
 * @param {InitializationOptions} options Initialization options. This can include options for debugging and testing
 * or to override the SDK initialization process and allow for manual initialization when the game is ready.
 * @returns {Promise<void>} Promise that resolves when the SDK initialized successfully. This will return before all
 * systems have finished initializing due to the asynchronous nature of the initialization process and the need
 * for late initialization of some systems that rely on the platform SDK being initialized.
 * @hidden
 * @private
 * */
export async function _initializeInternal(options: InitializationOptions): Promise<void> {
    if (config.isInitialized) {
        return Promise.reject(initializationError("SDK already initialized.", "_initializeInternal"));
    }

    info("Initializing SDK " + __VERSION__);
    addLoadingListener();
    addGameEndEventListener();

    const platform = config.session.platform;
    _initializePlatform().then(showAds => {
        debug("Platform: " + platform);
        if (options.autoInitialize === false) {
            config.isAutoInit = false;
            debug("Manual initialization requested. Platform initialization finished, awaiting manual initialization..");
            return Promise.resolve();
        }

        if (showAds) {
            return _initializeSDK().then(() => {
                analytics._logGameStart();
                isInitialized = true;
                window.dispatchEvent(new Event("wortal-sdk-initialized"));
                info("SDK initialization complete.");
            });
        } else {
            return _initializeSDK_AdBlocked().then(() => {
                analytics._logGameStart();
                isInitialized = true;
                window.dispatchEvent(new Event("wortal-sdk-initialized"));
                info("SDK initialization complete.");
            });
        }
    }).catch((error) => {
        // We don't reject here because this might be a recoverable error. We'll try to initialize the SDK in debug
        // mode and if that fails then we'll reject.
        exception("Failed to initialize platform SDK: " + error.message);
        return _initializeSDK_Debug();
    });
}

/**
 * Initializes the platform SDK for the current platform. This is called after the SDK config has been initialized and
 * before the SDK initialization.
 * @returns {Promise<boolean>} True if no ad blocker was detected, otherwise false. As of v1.6 this is only ever false
 * for the Wortal platform.
 * @hidden
 * @private
 */
function _initializePlatform(): Promise<boolean> {
    const platform = config.session.platform;
    switch (platform) {
        case "wortal":
            return _initializePlatform_Wortal();
        case "link":
            return _initializePlatform_Link();
        case "viber":
            return _initializePlatform_Viber();
        case "facebook":
            return _initializePlatform_Facebook();
        case "gd":
            return _initializePlatform_GD();
        case "debug":
        //TODO: Add debug platform initialization
        default:
            return Promise.resolve(true);
    }
}

/**
 * Initializes the Wortal platform. This relies on Google AdSense to serve ads.
 * @returns {Promise<boolean>} Promise that resolves to true if no ad blocker was detected, otherwise false.
 * @hidden
 * @private
 */
function _initializePlatform_Wortal(): Promise<boolean> {
    debug("Initializing Wortal platform SDK.");
    return new Promise((resolve, reject) => {
        //TODO: cache these params as some are needed later for ad calls
        const metaElement = document.createElement("meta");
        const googleAdsSDK = document.createElement("script");
        const clientIdParam = getParameterByName("clientid");
        const debugParam = getParameterByName("debug");
        const hostChannelIdParam = getParameterByName("channelid");
        const hostIdParam = getParameterByName("hostid");
        const frequencyCapParam = `${getParameterByName("freqcap") || 30}s`;
        (window as any).wortalSessionId = getParameterByName('sessid') ?? "";

        if (!isValidString(clientIdParam)) {
            reject(initializationError("Configuration \"clientid\" missing.", "_initializePlatform_Wortal()"));
        }

        if (debugParam === "true") {
            googleAdsSDK.setAttribute("data-ad-client", "ca-pub-123456789");
            googleAdsSDK.setAttribute("data-adbreak-test", "on");
        } else {
            googleAdsSDK.setAttribute("data-ad-host", hostIdParam ?? "");
            googleAdsSDK.setAttribute("data-ad-client", clientIdParam!);
            googleAdsSDK.setAttribute("data-ad-frequency-hint", frequencyCapParam);
            hostChannelIdParam ? googleAdsSDK.setAttribute("data-ad-host-channel", hostChannelIdParam) : null;
        }

        googleAdsSDK.setAttribute("src", GOOGLE_SDK_SRC);
        googleAdsSDK.setAttribute("type", "text/javascript");

        metaElement.setAttribute("name", "google-adsense-platform-account");
        metaElement.setAttribute("content", hostIdParam!);

        googleAdsSDK.onload = () => {
            debug("Wortal platform SDK initialized with ads.");
            resolve(true);
        }

        // This is a case where an ad blocker has prevented the Google Ads script from loading. We don't want to fail
        // the initialization call, so we resolve false to indicate that ads should not be shown. This is a workaround
        // to allow games to still be playable with an ad blocker until we can find a better solution for circumventing
        // ad blockers.
        // Ideally we would just set adConfig.isAdBlocked = true, but adConfig is not constructed until after the
        // platform SDK is initialized, so we need to just pass the result from here and set it later.
        //TODO: find a workaround for ad blockers on Wortal
        googleAdsSDK.onerror = () => {
            debug("Wortal platform SDK initialized without ads.");
            resolve(false);
        };

        document.head.appendChild(metaElement);
        document.head.appendChild(googleAdsSDK);
    });
}

/**
 * Initializes the Link platform. This relies on Rakuten Games' Link SDK.
 * @returns {Promise<boolean>} Promise that always resolves to true as Link is not affected by ad blockers.
 * @hidden
 * @private
 */
function _initializePlatform_Link(): Promise<boolean> {
    debug("Initializing Link platform SDK.");
    return new Promise((resolve, reject) => {
        const linkSDK = document.createElement("script");
        linkSDK.src = LINK_SDK_SRC;

        linkSDK.onload = () => {
            if (typeof LinkGame === "undefined") {
                reject(initializationError("Failed to load Link SDK.", "_initializePlatform_Link()"));
            }

            debug("Link platform SDK initialized.");
            config.platformSDK = LinkGame;
            resolve(true);
        }

        linkSDK.onerror = () => {
            reject(initializationError("Failed to load Link SDK.", "_initializePlatform_Link()"));
        }

        document.head.appendChild(linkSDK);
    });
}

/**
 * Initializes the Viber platform. This relies on Rakuten Games' Viber SDK.
 * @returns {Promise<boolean>} Promise that always resolves to true as Viber is not affected by ad blockers.
 * @hidden
 * @private
 */
function _initializePlatform_Viber(): Promise<boolean> {
    debug("Initializing Viber platform SDK.");
    return new Promise((resolve, reject) => {
        const viberSDK = document.createElement("script");
        viberSDK.src = VIBER_SDK_SRC;

        viberSDK.onload = () => {
            if (typeof ViberPlay === "undefined") {
                reject(initializationError("Failed to load Viber SDK.", "_initializePlatform_Viber()"));
            }

            debug("Viber platform SDK initialized.");
            config.platformSDK = ViberPlay;
            resolve(true);
        }

        viberSDK.onerror = () => {
            reject(initializationError("Failed to load Viber SDK.", "_initializePlatform_Viber()"));
        }

        document.head.appendChild(viberSDK);
    });
}

/**
 * Initializes the Facebook platform. This relies on Facebook's Instant Games SDK.
 * @returns {Promise<boolean>} Promise that always resolves to true as Facebook is not affected by ad blockers.
 * @hidden
 * @private
 */
function _initializePlatform_Facebook(): Promise<boolean> {
    debug("Initializing Facebook platform SDK.");
    return new Promise((resolve, reject) => {
        const facebookSDK = document.createElement("script");
        facebookSDK.src = FB_SDK_SRC;

        facebookSDK.onload = () => {
            if (typeof FBInstant === "undefined") {
                reject(initializationError("Failed to load Facebook SDK.", "_initializePlatform_Facebook()"));
            }

            debug("Facebook platform SDK initialized.");
            config.platformSDK = FBInstant;
            resolve(true);
        }

        facebookSDK.onerror = () => {
            reject(initializationError("Failed to load Facebook SDK.", "_initializePlatform_Facebook()"));
        }

        document.head.appendChild(facebookSDK);
    });
}

/**
 * Initializes the Game Distribution platform. This relies on Game Distribution's SDK. The GD SDK works a little
 * differently from the others in that it relies heavily on window-based events to communicate with the game.
 * @param options {any} Options to pass to the GD SDK.
 * @returns {Promise<boolean>} Promise that always resolves to true as Game Distribution is not affected by ad blockers.
 * @hidden
 * @private
 */
function _initializePlatform_GD(options?: any): Promise<boolean> {
    debug("Initializing Game Distribution platform SDK.");
    // GD SDK docs assign this ID to their SDK script, so we'll do the same as it might be important.
    // See: https://gamedistribution.com/sdk/html5
    const id = "gamedistribution-jssdk";

    return new Promise((resolve, reject) => {
        // GD SDK requires an options object to be set in the window. The onEvent property is where we can listen for
        // their SDK events. We use this to map their events to our own callbacks.
        (window as any).GD_OPTIONS = {
            gameId: config.session.gameId,
            onEvent: (event: any) => {
                gdEventTrigger(event.name);
            },
            ...options,
        };

        // Check for an existing GD SDK script tag. If it exists, we can just use that. Otherwise, we need to create it.
        let gdSDK, firstScript = document.getElementsByTagName("script")[0];
        if (document.getElementById(id)) {
            if (typeof gdsdk === "undefined") {
                reject(initializationError("Failed to load Game Distribution SDK.", "_initializePlatform_GD()"));
            }

            debug("Game Distribution platform SDK initialized.");
            config.platformSDK = gdsdk;
            resolve(true);
        } else {
            gdSDK = document.createElement("script");
            gdSDK.src = GD_SDK_SRC;
            gdSDK.id = id;
            firstScript.parentNode?.insertBefore(gdSDK, firstScript);

            gdSDK.onload = function () {
                if (typeof gdsdk === "undefined") {
                    reject(initializationError("Failed to load Game Distribution SDK.", "_initializePlatform_GD()"));
                }

                debug("Game Distribution platform SDK initialized.");
                config.platformSDK = gdsdk;
                resolve(true);
            }

            gdSDK.onerror = () => {
                reject(initializationError("Failed to load Game Distribution SDK.", "_initializePlatform_GD()"));
            }
        }
    });
}

/**
 * Initializes the Wortal SDK. This is called after the platform has been initialized.
 * @hidden
 * @private
 */
function _initializeSDK(): Promise<void> {
    const platform = config.session.platform;
    switch (platform) {
        case "wortal":
        case "gd":
            return _initializeSDK_WortalGD();
        case "link":
        case "viber":
        case "facebook":
            return _initializeSDK_RakutenFacebook();
        default:
            return _initializeSDK_Debug();
    }
}

/**
 * Initializes the SDK for the Link, Viber and Facebook platforms. These platforms do not support pre-roll ads currently.
 * They also provide their own splash screen for loading, so we do not add a loading cover. We must first call
 * initializeAsync, report loading progress up to 100, then startGameAsync to start the game.
 * @hidden
 * @private
 */
function _initializeSDK_RakutenFacebook(): Promise<void> {
    debug(`Initializing SDK for ${config.session.platform} platform.`);
    return config.platformSDK.initializeAsync().then(() => {
        config.lateInitialize();
        return config.platformSDK.startGameAsync().then(() => {
            tryEnableIAP();
            analytics._logTrafficSource();
            debug(`SDK initialized for ${config.session.platform} platform.`);
        }).catch((error: any) => {
            throw initializationError(`Failed to initialize SDK: ${error.message}`, "_initializeSDK_RakutenFacebook()");
        });
    }).catch((error: any) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`, "_initializeSDK_RakutenFacebook()");
    });
}

/**
 * Initializes the SDK for the Wortal and GD platforms. These platforms support pre-roll ads, so we show one and then
 * remove the loading cover once it is complete.
 * @hidden
 * @private
 */
function _initializeSDK_WortalGD(): Promise<void> {
    debug(`Initializing SDK for ${config.session.platform} platform.`);
    return Promise.resolve().then(() => {
        config.lateInitialize();
        config.adConfig.adCalled();
        debug("Showing pre-roll ad.");
        ads.showInterstitial("preroll", "Preroll",
            () => {
            },
            () => {
                config.adConfig.setPrerollShown(true);
                config.adConfig.adShown();
                removeLoadingCover();
                tryEnableIAP();
                debug(`SDK initialized for ${config.session.platform} platform.`);
            });
    }).catch((error) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`, "_initializeSDK_WortalGD()");
    });
}

/**
 * Initializes the SDK for the debugging.
 * @hidden
 * @private
 */
function _initializeSDK_Debug(): Promise<void> {
    debug("Initializing SDK for debugging.");
    return Promise.resolve().then(() => {
        config.lateInitialize();
        removeLoadingCover();
        debug("SDK initialized for debugging.");
    }).catch((error) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`, "_initializeSDK_Debug()");
    });
}

/**
 * Initializes the SDK for the ad blocked case. This is used when the game is running in a browser with an ad blocker
 * enabled. We currently do not show any ads in this case.
 * @hidden
 * @private
 */
function _initializeSDK_AdBlocked(): Promise<void> {
    debug("Initializing SDK for ad blocker.");
    return Promise.resolve().then(() => {
        config.lateInitialize();
        config.adConfig.setAdBlocked(true);
        removeLoadingCover();
        tryEnableIAP();
        debug("SDK initialized for ad blocker.");
    }).catch((error) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`, "_initializeSDK_AdBlocked()");
    });
}
