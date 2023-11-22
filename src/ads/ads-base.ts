import { API_URL, WORTAL_API } from "../data/core-data";
import { implementationError, invalidParams } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { isValidPlacementType, isValidString } from "../utils/validators";
import { AdConfig } from "./classes/ad-config";
import { AdCallbacks } from "./interfaces/ad-callbacks";
import { AdInstanceData } from "./interfaces/ad-data";
import { BannerPosition } from "./types/banner-position";
import { PlacementType } from "./types/ad-sense-types";

/**
 * Base class for ads implementation. Extend this class to implement ads for a specific platform.
 * @hidden
 */
export class AdsBase {
//#region Internal
    protected _adConfig: AdConfig;

    constructor(config: AdConfig) {
        this._adConfig = config;
    }

    /** @internal */
    get _internalAdConfig(): AdConfig {
        return this._adConfig;
    }

//#endregion
//#region Public API

    public showBanner(shouldShow: boolean = true, position: BannerPosition = "bottom") {
        Wortal._log.apiCall(WORTAL_API.ADS_SHOW_BANNER);

        this.showBannerImpl(shouldShow, position);
    }

    public showInterstitial(placement: PlacementType, description: string,
                            beforeAd: () => void, afterAd: () => void, noFill?: () => void): void {
        Wortal._log.apiCall(WORTAL_API.ADS_SHOW_INTERSTITIAL);

        const callbacks: AdCallbacks = {
            beforeAd: beforeAd,
            afterAd: afterAd,
            noFill: noFill || afterAd,
        };

        const validationResult: ValidationResult = this.validateShowInterstitial(placement, callbacks);
        if (!validationResult.valid) {
            callbacks.noFill();
            throw validationResult.error;
        }

        // Don't call for an ad if the ads are blocked.
        if (this._adConfig.isAdBlocked) {
            Wortal._log.debug("Ads are blocked, skipping..");
            callbacks.noFill();
            return;
        }

        const ad: AdInstanceData = {
            placementType: placement,
            adUnitId: this._adConfig.interstitialId,
            description: description,
            callbacks: {
                beforeAd: callbacks.beforeAd,
                afterAd: callbacks.afterAd,
                noFill: callbacks.noFill,
            }
        };

        this.showInterstitialImpl(ad);
    }

    public showRewarded(description: string, beforeAd: () => void, afterAd: () => void,
                        adDismissed: () => void, adViewed: () => void, noFill?: () => void): void {
        Wortal._log.apiCall(WORTAL_API.ADS_SHOW_REWARDED);

        const callbacks: AdCallbacks = {
            beforeAd: beforeAd,
            afterAd: afterAd,
            adDismissed: adDismissed,
            adViewed: adViewed,
            noFill: noFill || afterAd,
        };

        const validationResult: ValidationResult = this.validateShowRewarded(callbacks);
        if (!validationResult.valid) {
            callbacks.noFill();
            callbacks.adDismissed?.();
            throw validationResult.error;
        }

        // Don't call for an ad if the ads are blocked.
        if (this._adConfig.isAdBlocked) {
            Wortal._log.debug("Ads are blocked, skipping..");
            callbacks.noFill();
            callbacks.adDismissed?.();
            return;
        }

        const ad: AdInstanceData = {
            placementType: "reward",
            adUnitId: this._adConfig.rewardedId,
            description: description,
            callbacks: {
                beforeAd: callbacks.beforeAd,
                afterAd: callbacks.afterAd,
                adDismissed: callbacks.adDismissed,
                adViewed: callbacks.adViewed,
                noFill: callbacks.noFill,
            }
        };

        this.showRewardedImpl(ad);
    }

//#endregion
//#region Implementation interface

    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void { throw implementationError(); }
    protected showInterstitialImpl(ad: AdInstanceData): void { throw implementationError(); }
    protected showRewardedImpl(ad: AdInstanceData): void { throw implementationError(); }

//#endregion
//#region Validation

    protected validateShowInterstitial(placement: PlacementType, callbacks: AdCallbacks): ValidationResult {
        const platform = Wortal._internalPlatform;
        if (!isValidPlacementType(placement)) {
            return {
                valid: false,
                error: invalidParams(`showInterstitial called with invalid placement type: ${placement}`,
                    WORTAL_API.ADS_SHOW_INTERSTITIAL,
                    API_URL.ADS_SHOW_INTERSTITIAL)
            };
        }

        if (placement === "reward") {
            return {
                valid: false,
                error: invalidParams("showInterstitial called with placement type 'reward'. Call showRewarded instead to display a rewarded ad.",
                    WORTAL_API.ADS_SHOW_INTERSTITIAL,
                    API_URL.ADS_SHOW_INTERSTITIAL)
            };
        }

        if (placement === "preroll" && (platform === "link" || platform === "viber" || platform === "facebook")) {
            return {
                valid: false,
                error: invalidParams("Current platform does not support preroll ads.",
                    WORTAL_API.ADS_SHOW_INTERSTITIAL,
                    API_URL.ADS_SHOW_INTERSTITIAL)
            };
        }

        // Don't allow preroll ads to be shown more than once or after the game has started.
        if (placement === "preroll" && (this._adConfig.hasPrerollShown || Wortal.session._internalGameState.gameTimer > 10)) {
            return {
                valid: false,
                error: invalidParams("Preroll ads can only be shown once during game load.",
                    WORTAL_API.ADS_SHOW_INTERSTITIAL,
                    API_URL.ADS_SHOW_INTERSTITIAL)
            };
        }

        // Validate the ad unit IDs. Non-existent IDs can cause the ad call to hang indefinitely.
        if ((platform === "link" || platform === "viber" || platform === "facebook")
            && !isValidString(this._adConfig.interstitialId)) {
            return {
                valid: false,
                error: invalidParams("Interstitial ad unit ID is missing or invalid.",
                    WORTAL_API.ADS_SHOW_INTERSTITIAL,
                    API_URL.ADS_SHOW_INTERSTITIAL)
            };
        }

        // These aren't strictly required as in some cases ads are shown on a menu or otherwise non-gameplay screen,
        // we still log a warning to make sure the developer is aware.
        if (callbacks.beforeAd === undefined || typeof callbacks.beforeAd !== "function") {
            callbacks.beforeAd = () => Wortal._log.warn("beforeAd function missing or invalid. This is used to pause the game and mute audio when an ad begins.");
        }

        if (callbacks.afterAd === undefined || typeof callbacks.afterAd !== "function") {
            callbacks.afterAd = () => Wortal._log.warn("afterAd function missing or invalid. This is used to resume the game and unmute audio when an ad has finished.");
        }

        return { valid: true };
    }

    protected validateShowRewarded(callbacks: AdCallbacks): ValidationResult {
        const platform = Wortal._internalPlatform;
        if (callbacks.adViewed === undefined || typeof callbacks.adViewed !== "function") {
            return {
                valid: false,
                error: invalidParams("showRewarded called with invalid adViewed callback.",
                    WORTAL_API.ADS_SHOW_REWARDED,
                    API_URL.ADS_SHOW_REWARDED)
            };
        }

        // Validate the ad unit IDs. Non-existent IDs can cause the ad call to hang indefinitely.
        if ((platform === "link" || platform === "viber" || platform === "facebook")
            && !isValidString(this._adConfig.rewardedId)) {
            return {
                valid: false,
                error: invalidParams("Rewarded ad unit ID is missing or invalid.",
                    WORTAL_API.ADS_SHOW_REWARDED,
                    API_URL.ADS_SHOW_REWARDED)
            };
        }

        // These aren't strictly required as in some cases ads are shown on a menu or otherwise non-gameplay screen,
        // we still log a warning to make sure the developer is aware.
        if (callbacks.beforeAd === undefined || typeof callbacks.beforeAd !== "function") {
            callbacks.beforeAd = () => Wortal._log.warn("beforeAd function missing or invalid. This is used to pause the game and mute audio when an ad begins.");
        }

        if (callbacks.afterAd === undefined || typeof callbacks.afterAd !== "function") {
            callbacks.afterAd = () => Wortal._log.warn("afterAd function missing or invalid. This is used to resume the game and unmute audio when an ad has finished.");
        }

        if (callbacks.adDismissed === undefined || typeof callbacks.adDismissed !== "function") {
            callbacks.adDismissed = () => Wortal._log.warn("adDismissed function missing or invalid. This is used to handle when the player dismisses the ad.");
        }

        return { valid: true };
    }

//#endregion
}
