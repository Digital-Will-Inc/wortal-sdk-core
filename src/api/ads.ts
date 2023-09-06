import { InterstitialAd, RewardedAd } from "../classes/ads";
import { AdInstanceData } from "../interfaces/ads";
import { PlacementType } from "../types/ads";
import { API_URL, WORTAL_API } from "../utils/config";
import { invalidParams } from "../utils/error-handler";
import { debug, warn } from "../utils/logger";
import { isValidPlacementType, isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Returns whether ads are blocked for the current session. This can be used to determine if an alternative flow should
 * be used instead of showing ads, or prompt the player to disable the ad blocker.
 * @example
 * if (Wortal.ads.isAdBlocked()) {
 *    // Show a message to the player to disable their ad blocker.
 *    // Or use an alternative flow that doesn't require ads - social invites for rewards as an example.
 * }
 * @returns {boolean} True if ads are blocked for the current session. False if ads are not blocked.
 */
export function isAdBlocked(): boolean {
    return config.adConfig.isAdBlocked;
}

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
                                 beforeAd: () => void, afterAd: () => void, noFill?: () => void): void {
    const platform = config.session.platform;

    if (!isValidPlacementType(placement)) {
        throw invalidParams(`showInterstitial called with invalid placement type: ${placement}`,
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            API_URL.ADS_SHOW_INTERSTITIAL);
    }

    if (placement === "reward") {
        throw invalidParams("showInterstitial called with placement type 'reward'. Call showRewarded instead to display a rewarded ad.",
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            API_URL.ADS_SHOW_INTERSTITIAL);
    }

    if (placement === "preroll" && (platform === "link" || platform === "viber" || platform === "facebook")) {
        throw invalidParams("Current platform does not support preroll ads.",
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            API_URL.ADS_SHOW_INTERSTITIAL);
    }

    // Don't allow preroll ads to be shown more than once or after the game has started.
    if (placement === "preroll" && (config.adConfig.hasPrerollShown || config.game.gameTimer > 10)) {
        throw invalidParams("Preroll ads can only be shown once during game load.",
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            API_URL.ADS_SHOW_INTERSTITIAL);
    }

    // Validate the callbacks. While these aren't strictly required as in some cases ads are shown on a menu or
    // otherwise non-gameplay screen, we still log a warning to make sure the developer is aware.
    if (beforeAd === undefined || typeof beforeAd !== "function") {
        beforeAd = () => warn("beforeAd function missing or invalid. This is used to pause the game and mute audio when an ad begins.");
    }

    if (afterAd === undefined || typeof afterAd !== "function") {
        afterAd = () => warn("afterAd function missing or invalid. This is used to resume the game and unmute audio when an ad has finished.");
    }

    // If no ad is filled the afterAd callback isn't reached. If the developer doesn't provide a noFill callback
    // we use the afterAd callback instead to ensure the game doesn't hang indefinitely.
    if (noFill === undefined || typeof noFill !== "function") {
        noFill = afterAd;
    }

    // Validate the ad unit IDs. Non-existent IDs can cause the ad call to hang indefinitely.
    if ((platform === "link" || platform === "viber" || platform === "facebook")
        && !isValidString(config.adConfig.interstitialId)) {
        if (platform === "viber" && isValidString(config.adConfig.rewardedId)) {
            // As of v1.6.4 Viber does not support interstitial ads, so we won't have an ID for it. But we still want to
            // check if the game is in production or not, which should be the case if we have a rewarded ID.
            // We can still attempt to show the ad here because we can backfill it.
        } else {
            warn("Ad Unit IDs not found. Please contact your Wortal representative to have the ad unit IDs configured.");
            return;
        }
    }

    // Don't bother calling for an ad if the ads are blocked. As of v1.6 this only applies to Wortal platform.
    if (config.adConfig.isAdBlocked) {
        debug("Ads are blocked, skipping..");
        noFill();
        return;
    }

    const data: AdInstanceData = {
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
export function showRewarded(description: string, beforeAd: () => void, afterAd: () => void,
                             adDismissed: () => void, adViewed: () => void, noFill?: () => void): void {
    const platform = config.session.platform;

    // We cannot call for a rewarded ad without actually rewarding the player for successfully watching the ad.
    if (adViewed === undefined || typeof adViewed !== "function") {
        throw invalidParams("adViewed function missing or invalid. This is required to reward the player when they have successfully watched the ad.",
            WORTAL_API.ADS_SHOW_REWARDED,
            API_URL.ADS_SHOW_REWARDED);
    }

    // Validate the callbacks. Only adViewed is required as the player must be rewarded for watching the ad. We
    // still log a warning to make sure the developer is aware if they did not provide the other callbacks.
    if (beforeAd === undefined || typeof beforeAd !== "function") {
        beforeAd = () => warn("beforeAd function missing or invalid. This is used to pause the game and mute audio when an ad begins.");
    }

    if (afterAd === undefined || typeof afterAd !== "function") {
        afterAd = () => warn("afterAd function missing or invalid. This is used to resume the game and unmute audio when an ad has finished.");
    }

    if (adDismissed === undefined || typeof adDismissed !== "function") {
        adDismissed = () => warn("adDismissed function missing or invalid. This is used to handle the case where the player did not successfully watch the ad.");
    }

    // If no ad is filled the afterAd callback isn't reached. If the developer doesn't provide a noFill callback
    // we use the afterAd callback instead to ensure the game doesn't hang indefinitely.
    if (noFill === undefined || typeof noFill !== "function") {
        noFill = afterAd;
    }

    // Validate the ad unit IDs. Non-existent IDs can cause the ad call to hang indefinitely.
    if ((platform === "link" || platform === "viber" || platform === "facebook")
        && !isValidString(config.adConfig.rewardedId)) {
        warn("Ad Unit IDs not found. Please contact your Wortal representative to have the ad unit IDs configured.");
        return;
    }

    // Don't bother calling if the ads are blocked.
    if (config.adConfig.isAdBlocked) {
        debug("Ads are blocked, skipping..");
        // Call both of these as some situations might require resuming the game flow in adDismissed instead of afterAd,
        // such as a player dying and whether they revive or not is dependent on the ad watch outcome.
        adDismissed();
        noFill();
        return;
    }

    const data: AdInstanceData = {
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
