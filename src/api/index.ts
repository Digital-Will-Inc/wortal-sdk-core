import { AuthPayload, AuthResponse, AuthResponse_CrazyGames, Error_Facebook_Rakuten } from "../interfaces/wortal";
import { APIEndpoints, Error_CrazyGames, GD_EVENTS } from "../types/wortal";
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
import SDKConfig, { API_URL, WORTAL_API } from "../utils/config";
import { debug, exception, info } from "../utils/logger";
import {
    initializationError,
    invalidParams,
    notSupported,
    operationFailed,
    rethrowError_CrazyGames,
    rethrowError_Facebook_Rakuten
} from "../utils/error-handler";
import { isValidNumber, isValidString } from "../utils/validators";
import {
    addGameEndEventListener,
    addLoadingListener,
    getParameterByName,
    gdEventTrigger,
    removeLoadingCover,
    tryEnableIAP,
    addGDCallback,
    delayUntilConditionMet,
    isSupportedOnCurrentPlatform
} from "../utils/wortal-utils";

// This is the version of the SDK. It is set by the build process.
declare const __VERSION__: string;

// References to the platform SDKs. They are declared here so that we can map these to config.platformSDK
// once they are initialized.

declare const LinkGame: any;
declare const ViberPlay: any;
declare const FBInstant: any;
declare const gdsdk: any;
declare const GamePix: any;

// URLs for the platform SDKs. They are declared here so that we can use them to load the SDKs when we
// initialize the platforms.

const GOOGLE_SDK_SRC: string = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const LINK_SDK_SRC: string = "https://lg.rgames.jp/libs/link-game-sdk/1.3.0/bundle.js";
const VIBER_SDK_SRC: string = "https://vbrpl.io/libs/viber-play-sdk/1.14.0/bundle.js";
const FB_SDK_SRC: string = "https://connect.facebook.net/en_US/fbinstant.7.1.js";
const GD_SDK_SRC: string = "https://html5.api.gamedistribution.com/main.min.js";
const CRAZY_GAMES_SRC: string = "https://sdk.crazygames.com/crazygames-sdk-v2.js";
const GAME_PIX_SRC: string = "https://integration.gamepix.com/sdk/v3/gamepix.sdk.js";

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
    // It's possible for the game to call initializeAsync before the platform SDK has been initialized, so we need to
    // wait for it to be initialized before we allow that call to continue. This is only used in manual initialization mode.
    if (!config.isPlatformInitialized) {
        debug("Platform not initialized yet, awaiting platform initialization..");
        await delayUntilConditionMet(() => config.isPlatformInitialized,
            "Platform not initialized yet, awaiting platform initialization..");
    }

    if (config.isAutoInit) {
        return Promise.reject(initializationError("SDK is configured to auto initialize. Only call this when manual initialization is enabled.",
            WORTAL_API.INITIALIZE_ASYNC,
            API_URL.INITIALIZE_ASYNC));
    }

    if (config.isInitialized) {
        return Promise.reject(initializationError("SDK already initialized.",
            WORTAL_API.INITIALIZE_ASYNC,
            API_URL.INITIALIZE_ASYNC));
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
                }).catch((error: any) => {
                    throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`,
                        WORTAL_API.INITIALIZE_ASYNC,
                        API_URL.INITIALIZE_ASYNC);
                })
            }).catch((error: Error_Facebook_Rakuten) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.initializeAsync: ${error.message}`,
                    WORTAL_API.INITIALIZE_ASYNC,
                    API_URL.INITIALIZE_ASYNC);
            });
        } else {
            return _initializeSDK().then(() => {
                analytics._logGameStart();

                isInitialized = true;
                window.dispatchEvent(new Event("wortal-sdk-initialized"));

                debug(`SDK initialized for ${config.session.platform} platform.`);
                info("SDK initialization complete.");
            }).catch((error: any) => {
                throw initializationError(`Failed to initialize SDK during _initializeSDK: ${error.message}`,
                    WORTAL_API.INITIALIZE_ASYNC,
                    API_URL.INITIALIZE_ASYNC);
            });
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
            WORTAL_API.START_GAME_ASYNC,
            API_URL.START_GAME_ASYNC));
    }

    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "viber" || platform === "link" || platform === "facebook") {
            return config.platformSDK.startGameAsync().then(() => {
                session._gameLoadingStop();
                analytics._logTrafficSource();
                analytics._logGameStart();
            }).catch((error: Error_Facebook_Rakuten) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.startGameAsync: ${error.message}`,
                    WORTAL_API.START_GAME_ASYNC,
                    API_URL.START_GAME_ASYNC);
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
 * Starts the authentication process for the player. If the current platform has its own authentication prompt then
 * this will be displayed.
 * @example
 * Wortal.authenticateAsync()
 * .then(response => console.log(response));
 * @param {AuthPayload} payload Optional payload for the authentication process.
 * @returns {Promise<AuthResponse>} Promise that resolves with the response from the authentication process.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>AUTH_IN_PROGRESS</li>
 * <li>USER_ALREADY_AUTHENTICATED</li>
 * <li>USER_INPUT</li>
 * <li>NOT_SUPPORTED</li>
 * </ul>
 */
export function authenticateAsync(payload?: AuthPayload): Promise<AuthResponse | undefined> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.AUTHENTICATE_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.AUTHENTICATE_ASYNC);
        }

        if (platform === "debug") {
            const response: AuthResponse = {
                status: "success",
            };
            return response;
        }

        if (platform === "crazygames") {
            return new Promise((resolve) => {
                const callback = (error: Error_CrazyGames, user: any) => {
                    if (error) {
                        throw rethrowError_CrazyGames(error, WORTAL_API.AUTHENTICATE_ASYNC, API_URL.AUTHENTICATE_ASYNC);
                    } else {
                        config.player.crazyGamesPlayer = user;
                        const response: AuthResponse = {
                            status: "success",
                        };
                        resolve(response);
                    }
                };
                config.platformSDK.user.showAuthPrompt(callback);
            });
        }
    });
}

/**
 * Starts the account linking process for the player. If the current platform has its own account linking prompt then
 * this will be displayed.
 * @example
 * Wortal.linkAccountAsync()
 * .then(isLinked => console.log("Player linked account: " + isLinked));
 * @returns {Promise<boolean>} Promise that resolves when the player has finished the account linking process. The
 * promise will resolve with true if the player linked their account and false if they did not.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>LINK_IN_PROGRESS</li>
 * <li>USER_NOT_AUTHENTICATED</li>
 * <li>NOT_SUPPORTED</li>
 * </ul>
 */
export function linkAccountAsync(): Promise<boolean | undefined> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.LINK_ACCOUNT_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.LINK_ACCOUNT_ASYNC);
        }

        if (platform === "debug") {
            return true;
        }

        if (platform === "crazygames") {
            return new Promise((resolve) => {
                const callback = (error: Error_CrazyGames, response: AuthResponse_CrazyGames) => {
                    if (error) {
                        throw rethrowError_CrazyGames(error, WORTAL_API.LINK_ACCOUNT_ASYNC, API_URL.LINK_ACCOUNT_ASYNC);
                    } else {
                        if (response.response === "yes") {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                };
                config.platformSDK.user.showAccountLinkPrompt(callback);
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
        throw invalidParams(undefined, WORTAL_API.SET_LOADING_PROGRESS, API_URL.SET_LOADING_PROGRESS);
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
    const platform = config.session.platform;
    if (typeof callback !== "function") {
        throw invalidParams(undefined, WORTAL_API.ON_PAUSE, API_URL.ON_PAUSE);
    }

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
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC);
        }

        if (platform === "debug") {
            debug("Haptic feedback requested successfully.");
            return;
        }

        if (platform === "facebook") {
            return config.platformSDK.performHapticFeedbackAsync()
                .catch((error: Error_Facebook_Rakuten) => {
                    rethrowError_Facebook_Rakuten(error, WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC, API_URL.PERFORM_HAPTIC_FEEDBACK_ASYNC);
                });
        }
    });
}

/**
 * Gets the supported APIs for the current platform. Debug platform will return an empty array but supports all APIs.
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
    const functionName = "_initializeInternal()";
    if (config.isInitialized) {
        return Promise.reject(initializationError("SDK already initialized.", functionName));
    }

    config.initialize();
    session._gameLoadingStart();

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

        return _initializeSDK().then(() => {
            session._gameLoadingStop();
            analytics._logGameStart();
            isInitialized = true;
            window.dispatchEvent(new Event("wortal-sdk-initialized"));
            info("SDK initialization complete.");
        }).catch((error: any) => {
            throw initializationError(`Failed to initialize SDK during _initializeSDK: ${error.message}`, functionName);
        });
    }).catch((error: any) => {
        throw initializationError(`Failed to initialize SDK during _initializePlatform: ${error.message}`, functionName);
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
        case "crazygames":
            return _initializePlatform_CrazyGames();
        case "gamepix":
            return _initializePlatform_GamePix();
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
    const functionName = "_initializePlatform_Wortal()";
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
    const functionName = "_initializePlatform_Link()";
    return new Promise((resolve, reject) => {
        const linkSDK = document.createElement("script");
        linkSDK.src = LINK_SDK_SRC;

        linkSDK.onload = () => {
            if (typeof LinkGame === "undefined") {
                reject(initializationError("Failed to load Link SDK.", functionName));
            }

            debug("Link platform SDK initialized.");
            config.platformSDK = LinkGame;
            resolve();
        }

        linkSDK.onerror = () => {
            reject(initializationError("Failed to load Link SDK.", functionName));
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
    const functionName = "_initializePlatform_Viber()";
    return new Promise((resolve, reject) => {
        const viberSDK = document.createElement("script");
        viberSDK.src = VIBER_SDK_SRC;

        viberSDK.onload = () => {
            if (typeof ViberPlay === "undefined") {
                reject(initializationError("Failed to load Viber SDK.", functionName));
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
            reject(initializationError("Failed to load Viber SDK.", functionName));
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
    const functionName = "_initializePlatform_Facebook()";
    return new Promise((resolve, reject) => {
        const facebookSDK = document.createElement("script");
        facebookSDK.src = FB_SDK_SRC;

        facebookSDK.onload = () => {
            if (typeof FBInstant === "undefined") {
                reject(initializationError("Failed to load Facebook SDK.", functionName));
            }

            debug("Facebook platform SDK initialized.");
            config.platformSDK = FBInstant;
            resolve();
        }

        facebookSDK.onerror = () => {
            reject(initializationError("Failed to load Facebook SDK.", functionName));
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
    const functionName = "_initializePlatform_GD()";
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
                reject(initializationError("Failed to load Game Distribution SDK.", functionName));
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
                    reject(initializationError("Failed to load Game Distribution SDK.", functionName));
                }

                config.platformSDK = gdsdk;
                addGDCallback(GD_EVENTS.SDK_READY, () => {
                    debug("Game Distribution platform SDK initialized.");
                    resolve();
                });
            }

            gdSDK.onerror = () => {
                reject(initializationError("Failed to load Game Distribution SDK.", functionName));
            }
        }
    });
}

/**
 * Initializes the CrazyGames platform. This relies on Crazy Games' SDK.
 * @returns {Promise<void>} Promise that resolve when the CrazyGames SDK has been initialized.
 * @hidden
 * @private
 */
function _initializePlatform_CrazyGames(): Promise<void> {
    const functionName = "_initializePlatform_CrazyGames()";
    return Promise.resolve().then(() => {
        const crazyGamesSDK = document.createElement("script");
        crazyGamesSDK.src = CRAZY_GAMES_SRC;

        crazyGamesSDK.onload = () => {
            if (typeof (window as any).CrazyGames.SDK === "undefined") {
                throw initializationError("Failed to load Crazy Games SDK.", functionName);
            }

            debug("Crazy Games platform SDK loaded.");
            config.platformSDK = (window as any).CrazyGames.SDK;

            return new Promise((resolve) => {
                const callback = (error: any, result: any) => {
                    if (error) {
                        // Don't reject here because not being able to check for adblock shouldn't prevent the SDK from working.
                        exception(error);
                        resolve(error);
                    } else {
                        // This seems to always return false as of v1.6.9. We still guard against this when we show ads
                        // as the CrazyGames SDK will return the adError callback, which triggers our noFill callback.
                        debug("CrazyGames adblock check complete.", result);
                        config.adConfig.setAdBlocked(result);
                        resolve(result);
                    }
                };

                config.platformSDK.ad.hasAdblock(callback);
            });
        }

        crazyGamesSDK.onerror = () => {
            throw initializationError("Failed to load Crazy Games SDK.", functionName);
        }

        document.head.appendChild(crazyGamesSDK);
    });
}

/**
 * Initializes the GamePix platform. This relies on GamePix's SDK.
 * @returns {Promise<void>} Promise that resolve when the GamePix SDK has been initialized.
 * @hidden
 * @private
 */
function _initializePlatform_GamePix(): Promise<void> {
    const functionName = "_initializePlatform_GamePix()";
    return Promise.resolve().then(() => {
        const gamePixSDK = document.createElement("script");
        gamePixSDK.src = GAME_PIX_SRC;

        gamePixSDK.onload = () => {
            if (typeof GamePix === "undefined") {
                throw initializationError("Failed to load GamePix SDK.", functionName);
            }

            debug("GamePix platform SDK loaded.");
            config.platformSDK = GamePix;
        }

        gamePixSDK.onerror = () => {
            throw initializationError("Failed to load GamePix SDK.", functionName);
        }

        document.head.appendChild(gamePixSDK);
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
    return new Promise((resolve) => {
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
        case "crazygames":
            return _initializeSDK_CrazyGames();
        case "gamepix":
            return _initializeSDK_GamePix();
        case "debug":
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
    const functionName = "_initializeSDK_RakutenFacebook()";
    return config.platformSDK.initializeAsync().then(() => {
        return config.lateInitialize().then(() => {
            tryEnableIAP();
            debug(`SDK initialized for ${config.session.platform} platform.`);
            return config.platformSDK.startGameAsync().then(() => {
                analytics._logTrafficSource();
            }).catch((error: Error_Facebook_Rakuten) => {
                throw initializationError(`Failed to initialize SDK during platformSDK.startGameAsync: ${error.message}`,
                    functionName);
            });
        }).catch((error: any) => {
            throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`,
                functionName);
        });
    }).catch((error: Error_Facebook_Rakuten) => {
        throw initializationError(`Failed to initialize SDK during platformSDK.initializeAsync: ${error.message}`,
            functionName);
    });
}

/**
 * Initializes the SDK for the Wortal platform. The SDK calls for a preroll once the SDK is initialized.
 * @hidden
 * @private
 */
function _initializeSDK_Wortal(): Promise<void> {
    const functionName = "_initializeSDK_Wortal()";
    return Promise.resolve().then(() => {
        // We don't need to await this because as of v1.6.8 Wortal does not have any async operations that
        // occur in lateInitialize.
        config.lateInitialize();

        tryEnableIAP();
        debug(`SDK initialized for ${config.session.platform} platform.`);

        if (config.adConfig.isAdBlocked) {
            removeLoadingCover();
            return;
        }

        debug("Showing pre-roll ad.");
        ads.showInterstitial("preroll", "Preroll",
            () => {
                config.adConfig.adCalled();
            },
            () => {
                config.adConfig.setPrerollShown(true);
                config.adConfig.adShown();
                removeLoadingCover();
            });
    }).catch((error: any) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`, functionName);
    });
}

/**
 * Initializes the SDK for the GD platform. GD shows a pre-roll ad when the player presses the play button then
 * loads the iframe with the game.
 * @hidden
 * @private
 */
function _initializeSDK_GD(): Promise<void> {
    const functionName = "_initializeSDK_GD()";
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
    }).catch((error: any) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`, functionName);
    });
}

/**
 * Initializes the SDK for the CrazyGames platform. CrazyGames does not support pre-roll ads and does not require
 * us to add a loading cover.
 * @hidden
 * @private
 */
function _initializeSDK_CrazyGames(): Promise<void> {
    const functionName = "_initializeSDK_CrazyGames()";
    return Promise.resolve().then(() => {
        return config.lateInitialize().then(() => {
            tryEnableIAP();
            debug(`SDK initialized for ${config.session.platform} platform.`);
        }).catch((error: any) => {
            throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`, functionName);
        });
    }).catch((error: any) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`, functionName);
    });
}

/**
 * Initializes the SDK for the GamePix platform.
 * @hidden
 * @private
 */
function _initializeSDK_GamePix(): Promise<void> {
    const functionName = "_initializeSDK_GamePix()";
    return Promise.resolve().then(() => {
        return config.lateInitialize().then(() => {
            tryEnableIAP();
            debug(`SDK initialized for ${config.session.platform} platform.`);
        }).catch((error: any) => {
            throw initializationError(`Failed to initialize SDK during config.lateInitialize: ${error.message}`, functionName);
        });
    }).catch((error: any) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`, functionName);
    });
}

/**
 * Initializes the SDK for the debugging.
 * @hidden
 * @private
 */
function _initializeSDK_Debug(): Promise<void> {
    const functionName = "_initializeSDK_Debug()";
    return Promise.resolve().then(() => {
        config.lateInitialize();
        tryEnableIAP();
        removeLoadingCover();
        debug("SDK initialized for debugging session.");
    }).catch((error: any) => {
        throw initializationError(`Failed to initialize SDK: ${error.message}`, functionName);
    });
}

/**
 * Initializes the ad backfill. This relies on Google AdSense to serve ads on other platforms when an ad request is
 * not filled.
 * @hidden
 * @private
 */
function _initializeAdBackFill(): Promise<void> {
    const functionName = "_initializeAdBackFill()";
    const platform = config.session.platform;

    debug("Initializing ad backfill...");
    return Promise.resolve().then(() => {
        if (platform !== "viber") {
            throw notSupported(undefined, functionName);
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
                        throw operationFailed("Failed to fetch ad config for backfill: clientID missing", functionName);
                    }

                    if (!isValidString(clientHostID)) {
                        throw operationFailed("Failed to fetch ad config for backfill: clientHostID missing", functionName);
                    }

                    if (!isValidString(channelID)) {
                        throw operationFailed("Failed to fetch ad config for backfill: channelID missing", functionName);
                    }

                    config.adConfig.setClientID(clientID);
                    config.adConfig.setHostID(clientHostID);
                    config.adConfig.setChannelID(channelID);

                    debug("Ad backfill initialized.");
                }).catch((error: any) => {
                    throw operationFailed(`Failed to parse response for backfill: ${error.message}`, functionName);
                });
            } else {
                throw operationFailed(`Failed to fetch ad config for backfill: ${response.status} // ${response.statusText}`, functionName);
            }
        }).catch((error: any) => {
            throw operationFailed(`Failed to fetch ad config for backfill: ${error.message}`, functionName);
        });
    });
}
