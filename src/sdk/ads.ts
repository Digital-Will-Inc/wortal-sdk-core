import {InterstitialAd, RewardedAd} from "../models/ad-instance";
import {AdInstanceData, PlacementType} from "../types/ad-instance";
import {sdk} from "./index";

/**
 * Shows an interstitial ad.
 * @param placement Placement type for the ad.
 * @param description Description of the placement.
 * @param beforeAd Callback for before the ad is shown. Pause the game here.
 * @param afterAd Callback for after the ad is shown. Resume the game here.
 */
export function showInterstitial(placement: PlacementType, description: string,
                                 beforeAd: Function, afterAd: Function): void {
    if (sdk.adConfig.isAdBlocked) {
        console.log("[Wortal] Ads are blocked, skipping..");
        afterAd();
        return;
    }

    if (placement === PlacementType.REWARD) {
        console.error("[Wortal] showInterstitial called with placement type 'reward'. Call showRewarded instead.");
        return;
    }

    if (placement === PlacementType.PREROLL && (sdk.session.platform === "link" || sdk.session.platform === "viber")) {
        console.error("[Wortal] Link and Viber platforms do not support preroll ads.");
        return;
    }

    if (placement === PlacementType.PREROLL && (sdk.adConfig.hasPrerollShown || sdk.game.gameTimer > 10)) {
        console.error("[Wortal] Preroll ads can only be shown during game load.");
        return;
    }

    let data: AdInstanceData = {
        placementType: placement,
        adUnitId: sdk.adConfig.interstitialId,
        description: description,
        beforeAd: beforeAd,
        afterAd: afterAd,
    };

    const ad = new InterstitialAd(data);
    ad.show();
}

/**
 * Shows a rewarded ad.
 * @param description Description of the placement.
 * @param beforeAd Callback for before the ad is shown. Pause the game here.
 * @param afterAd Callback for after the ad is shown. Resume the game here.
 * @param adDismissed Callback for when the player dismissed the ad. Do not reward the player.
 * @param adViewed Callback for when the player has successfully watched the ad. Reward the player here.
 */
export function showRewarded(description: string, beforeAd: Function, afterAd: Function,
                             adDismissed: Function, adViewed: Function): void {
    if (sdk.adConfig.isAdBlocked) {
        console.log("[Wortal] Ads are blocked, skipping..");
        adDismissed();
        afterAd();
        return;
    }

    let data: AdInstanceData = {
        placementType: PlacementType.REWARD,
        adUnitId: sdk.adConfig.rewardedId,
        description: description,
        beforeAd: beforeAd,
        afterAd: afterAd,
        adDismissed: adDismissed,
        adViewed: adViewed,
    };

    const ad = new RewardedAd(data);
    ad.show();
}
