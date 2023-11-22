import { rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Link } from "../../errors/interfaces/link-error";
import Wortal from "../../index";
import { isValidString } from "../../utils/validators";
import { AdUnit_Link_Viber } from "../interfaces/rakuten-ads";
import { AdConfig } from "./ad-config";

/**
 * Link implementation of AdConfig.
 * @hidden
 */
export class AdConfigLink extends AdConfig {
    public override async initialize(): Promise<void> {
        Wortal._log.debug("Initializing AdConfig..");
        await this._getAdUnitIDs();
        Wortal._log.debug("AdConfig initialized.", this._data);
    }

    private async _getAdUnitIDs(): Promise<void> {
        Wortal._log.debug("Fetching ad unit IDs from Link SDK..");
        return Wortal._internalPlatformSDK.getAdUnitsAsync()
            .then((adUnits: AdUnit_Link_Viber[]) => {
                if (adUnits == null || undefined) {
                    Wortal._log.exception("Failed to retrieve ad units. This may be due to a server error or platform malfunction.");
                    return;
                }

                for (let i = 0; i < adUnits.length; i++) {
                    if (adUnits[i].type === "INTERSTITIAL") {
                        if (isValidString(this._data.interstitialId)) {
                            Wortal._log.warn("Multiple interstitial ad units found. Using the first one.");
                            continue;
                        }

                        this._data.interstitialId = adUnits[i].id;
                    } else if (adUnits[i].type === "REWARDED_VIDEO") {
                        if (isValidString(this._data.rewardedId)) {
                            Wortal._log.warn("Multiple rewarded ad units found. Using the first one.");
                            continue;
                        }

                        this._data.rewardedId = adUnits[i].id;
                    }
                }
            })
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, "_getAdUnitIDs");
            });
    }

}
