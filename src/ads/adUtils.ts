import {Placement} from "./placement";
import {Wortal} from "../index";

/**
 * Utility functions for ad classes.
 */
export class AdUtils {
    /**
     * Checks if the given ad can currently be shown. Logs relevant output to console if false.
     * @param placement Placement type of the ad to show.
     * @param shouldBeInterstitial Should the placement be an interstitial ad. This is used to check if a call has been
     * made to showInterstitial with Placement.REWARD passed as the placement arg. Default is true.
     */
    static canShow(placement: Placement, shouldBeInterstitial: boolean = true): boolean {
        if (!Wortal.isInit) {
            Wortal.error("Core SDK not initialized yet. Call init() on load to avoid this error. Attempting to initialize now..");
            Wortal.init();
            return false;
        }

        if (Wortal.isAdShowing) {
            Wortal.warn("Already showing an ad.");
            return false;
        }

        if (placement === Placement.REWARD && shouldBeInterstitial) {
            Wortal.warn("showInterstitial was called with a reward placement type arg.");
            return false;
        }

        if (placement === Placement.PREROLL && Wortal.hasShownPreroll) {
            Wortal.warn("Preroll can only be shown once per session.");
            return false;
        }

        return true;
    }
}
