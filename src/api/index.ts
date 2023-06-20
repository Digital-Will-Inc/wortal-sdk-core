import * as _ads from './ads';
import * as _analytics from './analytics';
import * as _context from './context';
import * as _iap from './iap';
import * as _leaderboard from './leaderboard';
import * as _player from './player';
import * as _session from './session';
import { InitializationOptions } from "../types/initialization";
import SDKConfig from "../utils/config";
import { notSupported } from "../utils/error-handler";

/**
 * Ads API
 */
export const ads = _ads;
/**
 * Analytics API
 */
export const analytics = _analytics;
/**
 * Context API
 */
export const context = _context;
/**
 * In-app purchase API
 */
export const iap = _iap;
/**
 * Leaderboard API
 */
export const leaderboard = _leaderboard;
/**
 * Player API
 */
export const player = _player;
/**
 * Session API
 */
export const session = _session;

/** @hidden */
export const config = new SDKConfig();

/**
 * Returns true if the SDK Core has been initialized.
 * */
export let isInitialized: boolean = false;

declare var __VERSION__: string;

/** @hidden */
export function _initInternal(options?: InitializationOptions): void {
    if (config.isInit) {
        console.warn("[Wortal] SDK Core already initialized.");
        return;
    }

    console.log("[Wortal] Initializing SDK Core " + __VERSION__);
    config.init();
    const platform = config.session.platform;

    _addLoadingListener();

    (window as any).initWortal(() => {
        console.log("[Wortal] Platform: " + platform);
        if (platform === "link" || platform === "viber" || platform === "facebook") {
            _initRakutenFacebook();
        } else if (platform === "wortal" || platform === "gd") {
            _initWortalGD();
        } else {
            _initDebug();
        }
    }, () => {
        _initAdBlocked();
    });

    _addGameEndEventListener();
}

/**
 * Sets the loading progress value for the game. This is required on some platforms. Failure to call this with 100
 * once the game is fully loaded will result in the game failing to start.
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
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        if ((window as any).wortalGame) {
            (window as any).wortalGame.setLoadingProgress(value);
        }
    }
}

/**
 * Sets a callback which will be invoked when the app is brought to the background,
 * @param callback Callback to invoke.
 */
export function onPause(callback: Function): void {
    const platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        if ((window as any).wortalGame) {
            (window as any).wortalGame.onPause(() => {
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
        if (platform === "facebook") {
            return (window as any).wortalGame.performHapticFeedbackAsync();
        } else {
            throw notSupported("Haptic feedback not supported on platform: " + platform, "performHapticFeedbackAsync");
        }
    });
}

/**
 * Gets the supported APIs for the current platform.
 * @example
 * let supportedAPIs = Wortal.getSupportedAPIs();
 * if (supportedAPIs.includes("context.shareAsync")) {
 *    shareWithFriendsDialog.show();
 * }
 * @returns {string[]} Array of supported APIs.
 */
export function getSupportedAPIs(): string[] {
    return config._supportedAPIs[config.session.platform];
}

function _tryEnableIAP(): void {
    const platform = config.session.platform;
    if (platform === "viber" || platform === "facebook") {
        (window as any).wortalGame.payments.onReady(() => {
            config.enableIAP();
            console.log("[Wortal] IAP initialized for platform.");
        });
    } else {
        console.log("[Wortal] IAP not supported on platform: " + config.session.platform);
    }
}

function _addLoadingCover(): void {
    let cover = document.createElement("div");
    cover.id = "loading-cover";
    cover.style.cssText = "background: #000000; width: 100%; height: 100%; position: fixed; z-index: 100;";
    document.body.prepend(cover);
}

function _removeLoadingCover(): void {
    if (document.getElementById("loading-cover")) {
        document.getElementById("loading-cover")!.style.display = "none";
    }
}

// Link/Viber/FB have the same init sequence. No pre-roll ads. No loading cover is added.
// Initialize the Link/Viber/FB SDK, report loading progress, game shows on 100% and startGameAsync.
function _initRakutenFacebook(): void {
    (window as any).wortalGame.initializeAsync()
        .then(() => {
            (window as any).wortalGame.startGameAsync();
            config.lateInit();
            _tryEnableIAP();
            analytics._logTrafficSource();
            analytics._logGameStart();
            isInitialized = true;
            console.log("[Wortal] SDK Core initialization complete.");
        });
}

// Wortal/GD shows preroll ad, removes cover after.
function _initWortalGD(): void {
    config.lateInit();
    ads.showInterstitial("preroll", "Preroll", () => {
    }, () => {
        _removeLoadingCover();
        config.adConfig.setPrerollShown(true);
        _tryEnableIAP();
        analytics._logGameStart();
        isInitialized = true;
        console.log("[Wortal] SDK Core initialization complete.");
    });
}

// Debug or unknown platform.
function _initDebug(): void {
    _removeLoadingCover();
    config.lateInit();
    analytics._logGameStart();
    isInitialized = true;
    console.log("[Wortal] SDK Core initialization complete.");
}

// Ads are blocked.
function _initAdBlocked(): void {
    console.log("[Wortal] Ad blocker detected.");
    _removeLoadingCover();
    config.lateInit();
    config.adConfig.setAdBlocked(true);
    _tryEnableIAP();
    analytics._logGameStart();
    isInitialized = true;
    console.log("[Wortal] SDK Core initialization complete.");
}

// Make sure we have the loading cover added to prevent the game canvas from being shown before the preroll ad finishes.
// Link/Viber/FB use their own loading covers.
function _addLoadingListener(): void {
    const platform = config.session.platform;
    if (document.readyState === "loading") {
        if (platform === "wortal" || platform === "gd") {
            document.addEventListener("DOMContentLoaded", _addLoadingCover);
        }
    } else {
        if (platform === "wortal" || platform === "gd") {
            _addLoadingCover();
        }
    }
}

function _addGameEndEventListener(): void {
    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            analytics._logGameEnd();
        }
    });
}
