import { API_ENDPOINTS } from "../../data/core-data";
import { initializationError, operationFailed } from "../../errors/error-handler";
import Wortal from "../../index";
import { isValidString } from "../../utils/validators";
import { AdUnitsResponse_Facebook } from "../interfaces/facebook-ads";
import { AdConfig } from "./ad-config";

/**
 * Facebook implementation of AdConfig.
 * @hidden
 */
export class AdConfigFacebook extends AdConfig {
    public override async initialize(): Promise<void> {
        Wortal._log.debug("Initializing AdConfig..")
        await this._getAdUnitIDs();
        Wortal._log.debug("AdConfig initialized.", this._data);
    }

    /**
     * Fetches the ad unit IDs from Wortal API.
     * @example JSON returned
     *{
     *  "gameID": 68,
     *  "ads": [
     *     {
     *      "display_format": "interstitial",
     *      "placement_id": "1284783688986969_1317853085680029"
     *     }
     *   ]
     *}
     */
    private async _getAdUnitIDs(): Promise<void> {
        Wortal._log.debug("Fetching Facebook ad units from Wortal API..");
        if (typeof window.wortalGameID === "undefined") {
            return Promise.reject(initializationError(
                "Failed to retrieve wortalGameID. This may be due to an error when uploading the game bundle to Facebook.",
                "_getAdUnitIDs"));
        }

        const url = API_ENDPOINTS.ADS + window.wortalGameID;

        await fetch(url).then((response: Response) => {
            Wortal._log.debug("Fetching Facebook ad units from Wortal API response: ", response);

            return response.json().then((adUnits: AdUnitsResponse_Facebook) => {
                Wortal._log.debug("Fetching Facebook ad units from Wortal API response JSON: ", adUnits);

                if ((adUnits == null || undefined) || (adUnits.ads == null || undefined)) {
                    Wortal._log.exception("Failed to retrieve ad units. This may be due to a server issue or the API being currently unavailable.");
                    return;
                }

                if (adUnits.ads.length === 0) {
                    Wortal._log.warn("No ad units returned. Please contact your Wortal representative to set up your ad units before attempting to show ads.");
                    return;
                }

                for (let i = 0; i < adUnits.ads.length; i++) {
                    if (adUnits.ads[i].display_format === "interstitial") {
                        if (isValidString(this._data.interstitialId)) {
                            Wortal._log.warn("Multiple interstitial ad units found. Using the first one.");
                            continue;
                        }

                        this._data.interstitialId = adUnits.ads[i].placement_id;
                    } else if (adUnits.ads[i].display_format === "rewarded_video") {
                        if (isValidString(this._data.rewardedId)) {
                            Wortal._log.warn("Multiple rewarded ad units found. Using the first one.");
                            continue;
                        }

                        this._data.rewardedId = adUnits.ads[i].placement_id;
                    } else if (adUnits.ads[i].display_format === "banner") {
                        if (isValidString(this._data.bannerId)) {
                            Wortal._log.warn("Multiple banner ad units found. Using the first one.");
                            continue;
                        }

                        this._data.bannerId = adUnits.ads[i].placement_id;
                    }
                }
            }).catch((error: any) => {
                throw operationFailed(error, "_getAdUnitIDs");
            });
        }).catch((error: any) => {
            throw operationFailed(error, "_getAdUnitIDs");
        });
    }
}
