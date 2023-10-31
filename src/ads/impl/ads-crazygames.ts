import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { Error_CrazyGames } from "../../errors/types/crazygames-error-types";
import Wortal from "../../index";
import { warn } from "../../utils/logger";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdConfigNull } from "../classes/ad-config-null";
import { AdInstanceData } from "../interfaces/ad-data";
import { AdCallbacks_CrazyGames } from "../interfaces/crazygames-ads";
import { BannerPosition } from "../types/banner-position";

/**
 * CrazyGames implementation of the Ads API.
 * @hidden
 */
export class AdsCrazyGames extends AdsBase {
    protected _adConfig: AdConfig;

    constructor() {
        super();
        this._adConfig = new AdConfigNull();
    }

    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_BANNER, API_URL.ADS_SHOW_BANNER);
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        const callbacksObj: AdCallbacks_CrazyGames = {
            adStarted: ad.callbacks.beforeAd,
            adFinished: () => {
                ad.callbacks.afterAd();
                this.logAdCall("interstitial", ad.placementType, true);
            },
            adError: (error: Error_CrazyGames) => {
                warn(`Ad instance encountered an error or was not filled: ${error}`);
                ad.callbacks.noFill();
                this.logAdCall("interstitial", ad.placementType, false);
            },
        };

        Wortal._internalPlatformSDK.ad.requestAd("midgame", callbacksObj);
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        const callbacksObj: AdCallbacks_CrazyGames = {
            adStarted: ad.callbacks.beforeAd,
            adFinished: () => {
                ad.callbacks.adViewed?.();
                ad.callbacks.afterAd();
                this.logAdCall("rewarded", ad.placementType, true, true);
            },
            adError: (error: Error_CrazyGames) => {
                warn(`Ad instance encountered an error or was not filled: ${error}`);
                ad.callbacks.adDismissed?.();
                ad.callbacks.noFill();
                this.logAdCall("rewarded", ad.placementType, false, false);
            },
        };

        Wortal._internalPlatformSDK.ad.requestAd("rewarded", callbacksObj);
    }

}
