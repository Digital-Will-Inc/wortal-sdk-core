import { APIEndpoints, GD_EVENTS } from "../types/wortal";
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
import {
    initializationError,
    invalidParams,
    notSupported,
    operationFailed,
    rethrowPlatformError
} from "../utils/error-handler";
import { isValidNumber, isValidString } from "../utils/validators";
import {
    addGameEndEventListener,
    addLoadingListener,
    getParameterByName,
    gdEventTrigger,
    removeLoadingCover,
    tryEnableIAP,
    addGDCallback
} from "../utils/wortal-utils";

// This is the version of the SDK. It is set by the build process.
declare const __VERSION__: string;

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
    if (!config.isPlatformInitialized) {
        debug("Platform not initialized yet, awaiting platform initialization..");
        await _delayUntilPlatformInitialized();
    }

    if (config.isAutoInit) {
        return Promise.reject(initializationError("SDK is configured to auto initialize. Only call this when manual initialization is enabled.",
            "initializeAsync",
            "https://sdk.html5gameportal.com/api/wortal/#initializeasync"));
    }

    if (config.isInitialized) {
        return Promise.reject(initializationError("SDK already initialized.",
            "initializeAsync",
            "https://sdk.html5gameportal.com/api/wortal/#initializeasync"));
    }

    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "viber" || platform === "link" || platform === "facebook") {
            debug(`Initializing SDK for ${platform} platform.`);
            return config.platformSDK.initializeAsync().then(() => {
                tryEnableIAP();
                return config.lateInitialize().then(() => {
                    isInitialized = true;
                    window.dispatchEvent(new Event("wortal-sdk-initialized"));

                    debug(`SDK initialized for ${config.session.platform} platform.`);
                    info("SDK initialization complete.");
                }).catch((error) => {
                    throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`,
                        "initializeAsync",
                        "https://sdk.html5gameportal.com/api/wortal/#initializeasync");
                })
            }).catch((error: any) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.initializeAsync: ${error.message}`,
                    "initializeAsync",
                    "https://sdk.html5gameportal.com/api/wortal/#initializeasync");
            });
        } else {
            if (!config.adConfig.isAdBlocked) {
                return _initializeSDK().then(() => {
                    analytics._logGameStart();

                    isInitialized = true;
                    window.dispatchEvent(new Event("wortal-sdk-initialized"));

                    debug(`SDK initialized for ${config.session.platform} platform.`);
                    info("SDK initialization complete.");
                });
            } else {
                return _initializeSDK_AdBlocked().then(() => {
                    analytics._logGameStart();

                    isInitialized = true;
                    window.dispatchEvent(new Event("wortal-sdk-initialized"));

                    debug(`SDK initialized for ${config.session.platform} platform.`);
                    info("SDK initialization complete.");
                });
            }
        }
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
        return Promise.reject(initializationError("SDK is configured to auto initialize. Only call this when manual initialization is enabled.",
            "startGameAsync",
            "https://sdk.html5gameportal.com/api/wortal/#startgameasync"));
    }

    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "viber" || platform === "link" || platform === "facebook") {
            return config.platformSDK.startGameAsync().then(() => {
                analytics._logTrafficSource();
                analytics._logGameStart();
            }).catch((error: any) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.startGameAsync: ${error.message}`,
                    "startGameAsync",
                    "https://sdk.html5gameportal.com/api/wortal/#startgameasync");
            });
        } else {
            // Platform does not have a startGameAsync method, so we just resolve here.
            return Promise.resolve().then(() => {
                analytics._logGameStart();
            });
        }
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
        throw invalidParams("value must be a number between 0 and 100.",
            "setLoadingProgress",
            "https://sdk.html5gameportal.com/api/wortal/#parameters_1");
    }

    if (platform === "link" || platform === "viber" || platform === "facebook") {
        if (config.platformSDK) {
            // This can be toggled on if there are issues with the loading progress not being set correctly.
            // It will create a lot of noise in the logs in most cases.
            // debug(`Setting loading progress to: ${value}`);
            config.platformSDK.setLoadingProgress(value);
        }
    }
}

/**
 * Sets a callback which will be invoked when the app is brought to the background.
 * @param callback Callback to invoke.
 */
export function onPause(callback: () => void): void {
    if (typeof callback !== "function") {
        throw invalidParams("callback needs to be a function.",
            "onPause",
            "https://sdk.html5gameportal.com/api/wortal/#parameters");
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
        if (platform === "debug") {
            debug("Haptic feedback requested successfully.");
            return;
        } else if (platform === "facebook") {
            return config.platformSDK.performHapticFeedbackAsync()
                .catch((error: any) => {
                    rethrowPlatformError(error,
                        "performHapticFeedbackAsync",
                        "https://sdk.html5gameportal.com/api/wortal/#performhapticfeedbackasync");
                });
        } else {
            throw notSupported(`Haptic feedback not supported on platform: ${platform}`,
                "performHapticFeedbackAsync");
        }
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
        return Promise.reject(initializationError("SDK already initialized.",
            "_initializeInternal"));
    }

    config.initialize();

    info("Initializing SDK " + __VERSION__);
    addLoadingListener();
    addGameEndEventListener();

    const platform = config.session.platform;
    _initializePlatform().then(() => {
        debug("Platform: " + platform);
        if (options.autoInitialize === false) {
            config.isAutoInit = false;
        }

        // If the developer calls initializeAsync earlier than this, we need to wait for the platform to be initialized.
        // This flag will make initializeAsync await the platform initialization before continuing.
        config.isPlatformInitialized = true;

        // We've finished the internal initialization that's still necessary in manual initialization mode, so we can
        // resolve here and wait for the developer to finish the initialization process.
        if (!config.isAutoInit) {
            debug("Manual initialization requested. Platform initialization finished, awaiting manual initialization..");
            return Promise.resolve();
        }

        if (!config.adConfig.isAdBlocked) {
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
 * @returns {Promise<void>} Promise that resolves when the platform SDK has been initialized.
 * for the Wortal platform.
 * @hidden
 * @private
 */
function _initializePlatform(): Promise<void> {
    const platform = config.session.platform;
    debug(`Initializing platform SDK for ${platform} platform.`);

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
            return _initializePlatform_Debug();
        default:
            return Promise.resolve();
    }
}

/**
 * Initializes the Wortal platform. This relies on Google AdSense to serve ads.
 * @returns {Promise<void>} Promise that resolves when the Wortal SDK has been initialized.
 * @hidden
 * @private
 */
function _initializePlatform_Wortal(): Promise<void> {
    return new Promise((resolve, reject) => {
        const metaElement = document.createElement("meta");
        const googleAdsSDK = document.createElement("script");

        const clientIdParam = getParameterByName("clientid");
        const hostIdParam = getParameterByName("hostid");
        const channelIdParam = getParameterByName("channelid");

        if (!isValidString(clientIdParam)) {
            reject(initializationError("Configuration \"clientid\" missing.",
                "_initializePlatform_Wortal()"));
        }

        // We don't reject these because they are likely not present in the test environment.
        if (!isValidString(hostIdParam)) {
            exception("Configuration \"hostid\" missing. Using default value. If testing in the Wortal dashboard than this can be safely ignored.");
        }

        if (!isValidString(channelIdParam)) {
            exception("Configuration \"channelid\" missing. Using default value. If testing in the Wortal dashboard than this can be safely ignored.");
        }

        config.adConfig.setClientID(clientIdParam!);
        config.adConfig.setHostID(hostIdParam || "");
        config.adConfig.setChannelID(channelIdParam || "");

        const debugParam = getParameterByName("debug");
        const frequencyCapParam = `${getParameterByName("freqcap") || 30}s`;
        (window as any).wortalSessionId = getParameterByName('sessid') ?? "";

        if (debugParam === "true") {
            googleAdsSDK.setAttribute("data-ad-client", "ca-pub-123456789");
            googleAdsSDK.setAttribute("data-adbreak-test", "on");
        } else {
            googleAdsSDK.setAttribute("data-ad-host", config.adConfig.hostID);
            googleAdsSDK.setAttribute("data-ad-client", config.adConfig.clientID);
            googleAdsSDK.setAttribute("data-ad-host-channel", config.adConfig.channelID);
            googleAdsSDK.setAttribute("data-ad-frequency-hint", frequencyCapParam);
        }

        googleAdsSDK.setAttribute("src", GOOGLE_SDK_SRC);
        googleAdsSDK.setAttribute("type", "text/javascript");

        metaElement.setAttribute("name", "google-adsense-platform-account");
        metaElement.setAttribute("content", config.adConfig.hostID);

        googleAdsSDK.onload = () => {
            debug("Wortal platform SDK initialized with ads.");
            resolve();
        }

        //TODO: find a workaround for ad blockers on Wortal
        googleAdsSDK.onerror = () => {
            debug("Ad blocker detected. Wortal platform SDK initialized without ads.");
            config.adConfig.setAdBlocked(true);
            resolve();
        };

        document.head.appendChild(metaElement);
        document.head.appendChild(googleAdsSDK);
    });
}

/**
 * Initializes the Link platform. This relies on Rakuten Games' Link SDK.
 * @returns {Promise<void>} Promise that resolve when the Link SDK has been initialized.
 * @hidden
 * @private
 */
function _initializePlatform_Link(): Promise<void> {
    return new Promise((resolve, reject) => {
        const linkSDK = document.createElement("script");
        linkSDK.src = LINK_SDK_SRC;

        linkSDK.onload = () => {
            if (typeof LinkGame === "undefined") {
                reject(initializationError("Failed to load Link SDK.",
                    "_initializePlatform_Link()"));
            }

            debug("Link platform SDK initialized.");
            config.platformSDK = LinkGame;
            resolve();
        }

        linkSDK.onerror = () => {
            reject(initializationError("Failed to load Link SDK.",
                "_initializePlatform_Link()"));
        }

        document.head.appendChild(linkSDK);
    });
}

/**
 * Initializes the Viber platform. This relies on Rakuten Games' Viber SDK.
 * @returns {Promise<void>} Promise that resolve when the Viber SDK has been initialized.
 * @hidden
 * @private
 */
function _initializePlatform_Viber(): Promise<void> {
    return new Promise((resolve, reject) => {
        const viberSDK = document.createElement("script");
        viberSDK.src = VIBER_SDK_SRC;

        viberSDK.onload = () => {
            if (typeof ViberPlay === "undefined") {
                reject(initializationError("Failed to load Viber SDK.",
                    "_initializePlatform_Viber()"));
            }

            debug("Viber platform SDK initialized.");
            config.platformSDK = ViberPlay;
            _initializeAdBackFill().then(() => {
                resolve();
            }).catch((error) => {
                // We don't reject here because this shouldn't prevent the Viber SDK from working, just the backfill.
                exception(error.message);
                resolve();
            });
        }

        viberSDK.onerror = () => {
            reject(initializationError("Failed to load Viber SDK.",
                "_initializePlatform_Viber()"));
        }

        document.head.appendChild(viberSDK);
    });
}

/**
 * Initializes the Facebook platform. This relies on Facebook's Instant Games SDK.
 * @returns {Promise<void>} Promise that resolve when the Facebook SDK has been initialized.
 * @hidden
 * @private
 */
function _initializePlatform_Facebook(): Promise<void> {
    return new Promise((resolve, reject) => {
        const facebookSDK = document.createElement("script");
        facebookSDK.src = FB_SDK_SRC;

        facebookSDK.onload = () => {
            if (typeof FBInstant === "undefined") {
                reject(initializationError("Failed to load Facebook SDK.",
                    "_initializePlatform_Facebook()"));
            }

            debug("Facebook platform SDK initialized.");
            config.platformSDK = FBInstant;
            resolve();
        }

        facebookSDK.onerror = () => {
            reject(initializationError("Failed to load Facebook SDK.",
                "_initializePlatform_Facebook()"));
        }

        document.head.appendChild(facebookSDK);
    });
}

/**
 * Initializes the Game Distribution platform. This relies on Game Distribution's SDK. The GD SDK works a little
 * differently from the others in that it relies heavily on window-based events to communicate with the game.
 * @param options {any} Options to pass to the GD SDK.
 * @returns {Promise<void>} Promise that resolve when the GD SDK has been initialized.
 * @hidden
 * @private
 */
function _initializePlatform_GD(options?: any): Promise<void> {
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
        let gdSDK = document.getElementsByTagName("script")[0];
        const firstScript = document.getElementsByTagName("script")[0];
        if (document.getElementById(id)) {
            if (typeof gdsdk === "undefined") {
                reject(initializationError("Failed to load Game Distribution SDK.",
                    "_initializePlatform_GD()"));
            }

            debug("Game Distribution platform SDK initialized.");
            config.platformSDK = gdsdk;
            resolve();
        } else {
            gdSDK = document.createElement("script");
            gdSDK.src = GD_SDK_SRC;
            gdSDK.id = id;
            firstScript.parentNode?.insertBefore(gdSDK, firstScript);

            gdSDK.onload = function () {
                if (typeof gdsdk === "undefined") {
                    reject(initializationError("Failed to load Game Distribution SDK.",
                        "_initializePlatform_GD()"));
                }

                config.platformSDK = gdsdk;
                addGDCallback(GD_EVENTS.SDK_READY, () => {
                    debug("Game Distribution platform SDK initialized.");
                    resolve();
                });
            }

            gdSDK.onerror = () => {
                reject(initializationError("Failed to load Game Distribution SDK.",
                    "_initializePlatform_GD()"));
            }
        }
    });
}

/**
 * Initializes the debugging platform. This is used when the game is running in a local or dev environment.
 * This will mock the platform SDK and allow the game to run without any platform dependencies, returning mock data
 * for all platform APIs. All APIs will be available, but some may not function exactly as they would on the platform.
 * @returns {Promise<void>} Promise that resolve when the debugging platform has been initialized.
 * @hidden
 * @private
 */
function _initializePlatform_Debug(): Promise<void> {
    return new Promise((resolve, reject) => {
        const metaElement = document.createElement("meta");
        const googleAdsSDK = document.createElement("script");

        config.adConfig.setClientID("ca-pub-123456789");
        config.adConfig.setHostID("");
        config.adConfig.setChannelID("");

        googleAdsSDK.setAttribute("data-ad-client", config.adConfig.clientID);
        googleAdsSDK.setAttribute("data-adbreak-test", "on");

        googleAdsSDK.setAttribute("src", GOOGLE_SDK_SRC);
        googleAdsSDK.setAttribute("type", "text/javascript");

        metaElement.setAttribute("name", "google-adsense-platform-account");
        metaElement.setAttribute("content", config.adConfig.hostID);

        googleAdsSDK.onload = () => {
            debug("Debug platform SDK initialized with ads.");
            resolve();
        }

        googleAdsSDK.onerror = () => {
            debug("Ad blocker detected. Debug platform SDK initialized without ads.");
            config.adConfig.setAdBlocked(true);
            resolve();
        };

        document.head.appendChild(metaElement);
        document.head.appendChild(googleAdsSDK);
    });
}

/**
 * Initializes the Wortal SDK. This is called after the platform has been initialized.
 * @hidden
 * @private
 */
function _initializeSDK(): Promise<void> {
    const platform = config.session.platform;
    debug(`Initializing SDK for ${platform} platform.`);

    switch (platform) {
        case "wortal":
            return _initializeSDK_Wortal();
        case "gd":
            return _initializeSDK_GD();
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
 *
 * NOTE: This is only used for auto-initialization. This will call startGameAsync immediately after initializeAsync
 * resolves, which may not be the desired behavior for manual initialization.
 * @hidden
 * @private
 */
function _initializeSDK_RakutenFacebook(): Promise<void> {
    return config.platformSDK.initializeAsync().then(() => {
        return config.lateInitialize().then(() => {
            tryEnableIAP();
            debug(`SDK initialized for ${config.session.platform} platform.`);
            return config.platformSDK.startGameAsync().then(() => {
                analytics._logTrafficSource();
            }).catch((error: any) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.startGameAsync: ${error.message}`,
                    "_initializeSDK_RakutenFacebook()");
            });
        }).catch((error: any) => {
            throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`,
                "_initializeSDK_RakutenFacebook()");
        });
    }).catch((error: any) => {
        throw initializationError(`Failed to initialize SDK during platformSDK.initializeAsync: ${error.message}`,
            "_initializeSDK_RakutenFacebook()");
    });
}

/**
 * Initializes the SDK for the Wortal platform. The SDK calls for a preroll once the SDK is initialized.
 * @hidden
 * @private
 */
function _initializeSDK_Wortal(): Promise<void> {
    return Promise.resolve().then(() => {
        // We don't need to await this because as of v1.6.8 Wortal and GD do not have any async operations that
        // occur in lateInitialize.
        config.lateInitialize();
        config.adConfig.adCalled();

        tryEnableIAP();

        debug(`SDK initialized for ${config.session.platform} platform.`);
        debug("Showing pre-roll ad.");

        ads.showInterstitial("preroll", "Preroll",
            () => {
            },
            () => {
                config.adConfig.setPrerollShown(true);
                config.adConfig.adShown();
                removeLoadingCover();
            });
    }).catch((error) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`,
            "_initializeSDK_Wortal()");
    });
}

/**
 * Initializes the SDK for the GD platform. GD shows a pre-roll ad when the player presses the play button then
 * loads the iframe with the game.
 * @hidden
 * @private
 */
function _initializeSDK_GD(): Promise<void> {
    return Promise.resolve().then(() => {
        // We don't need to await this because as of v1.6.8 Wortal and GD do not have any async operations that
        // occur in lateInitialize.
        config.lateInitialize();

        // In production GD calls for the pre-roll when the player presses the play button, so we don't need to call
        // for one here.
        config.adConfig.setPrerollShown(true);

        tryEnableIAP();
        removeLoadingCover();

        debug(`SDK initialized for ${config.session.platform} platform.`);
    }).catch((error) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`,
            "_initializeSDK_GD()");
    });
}

/**
 * Initializes the SDK for the debugging.
 * @hidden
 * @private
 */
function _initializeSDK_Debug(): Promise<void> {
    return Promise.resolve().then(() => {
        config.lateInitialize();
        tryEnableIAP();
        removeLoadingCover();
        debug("SDK initialized for debugging session.");
    }).catch((error) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`,
            "_initializeSDK_Debug()");
    });
}

/**
 * Initializes the SDK for the ad blocked case. This is used when the game is running in a browser with an ad blocker
 * enabled. We currently do not show any ads in this case.
 * @hidden
 * @private
 */
function _initializeSDK_AdBlocked(): Promise<void> {
    debug(`Initializing SDK for ${config.session.platform} platform. This is an ad blocked session, no ads will be shown.`);
    return Promise.resolve().then(() => {
        config.lateInitialize();
        tryEnableIAP();
        removeLoadingCover();
        debug("SDK initialized for ad blocked session.");
    }).catch((error) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`,
            "_initializeSDK_AdBlocked()");
    });
}

/**
 * Initializes the ad backfill. This relies on Google AdSense to serve ads on other platforms when an ad request is
 * not filled.
 * @hidden
 * @private
 */
function _initializeAdBackFill(): Promise<void> {
    debug("Initializing ad backfill...");
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform !== "viber") {
            throw notSupported(`Ad backfill not supported on platform: ${platform}`,
                "_initializeAdBackFill()");
        }

        let url: string = "";
        if (platform === "viber") {
            url = `${APIEndpoints.VIBER}${config.session.gameId}/adsense`;
        }

        debug("Fetching ad config for backfill...", url);
        fetch(url, {
            method: "GET",
        }).then((response) => {
            debug("Received response for ad config for backfill.", response);
            if (response.status === 200) {
                response.json().then((json) => {
                    debug("Parsed response for ad config for backfill.", json);
                    const clientID = json.data.clientId;
                    const clientHostID = json.data.clientHostId;
                    const channelID = json.data.channelId;

                    if (!isValidString(clientID)) {
                        throw operationFailed("Failed to fetch ad config for backfill: clientID missing",
                            "_initializeAdBackFill()");
                    }

                    if (!isValidString(clientHostID)) {
                        throw operationFailed("Failed to fetch ad config for backfill: clientHostID missing",
                            "_initializeAdBackFill()");
                    }

                    if (!isValidString(channelID)) {
                        throw operationFailed("Failed to fetch ad config for backfill: channelID missing",
                            "_initializeAdBackFill()");
                    }

                    config.adConfig.setClientID(clientID);
                    config.adConfig.setHostID(clientHostID);
                    config.adConfig.setChannelID(channelID);

                    debug("Ad backfill initialized.");
                }).catch((error) => {
                    throw operationFailed(`Failed to parse response for backfill: ${error.message}`,
                        "_initializeAdBackFill()");
                });
            } else {
                throw operationFailed(`Failed to fetch ad config for backfill: ${response.status} // ${response.statusText}`,
                    "_initializeAdBackFill()");
            }
        }).catch((error) => {
            throw operationFailed(`Failed to fetch ad config for backfill: ${error.message}`,
                "_initializeAdBackFill()");
        });
    });
}

/**
 * @hidden
 * @private
 */
function _delayUntilPlatformInitialized(): Promise<void> {
    // It's possible for the game to call initializeAsync before the platform SDK has been initialized, so we need to
    // wait for it to be initialized before we allow that call to continue. This is only used in manual initialization mode.
    return new Promise(resolve => {
        const checkPlatformInitialized = () => {
            if (config.isPlatformInitialized) {
                resolve();
            } else {
                debug("Waiting for platform SDK to initialize...");
                setTimeout(checkPlatformInitialized, 100);
            }
        };
        checkPlatformInitialized();
    });
}
