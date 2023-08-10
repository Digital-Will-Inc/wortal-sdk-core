import { InterstitialAd, RewardedAd } from "../classes/ads";
import { AdInstanceData } from "../interfaces/ads";
import { PlacementType } from "../types/ads";
import { invalidParams } from "../utils/error-handler";
import { debug, warn } from "../utils/logger";
import { isValidString } from "../utils/validators";
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
 * @param noFill Callback for when the ad is not filled. This can happen if the platform has no ads to show or if the
 * rate limit has been reached. If this is not provided, the afterAd callback will be used.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * </ul>
 */
export function showInterstitial(placement: PlacementType, description: string,
                                 beforeAd: Function, afterAd: Function, noFill?: Function): void {
    const platform = config.session.platform;

    // Validate the callbacks. Invalid params will cause the adBreak API to throw an error.
    if (beforeAd === undefined || typeof beforeAd !== "function") {
        beforeAd = () => warn("beforeAd function missing or invalid. This is used to pause the game and mute audio when an ad begins.");
    }
    if (afterAd === undefined || typeof afterAd !== "function") {
        afterAd = () => warn("afterAd function missing or invalid. This is used to resume the game and unmute audio when an ad has finished.");
    }
    if (noFill === undefined || typeof noFill !== "function") {
        noFill = afterAd;
    }

    // Validate the placement type. Invalid types can cause policy violations.
    if (placement === "reward") {
        throw invalidParams("showInterstitial called with placement type 'reward'. Call showRewarded instead to display a rewarded ad.", "ads.showInterstitial");
    }
    if (placement === "preroll" && (platform === "link" || platform === "viber" || platform === "facebook")) {
        throw invalidParams(`Current platform does not support preroll ads. Platform: ${platform}`, "ads.showInterstitial");
    }
    if (placement === "preroll" && (
        config.adConfig.hasPrerollShown ||
        config.game.gameTimer > 10)) {
        throw invalidParams("Preroll ads can only be shown once during game load.", "ads.showInterstitial");
    }

    // Validate the ad unit IDs. Non-existent IDs can cause the ad call to hang indefinitely.
    if ((platform === "link" || platform === "viber" || platform === "facebook")
        && !isValidString(config.adConfig.interstitialId)) {
        warn("Ad Unit IDs not found. Please contact your Wortal representative to have the ad unit IDs configured.");
        return;
    }

    // Don't bother calling if the ads are blocked, the Wortal backend will not respond which can lead to the
    // game being frozen, waiting for callbacks that will never come.
    if (config.adConfig.isAdBlocked) {
        debug("Ads are blocked, skipping..");
        noFill();
        return;
    }

    // We need to make sure we call show() after building the ad instance. We do this because in the future we
    // want to be able to preload ads and allow the game to check whether an ad is filled and ready to show.
    let data: AdInstanceData = {
        placementType: placement,
        adUnitId: config.adConfig.interstitialId,
        description: description,
        beforeAd: beforeAd,
        afterAd: afterAd,
        noFill: noFill,
    };

    const ad = new InterstitialAd(data);
    ad.show();
}

/**
 * Shows a rewarded ad. These are longer, optional ads that the player can earn a reward for watching. The player
 * must be notified of the ad and give permission to show before it can be shown.
 * @example
 * // This example shows the game flow independent of the outcome of the ad.
 * // Ex: Player gets bonus coins for watching the ad, but the game continues regardless of the outcome.
 * Wortal.ads.showRewarded('BonusCoins', pauseGame, resumeGame, skipBonus, addBonusCoins);
 *
 * // This example shows the game flow depending on the outcome of the ad.
 * // Ex: Player dies and can revive by watching an ad, but if they skip the ad they lose the level.
 * Wortal.ads.showRewarded('ReviveAndContinue', pauseAudio, resumeAudio, endGame, continueGame);
 * @param description Description of the placement.
 * @param beforeAd Callback for before the ad is shown. Pause the game here.
 * @param afterAd Callback for after the ad is shown. Resume the game here.
 * @param adDismissed Callback for when the player dismissed the ad. Do not reward the player.
 * @param adViewed Callback for when the player has successfully watched the ad. Reward the player here.
 * @param noFill Callback for when the ad is not filled. This can happen if the platform has no ads to show or if
 * the rate limit has been reached. If this is not provided, the afterAd callback will be used.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * </ul>
 */
export function showRewarded(description: string, beforeAd: Function, afterAd: Function,
                             adDismissed: Function, adViewed: Function, noFill?: Function): void {
    const platform = config.session.platform;

    // Validate the callbacks. Invalid params will cause the adBreak API to throw an error.
    if (beforeAd === undefined || typeof beforeAd !== "function") {
        beforeAd = () => warn("beforeAd function missing or invalid. This is used to pause the game and mute audio when an ad begins.");
    }
    if (afterAd === undefined || typeof afterAd !== "function") {
        afterAd = () => warn("afterAd function missing or invalid. This is used to resume the game and unmute audio when an ad has finished.");
    }
    if (adDismissed === undefined || typeof adDismissed !== "function") {
        adDismissed = () => warn("adDismissed function missing or invalid. This is used to handle the case where the player did not successfully watch the ad.");
    }
    if (adViewed === undefined || typeof adViewed !== "function") {
        // We cannot call for a rewarded ad without actually rewarding the player if successful, which
        // would be the case here.
        throw invalidParams("adViewed function missing or invalid. This is required to reward the player when they have successfully watched the ad.", "ads.showRewarded");
    }
    if (noFill === undefined || typeof noFill !== "function") {
        noFill = afterAd;
    }

    // Validate the ad unit IDs. Non-existent IDs can cause the ad call to hang indefinitely.
    if ((platform === "link" || platform === "viber" || platform === "facebook")
        && !isValidString(config.adConfig.rewardedId)) {
        warn("Ad Unit IDs not found. Please contact your Wortal representative to have the ad unit IDs configured.");
        return;
    }

    // Don't bother calling if the ads are blocked, the Wortal backend will not respond which can lead to the
    // game being frozen, waiting for callbacks that will never come.
    if (config.adConfig.isAdBlocked) {
        debug("Ads are blocked, skipping..");
        // Call both of these as some situations might require resuming the game flow in adDismissed instead of afterAd.
        adDismissed();
        noFill();
        return;
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
        noFill: noFill,
    };

    const ad = new RewardedAd(data);
    ad.show();
}
