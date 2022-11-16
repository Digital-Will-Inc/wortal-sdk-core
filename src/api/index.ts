import * as _ads from './ads';
import * as _analytics from './analytics';
import * as _context from './context';
import * as _iap from './iap';
import * as _leaderboard from './leaderboard';
import * as _player from './player';
import * as _session from './session';
import { InitializationOptions } from "../types/initialization";
import SDKConfig from "../utils/config";

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

declare var __VERSION__: string;

/**
 * Initializes the SDK. This is called automatically after the Wortal backend interface script is loaded. There is
 * no need to call this from the game.
 * @param options Initialization options to include. Currently not used.
 */
export function init(options: InitializationOptions = {}): void {
    if (config.isInit) {
        console.log("[Wortal] SDK Core already initialized.");
        return;
    }
    console.log("[Wortal] Initializing SDK Core " + __VERSION__);
    config.init();

    // Make sure we have the loading cover added to prevent the game canvas from being shown before the preroll ad finishes.
    // Link/Viber use their own loading covers and don't have preroll ads.
    if (document.readyState === "loading") {
        if (config.session.platform !== "link" && config.session.platform !== "viber") {
            document.addEventListener('DOMContentLoaded', addLoadingCover);
        }
    } else {
        if (config.session.platform !== "link" && config.session.platform !== "viber") {
            addLoadingCover();
        }
    }

    (window as any).initWortal(() => {
        console.log("[Wortal] Platform: " + config.session.platform);
        if (config.session.platform === "link" || config.session.platform === "viber") {
            (window as any).wortalGame.initializeAsync()
                .then(() => {
                    (window as any).wortalGame.startGameAsync();
                    config.lateInit();
                    tryEnableIAP();
                    analytics.logGameStart();
                    console.log("[Wortal] SDK Core initialization complete.");
                });
        } else if (config.session.platform === "wortal") {
            config.lateInit();
            ads.showInterstitial('preroll', "Preroll", () => {}, () => {
                removeLoadingCover();
                config.adConfig.setPrerollShown(true);
                tryEnableIAP();
                analytics.logGameStart();
                console.log("[Wortal] SDK Core initialization complete.");
            });
        } else {
            removeLoadingCover();
            config.lateInit();
            analytics.logGameStart();
            console.log("[Wortal] SDK Core initialization complete.");
        }
    }, () => {
        console.log("[Wortal] Ad blocker detected.");
        removeLoadingCover();
        config.lateInit();
        config.adConfig.setAdBlocked(true);
        tryEnableIAP();
        analytics.logGameStart();
        console.log("[Wortal] SDK Core initialization complete.");
    });

    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            analytics.logGameEnd();
        }
    });
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
    if ((window as any).wortalGame) {
        (window as any).wortalGame.setLoadingProgress(value);
    }
}

function tryEnableIAP(): void {
    if (config.session.platform === "viber") {
        (window as any).wortalGame.payments.onReady(() => {
            config.enableIAP();
            console.log("[Wortal] IAP initialized for platform.");
        });
    } else {
        console.log("[Wortal] IAP not supported on platform: " + config.session.platform);
    }
}

function addLoadingCover(): void {
    let cover = document.createElement("div");
    cover.id = "loading-cover";
    cover.style.cssText = "background: #000000; width: 100%; height: 100%; position: fixed; z-index: 100;";
    document.body.prepend(cover);
}

function removeLoadingCover(): void {
    if (document.getElementById("loading-cover")) {
        document.getElementById("loading-cover")!.style.display = "none";
    }
}
