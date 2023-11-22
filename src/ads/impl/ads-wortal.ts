import { WombatEvent } from "../../analytics/classes/WombatEvent";
import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdInstanceData } from "../interfaces/ad-data";
import { AdSense_AdBreakParams, AdSense_PlacementInfo } from "../interfaces/ad-sense";
import { BannerPosition } from "../types/banner-position";

/**
 * Wortal implementation of the Ads API. This uses Google AdSense for ads.
 * @hidden
 */
export class AdsWortal extends AdsBase {
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
                this._logAdBreakDone(placementInfo, ad.placementType);
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
                this._logAdShown(ad.placementType);
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
            afterAd: () => {
                this._logAdShown(ad.placementType);
                ad.callbacks.afterAd();
            },
            adDismissed: ad.callbacks.adDismissed,
            adViewed: ad.callbacks.adViewed,
            beforeReward: (showAdFn: () => void) => {
                showAdFn();
            },
            adBreakDone: (placementInfo: AdSense_PlacementInfo) => {
                this._logAdBreakDone(placementInfo, ad.placementType);
                ad.callbacks.adBreakDone?.(placementInfo);
            }
        }

        window.adBreak(params);
    }

    // These events were used for ad tracking before we developed the Wortal SDK. To maintain historical data, we'll
    // continue to send these. This is only used by Wortal platform. All other platforms use the AdCall event.
    private _logAdBreakDone(placementInfo: AdSense_PlacementInfo, placementType: string): void {
        Wortal._log.debug("Placement info", placementInfo);
        const event = new WombatEvent({
            name: "AdBreakDone",
            features: {
                client_id: this._adConfig.clientID,
                host_channel_id: this._adConfig.channelID,
                host_id: this._adConfig.hostID,
                session_id: window.wortalSessionId,
                placementType,
                breakFormat: placementInfo.breakFormat,
                breakStatus: placementInfo.breakStatus,
            }
        });

        event.send();
    }

    private _logAdShown(placementType: string): void {
        const event = new WombatEvent({
            name: "AdShown",
            features: {
                client_id: this._adConfig.clientID,
                host_channel_id: this._adConfig.channelID,
                host_id: this._adConfig.hostID,
                session_id: window.wortalSessionId,
                placementType,
            }
        });

        event.send();
    }

}
