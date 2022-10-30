import * as _ads from './ads';
import * as _analytics from './analytics';
import * as _leaderboard from './leaderboard';
import {InitializationOptions} from "../types/initialization";
import {PlacementType} from "../types/ad-instance";
import SDKData from "../utils/sdk";

/**
 * Ads API
 */
export const ads = _ads;
/**
 * Analytics API
 */
export const analytics = _analytics;
/**
 * Leaderboard API
 */
export const leaderboard = _leaderboard;
/**
 * SDK data container
 */
export const sdk = new SDKData();

/**
 * Initializes the SDK.
 * @param options Initialization options to include.
 */
export function init(options: InitializationOptions = {}): void {
    console.log("[Wortal] Initializing SDK Core..");
    sdk.init();

    // Make sure we have the loading cover added to prevent the game canvas from being shown before the preroll ad finishes.
    if (document.readyState === "loading") {
        // The DOMContentLoaded event fires later than expected on Link/Viber, so we should have the <body> available
        // to us here. On other platforms it may not be available yet, so we'll wait for the event to add it.
        if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
            addLoadingCover();
        } else {
            document.addEventListener('DOMContentLoaded', addLoadingCover);
        }
    } else {
        addLoadingCover();
    }

    (window as any).initWortal(() => {
        console.log("[Wortal] Platform: " + sdk.session.platform);
        if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
            removeLoadingCover();
            if ((window as any).wortalGame) {
                (window as any).wortalGame.initializeAsync().then(() => {
                    (window as any).wortalGame.startGameAsync();
                    sdk.lateInit();
                    analytics.logGameStart();
                    console.log("[Wortal] SDK Core initialization complete.");
                });
            }
        } else if (sdk.session.platform === "wortal") {
            ads.showInterstitial(PlacementType.PREROLL, "Preroll", () => {}, () => {
                removeLoadingCover();
                sdk.lateInit();
                sdk.adConfig.setPrerollShown(true);
                analytics.logGameStart();
                console.log("[Wortal] SDK Core initialization complete.");
            });
        } else {
            console.log("[Wortal] Entering debug mode..");
            removeLoadingCover();
            sdk.lateInit();
            analytics.logGameStart();
            console.log("[Wortal] SDK Core initialization complete.");
        }
    }, () => {
        console.log("[Wortal] Ad blocker detected.");
        removeLoadingCover();
        sdk.lateInit();
        sdk.adConfig.setAdBlocked(true);
        analytics.logGameStart();
        console.log("[Wortal] SDK Core initialization complete.");
    });

    window.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            analytics.logGameEnd();
        }
    });
}

/**
 * Sets the loading progress value for the game build.
 * @param value Percentage of loading complete. Range is 0 to 100.
 */
export function setLoadingProgress(value: number): void {
    if ((window as any).wortalGame) {
        (window as any).wortalGame.setLoadingProgress(value);
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
