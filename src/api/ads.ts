import { InterstitialAd, RewardedAd } from "../models/ad-instance";
import { AdInstanceData, PlacementType } from "../types/ad-instance";
import { invalidParams, notSupported } from "../utils/error-handler";
import { config } from "./index";

/**
 * Shows an interstitial ad. These can be shown at various points in the game such as a level end, restart or a timed
 * interval in games with longer levels.
 * @example
 * // Player reached the next level.
 * Wortal.ads.showInterstitial('next', 'NextLevel', pauseGame, resumeGame);
 *
 * // Player paused the game.
 * Wortal.ads.showInterstitial('pause', 'PausedGame', pauseGame, resumeGame);
 *
 * // Player opened the IAP shop.
 * Wortal.ads.showInterstitial('browse', 'BrowseShop', pauseAudio, resumeAudio);
 * @param placement Placement type for the ad.
 * @param description Description of the placement.
 * @param beforeAd Callback for before the ad is shown. Pause the game here.
 * @param afterAd Callback for after the ad is shown. Resume the game here.
 * @throws {ErrorMessage} INVALID_PARAM - Check error.message for details.
 */
export function showInterstitial(placement: PlacementType, description: string,
                                 beforeAd: Function, afterAd: Function): void {
    let platform = config.session.platform;

    // Validate the callbacks. Invalid params will cause the adBreak API to throw an error.
    if (beforeAd === undefined || typeof beforeAd !== "function") {
        beforeAd = () => console.warn("[Wortal] BeforeAd function missing or invalid.");
    }
    if (afterAd === undefined || typeof afterAd !== "function") {
        afterAd = () => console.warn("[Wortal] AfterAd function missing or invalid.");
    }

    // Validate the placement type. Invalid types can cause policy violations.
    if (placement === 'reward') {
        throw invalidParams("showInterstitial called with placement type 'reward'. Call showRewarded instead.", "ads.showInterstitial");
    }
    if (placement === 'preroll' && (platform === "link" || platform === "viber" || platform === "facebook")) {
        throw invalidParams("Current platform does not support preroll ads.", "ads.showInterstitial");
    }
    if (placement === 'preroll' && (
        config.adConfig.hasPrerollShown ||
        config.game.gameTimer > 10)) {
        throw invalidParams("Preroll ads can only be shown during game load.", "ads.showInterstitial");
    }

    // Don't bother calling if the ads are blocked, the Wortal backend will not respond which can lead to the
    // game being frozen, waiting for callbacks that will never come.
    if (config.adConfig.isAdBlocked) {
        console.log("[Wortal] Ads are blocked, skipping..");
        afterAd();
        return;
    }

    if (config.session.platform === 'viber') {
        throw notSupported("Ads not currently supported on platform: " + config.session.platform, "ads.showInterstitial");
    }

    // We need to make sure we call show() after building the ad instance. We do this because in the future we
    // want to be able to preload ads and allow the game to check whether an ad is filled and ready to show.
    let data: AdInstanceData = {
        placementType: placement,
        adUnitId: config.adConfig.interstitialId,
        description: description,
        beforeAd: beforeAd,
        afterAd: afterAd,
    };
    const ad = new InterstitialAd(data);
    ad.show();
}

/**
 * Shows a rewarded ad. These are longer, optional ads that the player can earn a reward for watching. The player
 * must be notified of the ad and give permission to show before it can be shown.
 * @example
 * // This example shows the game flow independent of the outcome of the ad.
 * Wortal.ads.showRewarded('BonusCoins', pauseGame, resumeGame, skipBonus, addBonusCoins);
 *
 * // This example shows the game flow depending on the outcome of the ad.
 * Wortal.ads.showRewarded('ReviveAndContinue', pauseAudio, resumeAudio, endGame, continueGame);
 * @param description Description of the placement.
 * @param beforeAd Callback for before the ad is shown. Pause the game here.
 * @param afterAd Callback for after the ad is shown. Resume the game here.
 * @param adDismissed Callback for when the player dismissed the ad. Do not reward the player.
 * @param adViewed Callback for when the player has successfully watched the ad. Reward the player here.
 * @throws {ErrorMessage} INVALID_PARAM - Check error.message for details.
 */
export function showRewarded(description: string, beforeAd: Function, afterAd: Function,
                             adDismissed: Function, adViewed: Function): void {

    // Validate the callbacks. Invalid params will cause the adBreak API to throw an error.
    if (beforeAd === undefined || typeof beforeAd !== "function") {
        beforeAd = () => console.warn("[Wortal] BeforeAd function missing or invalid.");
    }
    if (afterAd === undefined || typeof afterAd !== "function") {
        afterAd = () => console.warn("[Wortal] AfterAd function missing or invalid.");
    }
    if (adDismissed === undefined || typeof adDismissed !== "function") {
        adDismissed = () => console.warn("[Wortal] AdDismissed function missing or invalid.");
    }
    if (adViewed === undefined || typeof adViewed !== "function") {
        // We cannot call for a rewarded ad without actually rewarding the player if successful, which
        // would be the case here.
        throw invalidParams("AdViewed function missing or invalid.", "ads.showRewarded");
    }

    // Don't bother calling if the ads are blocked, the Wortal backend will not respond which can lead to the
    // game being frozen, waiting for callbacks that will never come.
    if (config.adConfig.isAdBlocked) {
        console.log("[Wortal] Ads are blocked, skipping..");
        // Call both of these as some situations might require resuming the game flow in adDismissed instead of afterAd.
        adDismissed();
        afterAd();
        return;
    }

    if (config.session.platform === 'viber') {
        throw notSupported("Ads not currently supported on platform: " + config.session.platform, "ads.showRewarded");
    }

    // We need to make sure we call show() after building the ad instance. We do this because in the future we
    // want to be able to preload ads and allow the game to check whether an ad is filled and ready to show.
    let data: AdInstanceData = {
        placementType: 'reward',
        adUnitId: config.adConfig.rewardedId,
        description: description,
        beforeAd: beforeAd,
        afterAd: afterAd,
        adDismissed: adDismissed,
        adViewed: adViewed,
    };
    const ad = new RewardedAd(data);
    ad.show();
}
