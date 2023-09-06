import { config } from "../api";
import Wortal from "../index";
import {
    AdCallbacks,
    AdConfigData,
    AdData,
    AdInstanceData, AdSenseConfig,
    FacebookAdUnitsResponse,
    GDCallbacks,
    IAdInstance
} from "../interfaces/ads";
import { AdCallEventData, AnalyticsEventData } from "../interfaces/analytics";
import { Error_Facebook_Rakuten } from "../interfaces/wortal";
import { PlacementType } from "../types/ads";
import { APIEndpoints, GD_EVENTS } from "../types/wortal";
import { API_URL, WORTAL_API } from "../utils/config";
import { initializationError, operationFailed, rethrowError_Facebook_Rakuten } from "../utils/error-handler";
import { debug, exception, warn } from "../utils/logger";
import { isValidPlacementType } from "../utils/validators";
import { addGDCallback } from "../utils/wortal-utils";
import { AnalyticsEvent } from "./analytics";

/** @hidden */
class AdInstance implements IAdInstance {
    adData: AdData;
    callbacks: AdCallbacks;
    retryAttempts: number;

    constructor(data: AdInstanceData, retryAttempts: number = 3) {
        this.adData = {
            adUnitId: data.adUnitId,
            description: data.description,
            isValid: true,
        };
        this.callbacks = {
            beforeAd: data.beforeAd,
            afterAd: data.afterAd,
            noFill: data.noFill,
        };
        this.retryAttempts = retryAttempts;
    }

    show(): void {}

    /* eslint-disable-next-line */
    logEvent(success: boolean, viewedReward?: boolean): void {}
}

/** @hidden */
export class InterstitialAd extends AdInstance {
    constructor(data: AdInstanceData) {
        super(data);
        if (!isValidPlacementType(data.placementType)) {
            exception(`Invalid placement type: ${data.placementType}`);
            this.adData.isValid = false;
            return;
        }

        this.adData.placementType = data.placementType;
    }

    show(): void {
        // This is a case where the placement type is not valid, so we don't show the ad.
        // We already logged the event in the constructor.
        if (!this.adData.isValid) {
            return;
        }

        let attempt: number = 0;

        const showAdFn = () => {
            config.adConfig.adCalled();
            _showAd(
                this.adData.placementType!, // We already validated in the constructor.
                this.adData.adUnitId,
                this.adData.description,
                {
                    beforeAd: this.callbacks.beforeAd,
                    afterAd: () => {
                        config.adConfig.adShown();
                        this.logEvent(true);
                        this.callbacks.afterAd();
                    },
                    noFill: () => {
                        const platform = config.session.platform;
                        if (platform === "viber") {
                            debug("Ad not filled, showing backfill..");
                            _showBackFill(this.adData.placementType!, this.adData.description, this.callbacks);
                            return;
                        }

                        if (attempt < this.retryAttempts && this.adData.placementType !== "preroll") {
                            attempt++;
                            debug("Ad not filled, retrying.. \n Retry attempt: " + attempt);
                            this.logEvent(false);
                            showAdFn();
                        } else {
                            debug("Exceeded retry attempts. Show failed.");
                            this.logEvent(false);
                            this.callbacks.noFill();
                        }
                    },
                    // Preroll ads on Wortal platform only take the adBreakDone callback.
                    adBreakDone: this.adData.placementType === "preroll" ?
                        () => {
                            this.callbacks.afterAd();
                        } :
                        () => debug("adBreakDone")
                }
            );
        };

        showAdFn();
    }

    logEvent(success: boolean) {
        // We log different events for Wortal platform which are handled within the ad show function itself.
        if (config.session.platform === "wortal" || config.session.platform === "debug") {
            return;
        }

        const analyticsData: AdCallEventData = {
            format: "interstitial",
            placement: this.adData.placementType,
            platform: config.session.platform,
            success: success,
            playerID: config.player.id,
            gameID: config.session.gameId,
            playTimeAtCall: config.game.gameTimer,
        };

        const eventData: AnalyticsEventData = {
            name: "AdCall",
            features: analyticsData,
        };

        const event = new AnalyticsEvent(eventData);
        event.send();
    }
}

/** @hidden */
export class RewardedAd extends AdInstance {
    constructor(data: AdInstanceData) {
        super(data);
        this.adData.placementType = 'reward';
        this.callbacks.adDismissed = data.adDismissed;
        this.callbacks.adViewed = data.adViewed;
    }

    show(): void {
        let attempt: number = 0;

        const showAdFn = () => {
            config.adConfig.adCalled();
            _showAd(
                this.adData.placementType!, // We already assigned a valid type in the constructor.
                this.adData.adUnitId,
                this.adData.description, {
                    beforeAd: this.callbacks.beforeAd,
                    afterAd: () => {
                        config.adConfig.adShown();
                        this.callbacks.afterAd();
                    },
                    adDismissed: () => {
                        this.logEvent(true, false);
                        this.callbacks.adDismissed?.();
                    },
                    adViewed: () => {
                        this.logEvent(true, true);
                        this.callbacks.adViewed?.();
                    },
                    noFill: () => {
                        const platform = config.session.platform;
                        if (platform === "viber") {
                            debug("Ad not filled, showing backfill..");
                            _showBackFill(this.adData.placementType!, this.adData.description, this.callbacks);
                            return;
                        }

                        if (attempt < this.retryAttempts) {
                            attempt++;
                            debug("Ad not filled, retrying.. \n Retry attempt: " + attempt);
                            this.logEvent(false);
                            showAdFn();
                        } else {
                            debug("Exceeded retry attempts. Show failed.");
                            this.logEvent(false);
                            this.callbacks.noFill();
                        }
                    },
                    // This needs to be called on Wortal platform to trigger the ad to be shown after it is filled.
                    beforeReward: function (showAdFn: () => void): void {
                        showAdFn();
                    },
                    adBreakDone: () => debug("adBreakDone")
                });
        }

        showAdFn();
    }

    logEvent(success: boolean, viewedReward?: boolean) {
        // We log different events for Wortal platform which are handled within the ad show function itself.
        if (config.session.platform === "wortal" || config.session.platform === "debug") {
            return;
        }

        const analyticsData: AdCallEventData = {
            format: "rewarded",
            placement: this.adData.placementType,
            platform: config.session.platform,
            success: success,
            viewedRewarded: viewedReward,
            playerID: config.player.id,
            gameID: config.session.gameId,
            playTimeAtCall: config.game.gameTimer,
        };

        const eventData: AnalyticsEventData = {
            name: "AdCall",
            features: analyticsData,
        };

        const event = new AnalyticsEvent(eventData);
        event.send();
    }
}

/** @hidden */
export class AdConfig {
    private _current: AdConfigData = {
        isAdBlocked: false,
        hasPrerollShown: false,
        interstitialId: "",
        rewardedId: "",
        adsCalled: 0,
        adsShown: 0,
    };

    private _adSense: AdSenseConfig = {
        channelID: "",
        clientID: "",
        hostID: ""
    };

    // GD uses events to communicate the ad instance state rather than callbacks, so we need to store the callbacks
    // and call them when the events are triggered.
    private readonly _gdCallbacks: GDCallbacks | undefined;

    constructor() {
        debug("Initializing AdConfig..");
        const platform = config.session.platform;
        if (platform === "gd") {
            this._gdCallbacks = {};
        }
    }

    async lateInitialize(): Promise<void> {
        debug("Late initializing AdConfig..");
        const platform = config.session.platform;

        if (platform === "link" || platform === "viber") {
            await this._setLinkViberAdUnitIds();
            debug("AdConfig initialized: ", this._current);
            return Promise.resolve();
        } else if (platform === "facebook") {
            await this._setFacebookAdUnitIds();
            debug("AdConfig initialized: ", this._current);
            return Promise.resolve();
        } else {
            debug("AdConfig initialized: ", this._current);
            return Promise.resolve();
        }
    }

    get isAdBlocked(): boolean {
        return this._current.isAdBlocked;
    }

    setAdBlocked(isBlocked: boolean): void {
        this._current.isAdBlocked = isBlocked;
    }

    get hasPrerollShown(): boolean {
        return this._current.hasPrerollShown;
    }

    setPrerollShown(hasShown: boolean): void {
        this._current.hasPrerollShown = hasShown;
    }

    get interstitialId(): string {
        return this._current.interstitialId;
    }

    get rewardedId(): string {
        return this._current.rewardedId;
    }

    get clientID(): string {
        return this._adSense.clientID;
    }

    setClientID(clientID: string): void {
        this._adSense.clientID = clientID;
    }

    get hostID(): string {
        return this._adSense.hostID;
    }

    setHostID(hostID: string): void {
        this._adSense.hostID = hostID;
    }

    get channelID(): string {
        return this._adSense.channelID;
    }

    setChannelID(channelID: string): void {
        this._adSense.channelID = channelID;
    }

    get adsCalled(): number {
        return this._current.adsCalled;
    }

    get adsShown(): number {
        return this._current.adsShown;
    }

    adCalled(): void {
        this._current.adsCalled++;
    }

    adShown(): void {
        this._current.adsShown++;
    }

    get gdCallbacks(): GDCallbacks | undefined {
        return this._gdCallbacks;
    }

    /**
     * Fetches the ad unit IDs from Rakuten API.
     * @example Object returned
     *[
     *  {
     *    "id": "someID",
     *    "type": "INTERSTITIAL"
     *  }
     *]
     */
    private async _setLinkViberAdUnitIds(): Promise<void> {
        const functionName = "_setLinkViberAdUnitIds()";
        debug("Fetching ad unit IDs from Rakuten API..");
        if (config.platformSDK) {
            return config.platformSDK.getAdUnitsAsync().then((adUnits: any[]) => {
                if (adUnits == null || undefined) {
                    exception("Failed to retrieve ad units. This may be due to a server error or platform malfunction.");
                    return;
                }

                for (let i = 0; i < adUnits.length; i++) {
                    if (adUnits[i].type === "INTERSTITIAL") {
                        this._current.interstitialId = adUnits[i].id;
                    } else if (adUnits[i].type === "REWARDED_VIDEO") {
                        this._current.rewardedId = adUnits[i].id;
                    }
                }
            }).catch((error: Error_Facebook_Rakuten) => {
                throw rethrowError_Facebook_Rakuten(error, functionName);
            });
        } else {
            return Promise.reject(initializationError("Platform SDK not yet initialized.", functionName));
        }
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
    private async _setFacebookAdUnitIds(): Promise<void> {
        const functionName = "_setFacebookAdUnitIds()";
        debug("Fetching Facebook ad units from Wortal API..");
        if (typeof (window as any).wortalGameID === "undefined") {
            return Promise.reject(initializationError("Failed to retrieve wortalGameID. This may be due to an error when uploading the game bundle to Facebook.", functionName));
        }

        const url = APIEndpoints.ADS + (window as any).wortalGameID;
        await fetch(url).then((response: Response) => {
            debug("Fetching Facebook ad units from Wortal API response: ", response);
            return response.json().then((adUnits: FacebookAdUnitsResponse) => {
                debug("Fetching Facebook ad units from Wortal API response JSON: ", adUnits);
                if ((adUnits == null || undefined) || (adUnits.ads == null || undefined)) {
                    exception("Failed to retrieve ad units. This may be due to a server issue or the API being currently unavailable.");
                    return;
                }

                if (adUnits.ads.length === 0) {
                    warn("No ad units returned. Please contact your Wortal representative to set up your ad units before attempting to show ads.");
                    return;
                }

                for (let i = 0; i < adUnits.ads.length; i++) {
                    if (adUnits.ads[i].display_format === "interstitial") {
                        this._current.interstitialId = adUnits.ads[i].placement_id;
                    } else if (adUnits.ads[i].display_format === "rewarded_video") {
                        this._current.rewardedId = adUnits.ads[i].placement_id;
                    }
                }
            }).catch((error: any) => {
                throw operationFailed(error, functionName);
            });
        }).catch((error: any) => {
            throw operationFailed(error, functionName);
        });
    }
}

/**
 * Shows an ad. This replaces the triggerWortalAd() call from the deprecated wortal.js. It was simpler to just
 * implement the logic from that function here rather than try to refactor the ad calls in the instance implementations.
 * @hidden
 */
function _showAd(placementType: PlacementType, placementId: string, description: string, callbacks: AdCallbacks): void {
    switch (config.session.platform) {
        case "wortal":
        case "debug":
            return _showAd_Wortal(placementType, description, callbacks);
        case "link":
        case "viber":
        case "facebook":
            return _showAd_Facebook_Rakuten(placementType, placementId, callbacks);
        case "gd":
            return _showAd_GD(placementType, callbacks);
        case "crazygames":
            return _showAd_CrazyGames(placementType, callbacks);
        default:
            exception(`Unsupported platform for ads: ${config.session.platform}`);
    }
}

/**
 * See: https://developers.google.com/ad-placement/apis/adbreak
 * @hidden
 */
function _showAd_Wortal(placement: PlacementType, description: string, callbacks: AdCallbacks): void {
    debug("Showing ad", description);

    let adShown = false;
    const params: any = {
        type: placement,
        name: description,
    }

    params.adBreakDone = function (placementInfo: any) {
        debug("Placement info", placementInfo);
        const event = new AnalyticsEvent({
            name: 'AdBreakDone',
            features: {
                client_id: config.adConfig.clientID,
                host_channel_id: config.adConfig.channelID,
                host_id: config.adConfig.hostID,
                session_id: (window as any).wortalSessionId,
                placement,
                breakFormat: placementInfo.breakFormat,
                breakStatus: placementInfo.breakStatus,
            }
        });

        event.send();
        callbacks.adBreakDone && callbacks.adBreakDone(placementInfo);
    }

    if (callbacks.beforeReward) {
        params.beforeReward = callbacks.beforeReward
    }

    if (callbacks.adDismissed) {
        params.adDismissed = callbacks.adDismissed
    }

    if (callbacks.adViewed) {
        params.adViewed = callbacks.adViewed
    }

    if (placement === "preroll") {
        debug("Attempting to show preroll..");
        // Set a timeout to handle ads not showing.
        setTimeout(() => {
            debug("Ad did not show. Skipping..");
            if (typeof callbacks.noFill !== "function") {
                return;
            } else {
                callbacks.noFill();
            }
        }, 500);

        (window as any).adBreak(params);
    } else {
        debug("Attempting to show", placement);
        // Set a timeout to handle ads not showing.
        setTimeout(function () {
            if (adShown) {
                const event = new AnalyticsEvent({
                    name: 'AdShown',
                    features: {
                        client_id: config.adConfig.clientID,
                        host_channel_id: config.adConfig.channelID,
                        host_id: config.adConfig.hostID,
                        session_id: (window as any).wortalSessionId,
                        placement
                    }
                });

                event.send();
            } else {
                debug("Ad did not show. Skipping..");
                if (typeof callbacks.noFill !== "function") {
                    return;
                } else {
                    callbacks.noFill();
                }
            }
        }, 500);

        params.beforeAd = function () {
            adShown = true;
            callbacks.beforeAd();
        };

        params.afterAd = callbacks.afterAd;
        (window as any).adBreak(params);
    }
}

/**
 * See: https://lg.rgames.jp/docs/api
 *
 * Also: https://docs.viberplay.io/docs/api
 *
 * Also: https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant7.1/
 * @hidden
 */
function _showAd_Facebook_Rakuten(placementType: PlacementType, placementId: string, callbacks: AdCallbacks): void {
    if (typeof config.platformSDK === "undefined") {
        exception("Platform SDK not initialized. This is a fatal error that should have been caught during initialization.");
        return;
    }

    if (placementType === "reward") {
        return _showRewarded_Facebook_Rakuten(placementId, callbacks);
    } else {
        return _showInterstitial_Facebook_Rakuten(placementId, callbacks);
    }
}

/**
 * See: https://gamedistribution.com/sdk/html5
 * @hidden
 */
function _showAd_GD(placementType: PlacementType, callbacks: AdCallbacks): void {
    if (typeof config.platformSDK === "undefined") {
        exception("Platform SDK not initialized. This is a fatal error that should have been caught during initialization.");
        return;
    }

    if (placementType === "reward") {
        return _showRewarded_GD(callbacks);
    } else {
        return _showInterstitial_GD(placementType, callbacks);
    }
}

/**
 * See: https://docs.crazygames.com/sdk/html5-v2/
 * @hidden
 */
function _showAd_CrazyGames(placementType: PlacementType, callbacks: AdCallbacks): void {
    if (typeof config.platformSDK === "undefined") {
        exception("Platform SDK not initialized. This is a fatal error that should have been caught during initialization.");
        return;
    }

    if (placementType === "reward") {
        return _showRewarded_CrazyGames(callbacks);
    } else {
        return _showInterstitial_CrazyGames(callbacks);
    }
}

/** @hidden */
function _showInterstitial_Facebook_Rakuten(placementId: string, callbacks: AdCallbacks) {
    debug("Attempting to show interstitial ad..");
    let preloadedInterstitial: any = null;
    config.platformSDK.getInterstitialAdAsync(placementId)
        .then((interstitial: any) => {
            debug("Interstitial ad fetched successfully. Attempting to load..", interstitial);
            callbacks.beforeAd && callbacks.beforeAd();
            preloadedInterstitial = interstitial;
            return preloadedInterstitial.loadAsync();
        })
        .then(() => {
            debug("Interstitial ad loaded successfully. Attempting to show..");
            preloadedInterstitial.showAsync()
                .then(() => {
                    debug("Interstitial ad finished successfully.");
                    callbacks.afterAd && callbacks.afterAd();
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    debug("Interstitial ad failed to show.", error);
                    _onAdErrorOrNoFill(error, callbacks);
                });
        })
        .catch((error: Error_Facebook_Rakuten) => {
            debug("Interstitial ad failed to load.", error);
            _onAdErrorOrNoFill(error, callbacks);
        });
}

/** @hidden */
function _showInterstitial_GD(placementType: PlacementType, callbacks: AdCallbacks): void {
    debug("Attempting to show interstitial ad..");
    addGDCallback(GD_EVENTS.BEFORE_AD, callbacks.beforeAd);
    addGDCallback(GD_EVENTS.AFTER_AD, callbacks.afterAd);
    addGDCallback(GD_EVENTS.NO_FILL, callbacks.noFill);

    if (typeof config.platformSDK !== "undefined" && config.platformSDK.showAd !== "undefined") {
        config.platformSDK.showAd("interstitial");
    }
}

/** @hidden */
function _showInterstitial_CrazyGames(callbacks: AdCallbacks): void {
    const callbacksObj = {
        adStarted: callbacks.beforeAd,
        adFinished: callbacks.afterAd,
        adError: (error: any) => { _onAdErrorOrNoFill(error, callbacks); },
    };
    config.platformSDK.ad.requestAd("midgame", callbacksObj);
}

/** @hidden */
function _showRewarded_Facebook_Rakuten(placementId: string, callbacks: AdCallbacks) {
    debug("Attempting to show rewarded video..");
    let preloadedRewardedVideo: any = null;
    config.platformSDK.getRewardedVideoAsync(placementId)
        .then((rewarded: any) => {
            debug("Rewarded video fetched successfully. Attempting to load..", rewarded);
            callbacks.beforeAd && callbacks.beforeAd();
            preloadedRewardedVideo = rewarded;
            return preloadedRewardedVideo.loadAsync();
        })
        .then(() => {
            debug("Rewarded video loaded successfully. Attempting to show..");
            preloadedRewardedVideo.showAsync()
                .then(() => {
                    debug("Rewarded video watched successfully");
                    callbacks.adViewed && callbacks.adViewed();
                    callbacks.afterAd && callbacks.afterAd();
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    debug("Rewarded video failed to show.", error);
                    callbacks.adDismissed && callbacks.adDismissed();
                    callbacks.afterAd && callbacks.afterAd();
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.ADS_SHOW_REWARDED, API_URL.ADS_SHOW_REWARDED);
                });
        })
        .catch((error: Error_Facebook_Rakuten) => {
            debug("Rewarded video failed to load.", error);
            _onAdErrorOrNoFill(error, callbacks);
        });
}

/** @hidden */
function _showRewarded_GD(callbacks: AdCallbacks): void {
    debug("Attempting to show rewarded video..");
    addGDCallback(GD_EVENTS.BEFORE_AD, callbacks.beforeAd);
    addGDCallback(GD_EVENTS.AFTER_AD, callbacks.afterAd);
    addGDCallback(GD_EVENTS.NO_FILL, callbacks.noFill);
    if (callbacks.adDismissed) {
        addGDCallback(GD_EVENTS.AD_DISMISSED, callbacks.adDismissed);
    } else {
        addGDCallback(GD_EVENTS.AD_DISMISSED, () => debug("No adDismissed callback provided."));
    }
    if (callbacks.adViewed) {
        addGDCallback(GD_EVENTS.AD_VIEWED, callbacks.adViewed);
    } else {
        exception("No adViewed callback provided. This is required for rewarded ads.");
        return;
    }

    if (typeof config.platformSDK !== "undefined" && config.platformSDK.preloadAd !== "undefined") {
        config.platformSDK.preloadAd("rewarded")
            .then(() => {
                config.platformSDK.showAd("rewarded")
                    .then(() => {
                        callbacks.afterAd && callbacks.afterAd();
                    })
                    .catch((error: any) => {
                        debug("Rewarded video failed to show.");
                        _onAdErrorOrNoFill(error, callbacks);
                    });
            })
            .catch((error: any) => {
                debug("Rewarded video failed to show.");
                _onAdErrorOrNoFill(error, callbacks);
            });
    } else {
        debug("Rewarded video failed to show.");
        _onAdErrorOrNoFill("No ad instance was found.", callbacks);
    }
}

/** @hidden */
function _showRewarded_CrazyGames(callbacks: AdCallbacks): void {
    const callbacksObj = {
        adStarted: callbacks.beforeAd,
        adFinished: () => {
            callbacks.afterAd && callbacks.afterAd();
            callbacks.adViewed && callbacks.adViewed();
        },
        adError: (error: any) => {
            callbacks.adDismissed && callbacks.adDismissed();
            _onAdErrorOrNoFill(error, callbacks);
        },
    };
    config.platformSDK.ad.requestAd("rewarded", callbacksObj);
}

/**
 * Backfills an ad when a platform does not fill an ad request. Uses AFG to show the ad.
 * @hidden
 */
function _showBackFill(placementType: PlacementType, description: string, callbacks: AdCallbacks): void {
    debug("Showing backfill ad", description);

    let adShown = false;
    const params: any = {
        type: placementType,
        name: description,
        google_ad_client: config.adConfig.clientID,
        google_ad_channel: config.adConfig.channelID,
        google_ad_host: config.adConfig.hostID,
    };

    params.adBreakDone = function (placementInfo: any) {
        debug("Placement info", placementInfo);
        const event = new AnalyticsEvent({
            name: 'AdBreakDone',
            features: {
                client_id: config.adConfig.clientID,
                host_channel_id: config.adConfig.channelID,
                host_id: config.adConfig.hostID,
                session_id: Wortal.player.getID(),
                placementType,
                breakFormat: placementInfo.breakFormat,
                breakStatus: placementInfo.breakStatus,
            }
        });

        event.send();
        callbacks.adBreakDone && callbacks.adBreakDone(placementInfo);
    }

    if (callbacks.beforeReward) {
        params.beforeReward = callbacks.beforeReward
    }

    if (callbacks.adDismissed) {
        params.adDismissed = callbacks.adDismissed
    }

    if (callbacks.adViewed) {
        params.adViewed = callbacks.adViewed
    }

    debug("Attempting to show", placementType);
    // Set a timeout to handle ads not showing.
    setTimeout(function () {
        if (adShown) {
            const event = new AnalyticsEvent({
                name: 'AdShown',
                features: {
                    client_id: config.adConfig.clientID,
                    host_channel_id: config.adConfig.channelID,
                    host_id: config.adConfig.hostID,
                    session_id: Wortal.player.getID(),
                    placementType
                }
            });

            event.send();
        } else {
            debug("Ad did not show. Skipping..");
            if (typeof callbacks.noFill !== "function") {
                return;
            } else {
                callbacks.noFill();
            }
        }
    }, 500);

    params.beforeAd = function () {
        adShown = true;
        callbacks.beforeAd();
    };

    params.afterAd = callbacks.afterAd;
    (window as any).adBreak(params);
}

/**
 * Called when there was an error, timeout or no fill for an ad instance.
 * @hidden
 */
function _onAdErrorOrNoFill(error: any, callbacks: any) {
    warn("Ad instance encountered an error or was not filled.", error);
    callbacks.noFill && callbacks.noFill();
}


