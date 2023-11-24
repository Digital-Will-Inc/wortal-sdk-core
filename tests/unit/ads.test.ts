// @ts-nocheck

import Wortal from "../../src";
import { AdsBase } from "../../src/ads/ads-base";
import { AdConfig } from "../../src/ads/classes/ad-config";
import { WORTAL_API } from "../../src/data/core-data";
import { WortalLogger } from "../../src/utils/logger";

beforeAll(() => {
    Object.defineProperty(Wortal, "isInitialized",
        {
            value: true,
            writable: true,
        });
});

describe('showBanner', () => {
    let adConfig: AdConfig;
    let adsBase: AdsBase;

    beforeEach(() => {
        jest.clearAllMocks();

        adConfig = new AdConfig();
        adsBase = new AdsBase(adConfig);
    });

    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        adsBase.showBanner();

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ADS_SHOW_BANNER);
    });

    it('should call showBannerImpl with valid parameters', () => {
        const showBannerImplMock = jest.spyOn(adsBase as any, 'showBannerImpl');

        adsBase.showBanner(true, "bottom");

        expect(showBannerImplMock).toHaveBeenCalledWith(true, "bottom");
    });

    it('should show banner at bottom when called with default parameters', () => {
        const showBannerImplMock = jest.spyOn(adsBase as any, 'showBannerImpl');

        adsBase.showBanner();

        expect(showBannerImplMock).toHaveBeenCalledWith(true, "bottom");
    });

    it('should show banner at top when called with position="top"', () => {
        const showBannerImplMock = jest.spyOn(adsBase as any, 'showBannerImpl');

        adsBase.showBanner(true, "top");

        expect(showBannerImplMock).toHaveBeenCalledWith(true, "top");
    });

    it('should hide banner when called with shouldShow=false', () => {
        const showBannerImplMock = jest.spyOn(adsBase as any, 'showBannerImpl');

        adsBase.showBanner(false);

        expect(showBannerImplMock).toHaveBeenCalledWith(false, "bottom");
    });

    it('should throw error when called with invalid position', () => {
        expect(() => {
            adsBase.showBanner(true, "invalid");
        }).toThrowError("showBanner called with invalid position: Expected \"top\" or \"bottom\", got invalid");
    });

    it('should throw error when called with invalid shouldShow parameter', () => {
        expect(() => {
            adsBase.showBanner("invalid");
        }).toThrowError("showBanner called with invalid shouldShow parameter. Expected boolean, got string");
    });

    it('should throw error when called with null position', () => {
        expect(() => {
            adsBase.showBanner(true, null);
        }).toThrowError("showBanner called with invalid position: Expected \"top\" or \"bottom\", got null");
    });

    it('should throw error when called with null shouldShow parameter', () => {
        expect(() => {
            adsBase.showBanner(null);
        }).toThrowError("showBanner called with invalid shouldShow parameter. Expected boolean, got object");
    });

});

describe('showInterstitial', () => {
    let adConfig: AdConfig;
    let adsBase: AdsBase;

    beforeEach(() => {
        jest.clearAllMocks();

        adConfig = new AdConfig();
        adsBase = new AdsBase(adConfig);
    });

    afterEach(() => {
        Object.defineProperty(Wortal, "_internalPlatform",
            {
                value: "debug",
                writable: true,
            });
    });


    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();

        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ADS_SHOW_INTERSTITIAL);
    });

    it('should call showInterstitialImpl with valid parameters without noFill', () => {
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();

        const showInterstitialImplMock = jest.spyOn(adsBase as any, 'showInterstitialImpl');

        adsBase.showInterstitial(placement, description, beforeAd, afterAd);

        expect(showInterstitialImplMock).toHaveBeenCalledWith({
            placementType: placement,
            adUnitId: adConfig.interstitialId,
            description: description,
            callbacks: {
                beforeAd: beforeAd,
                afterAd: afterAd,
                noFill: afterAd,
            },
        });
    });

    it('should call showInterstitialImpl with valid parameters with noFill', () => {
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();

        const showInterstitialImplMock = jest.spyOn(adsBase as any, 'showInterstitialImpl');

        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        expect(showInterstitialImplMock).toHaveBeenCalledWith({
            placementType: placement,
            adUnitId: adConfig.interstitialId,
            description: description,
            callbacks: {
                beforeAd: beforeAd,
                afterAd: afterAd,
                noFill: noFill,
            },
        });
    });

    it('should call the afterAd callback when an ad is shown', () => {
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();
        adsBase.showInterstitialImpl = jest.fn().mockImplementation((ad) => {
            ad.callbacks.afterAd?.();
        });

        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        expect(afterAd).toHaveBeenCalled();
    });

    it('should call the noFill callback when no ad is shown', () => {
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();
        adsBase.showInterstitialImpl = jest.fn().mockImplementation((ad) => {
            ad.callbacks.noFill?.();
        });

        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        expect(noFill).toHaveBeenCalled();
    });

    it('should call the noFill callback when no ad is shown and afterAd is provided but noFill is not provided', () => {
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        adsBase.showInterstitialImpl = jest.fn().mockImplementation((ad) => {
            ad.callbacks.noFill?.();
        });

        adsBase.showInterstitial(placement, description, beforeAd, afterAd);

        expect(afterAd).toHaveBeenCalled();
    });

    it('should call noFill callback and not call showInterstitialImpl when isAdBlocked is true', () => {
        adConfig.setAdBlocked(true);
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();

        const showInterstitialImplMock = jest.spyOn(adsBase as any, 'showInterstitialImpl');

        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        expect(noFill).toHaveBeenCalled();
        expect(showInterstitialImplMock).not.toHaveBeenCalled();
    });

    it('should call noFill callback and throw an error when showInterstitialImpl throws error', () => {
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();
        adsBase.showInterstitialImpl = jest.fn(() => {
            throw new Error("showInterstitialImpl error");
        });

        expect(() =>
            adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill)
        ).toThrowError("showInterstitialImpl error");
        expect(noFill).toHaveBeenCalled();
    });

    it('should throw error when called with null placement', () => {
        expect(() => {
            adsBase.showInterstitial(null);
        }).toThrowError("showInterstitial called with invalid placement type: null");
    });

    it('should throw error when called with invalid placement', () => {
        expect(() => {
            adsBase.showInterstitial("invalid");
        }).toThrowError("showInterstitial called with invalid placement type: invalid");
    });

    it('should throw error when called with reward placement', () => {
        expect(() => {
            adsBase.showInterstitial("reward");
        }).toThrowError("showInterstitial called with placement type 'reward'. Call showRewarded instead to display a rewarded ad.");
    });

    it('should throw error when called with preroll placement and preroll was already shown', () => {
        adsBase._internalAdConfig.setPrerollShown(true);

        expect(() => {
            adsBase.showInterstitial("preroll");
        }).toThrowError("Preroll ads can only be shown once during game load.");
    });

    it('should throw error when called with preroll placement and preroll game timer is greater than 10', () => {
        Object.defineProperty(Wortal, "session",
            {
                value: {
                    _internalGameState: {
                        gameTimer: 11,
                    }
                },
                writable: true,
            })

        expect(() => {
            adsBase.showInterstitial("preroll");
        }).toThrowError("Preroll ads can only be shown once during game load.");
    });

    it('should throw error when called with preroll placement and platform does not support preroll', () => {
        Object.defineProperty(Wortal, "_internalPlatform",
            {
                value: "facebook",
                writable: true,
            });

        expect(() => {
            adsBase.showInterstitial("preroll");
        }).toThrowError("Current platform does not support preroll ads.");
    });

    it('should throw error when called with missing ad unit IDs and platform requires them', () => {
        adConfig._data.interstitialId = null;
        Object.defineProperty(Wortal, "_internalPlatform",
            {
                value: "facebook",
                writable: true,
            });

        expect(() => {
            adsBase.showInterstitial("next");
        }).toThrowError("Interstitial ad unit ID is missing or invalid.");
    });

});

describe('showRewarded', () => {
    let adConfig: AdConfig;
    let adsBase: AdsBase;

    beforeEach(() => {
        jest.clearAllMocks();

        adConfig = new AdConfig();
        adsBase = new AdsBase(adConfig);
    });

    afterEach(() => {
        Object.defineProperty(Wortal, "_internalPlatform",
            {
                value: "debug",
                writable: true,
            });
    });

    it('should log API call to WortalLogger', () => {
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();

        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ADS_SHOW_REWARDED);
    });

    it('should call showRewardedImpl when all parameters are valid and ads are not blocked', () => {
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();
        adsBase.showRewardedImpl = jest.fn();

        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        expect(adsBase.showRewardedImpl).toHaveBeenCalledWith({
            placementType: "reward",
            adUnitId: adConfig.rewardedId,
            description: description,
            callbacks: {
                beforeAd: beforeAd,
                afterAd: afterAd,
                adDismissed: adDismissed,
                adViewed: adViewed,
                noFill: noFill,
            }
        });
    });

    it('should call the beforeAd, afterAd, and adDismissed callbacks when an ad is shown and dismissed', () => {
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();
        adsBase.showRewardedImpl = jest.fn().mockImplementation((ad) => {
            ad.callbacks.beforeAd?.();
            ad.callbacks.afterAd?.();
            ad.callbacks.adDismissed?.();
        });

        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        expect(beforeAd).toHaveBeenCalled();
        expect(afterAd).toHaveBeenCalled();
        expect(adDismissed).toHaveBeenCalled();
    });

    it('should call the beforeAd, afterAd, and adViewed callbacks when an ad is shown and viewed', () => {
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();
        adsBase.showRewardedImpl = jest.fn().mockImplementation((ad) => {
            ad.callbacks.beforeAd?.();
            ad.callbacks.afterAd?.();
            ad.callbacks.adViewed?.();
        });

        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        expect(beforeAd).toHaveBeenCalled();
        expect(afterAd).toHaveBeenCalled();
        expect(adViewed).toHaveBeenCalled();
    });

    it('should call the noFill and adDismissed callbacks when ads are blocked', () => {
        adConfig.setAdBlocked(true);
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();

        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        expect(noFill).toHaveBeenCalled();
        expect(adDismissed).toHaveBeenCalled();
    });

    it('should call the noFill and adDismissed callbacks when validation fails', () => {
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();
        adsBase.validateShowRewarded = jest.fn().mockReturnValue({ valid: false, error: new Error("Validation error") });

        try {
            adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);
        } catch (error) {}

        expect(noFill).toHaveBeenCalled();
        expect(adDismissed).toHaveBeenCalled();
    });

    it('should call the noFill and adDismissed callbacks when showRewardedImpl throws error', () => {
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();
        adsBase.showRewardedImpl = jest.fn(() => {
            throw new Error("showRewardedImpl error");
        });

        expect(() => {
            adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill)
        }).toThrowError("showRewardedImpl error");
        expect(noFill).toHaveBeenCalled();
        expect(adDismissed).toHaveBeenCalled();
    });

    it('should throw error when called with invalid adViewed callback', () => {
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = "invalid";
        const noFill = jest.fn();

        expect(() => {
            adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);
        }).toThrowError("showRewarded called with invalid adViewed callback.");
    });

    it('should throw error when called with missing ad unit IDs and platform requires them', () => {
        adConfig._data.rewardedId = null;
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();
        Object.defineProperty(Wortal, "_internalPlatform",
            {
                value: "facebook",
                writable: true,
            });

        expect(() => {
            adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);
        }).toThrowError("Rewarded ad unit ID is missing or invalid.");
    });

});

