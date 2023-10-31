import { rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Viber } from "../../errors/interfaces/viber-error";
import Wortal from "../../index";
import { debug, exception, warn } from "../../utils/logger";
import { isValidString } from "../../utils/validators";
import { AdUnit_Link_Viber } from "../interfaces/rakuten-ads";
import { AdConfig } from "./ad-config";

/**
 * Viber implementation of AdConfig.
 * @hidden
 */
export class AdConfigViber extends AdConfig {
    constructor() {
        super();
    }

    public async initialize(): Promise<void> {
        debug("Initializing AdConfig..");
        await this._getAdUnitIDs();
        debug("AdConfig initialized.", this._data);
    }

    private async _getAdUnitIDs(): Promise<void> {
        debug("Fetching ad unit IDs from Viber SDK..");
        return Wortal._internalPlatformSDK.getAdUnitsAsync()
            .then((adUnits: AdUnit_Link_Viber[]) => {
                if (adUnits == null || undefined) {
                    exception("Failed to retrieve ad units. This may be due to a server error or platform malfunction.");
                    return;
                }

                for (let i = 0; i < adUnits.length; i++) {
                    if (adUnits[i].type === "INTERSTITIAL") {
                        if (isValidString(this._data.interstitialId)) {
                            warn("Multiple interstitial ad units found. Using the first one.");
                            continue;
                        }

                        this._data.interstitialId = adUnits[i].id;
                    } else if (adUnits[i].type === "REWARDED_VIDEO") {
                        if (isValidString(this._data.rewardedId)) {
                            warn("Multiple rewarded ad units found. Using the first one.");
                            continue;
                        }

                        this._data.rewardedId = adUnits[i].id;
                    }
                }
            })
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, "_getAdUnitIDs");
            });
    }

}
