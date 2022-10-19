import {Placement} from "./placement";

/**
 * Interface for Wortal ads. Calls for ads to be shown and handles callbacks for the ad lifecycle.
 */
export interface Ads {
    /**
     * Shows an interstitial ad.
     *
     * @param placement Placement type of the ad.
     * @param description Description of the ad.
     * @param beforeAd Callback for before the ad is shown. Pause the game here.
     * @param afterAd Callback for after the ad is shown. Resume the game here.
     */
    showInterstitial(placement: Placement, description: string, beforeAd: Function, afterAd: Function): void;

    /**
     * Shows a rewarded ad.
     *
     * @param description Description of the ad.
     * @param beforeAd Callback for before the ad is shown. Pause the game here.
     * @param afterAd Callback for after the ad is shown. Resume the game here.
     * @param adDismissed Callback for when the player skipped the ad. Do not reward the player.
     * @param adViewed Callback for when the player watched the ad successfully. Reward the player here.
     */
    showRewarded(description: string, beforeAd: Function, afterAd: Function,
                 adDismissed: Function, adViewed: Function): void;
}
