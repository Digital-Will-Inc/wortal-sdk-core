import * as _ads from './ads';
import * as _analytics from './analytics';
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

    (window as any).initWortal(() => {
        console.log("[Wortal] Platform: " + sdk.session.platform);
        if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
            removeLoadingCover();
            if ((window as any).wortalGame) {
                (window as any).wortalGame.initializeAsync().then(() => {
                    (window as any).wortalGame.startGameAsync();
                    analytics.logGameStart();
                    console.log("[Wortal] SDK Core initialization complete.");
                });
            }
        } else if (sdk.session.platform === "wortal") {
            ads.showInterstitial(PlacementType.PREROLL, "Preroll", () => {}, () => {
                removeLoadingCover();
                sdk.adConfig.setPrerollShown(true);
                analytics.logGameStart();
                console.log("[Wortal] SDK Core initialization complete.");
            });
        } else {
            console.log("[Wortal] Entering debug mode..");
            removeLoadingCover();
            analytics.logGameStart();
            console.log("[Wortal] SDK Core initialization complete.");
        }
    }, () => {
        console.log("[Wortal] Ad blocker detected.");
        removeLoadingCover();
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

/**
 * Removes the loading cover that prevents the game from being rendered before a preroll ad has shown.
 */
export function removeLoadingCover(): void {
    if (document.getElementById("loading-cover")) {
        document.getElementById("loading-cover")!.style.display = "none";
    }
}
