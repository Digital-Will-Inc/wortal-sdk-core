import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdInstanceData } from "../interfaces/ad-data";
import { AdSense_AdBreakParams, AdSense_PlacementInfo } from "../interfaces/ad-sense";
import { BannerPosition } from "../types/banner-position";

/**
 * Debug implementation of the Ads API. This uses Google AdSense in debug mode to display example ads and ensure
 * that the API is being used correctly.
 * @hidden
 */
export class AdsDebug extends AdsBase {
    constructor(config: AdConfig) {
        super(config);

        // This is the global function that the AdSense SDK uses to register ad breaks.
        // https://developers.google.com/ad-placement/docs/html5-game-structure
        window.adsbygoogle = window.adsbygoogle || [];
        window.adBreak = window.adConfig = function (o: any) {
            window.adsbygoogle.push(o);
        };
    }

    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_BANNER, API_URL.ADS_SHOW_BANNER);
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        Wortal._log.debug(`Attempting to show placement: ${ad.placementType} // ${ad.description}`);
        this._adConfig.adCalled();

        // Params are what we pass into the adBreak function, which is a global function provided by the AdSense SDK.
        const params: AdSense_AdBreakParams = {
            type: ad.placementType,
            name: ad.description,
            adBreakDone: (placementInfo: AdSense_PlacementInfo) => {
                Wortal._log.debug(`Ad break done: ${ad.placementType}.`, placementInfo);
                ad.callbacks.adBreakDone?.(placementInfo);

                // Preroll ads don't have an afterAd callback, so we'll call it here.
                if (ad.placementType === "preroll") {
                    ad.callbacks.afterAd();
                }
            }
        }

        // Don't add these for preroll or the Ad Placement API will throw an error.
        if (ad.placementType !== "preroll") {
            params.beforeAd = () => {
                ad.callbacks.beforeAd();
            };
            params.afterAd = () => {
                // Track successful ad show for fill rate analytics.
                this._adConfig.adShown();
                ad.callbacks.afterAd();
            };
        }

        window.adBreak(params);
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        Wortal._log.debug(`Attempting to show placement: ${ad.placementType} // ${ad.description}`);

        // Params are what we pass into the adBreak function.
        const params: AdSense_AdBreakParams = {
            type: ad.placementType,
            name: ad.description,
            beforeAd: () => {
                ad.callbacks.beforeAd();
            },
            afterAd: ad.callbacks.afterAd,
            adDismissed: ad.callbacks.adDismissed,
            adViewed: ad.callbacks.adViewed,
            beforeReward: (showAdFn: () => void) => {
                showAdFn();
            },
            adBreakDone: (placementInfo: AdSense_PlacementInfo) => {
                Wortal._log.debug(`Ad break done: ${ad.placementType}.`, placementInfo);
                ad.callbacks.adBreakDone?.(placementInfo);
            }
        }

        window.adBreak(params);
    }

}
