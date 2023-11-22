// @ts-nocheck

import Wortal from "../../src";
import { AdsBase } from "../../src/ads/ads-base";
import { AdConfig } from "../../src/ads/classes/ad-config";
import { WORTAL_API } from "../../src/data/core-data";
import { WortalLogger } from "../../src/utils/logger";

describe('showBanner', () => {
    let adConfig: AdConfig;
    let adsBase: AdsBase;

    beforeEach(() => {
        jest.clearAllMocks();

        adConfig = new AdConfig();
        adsBase = new AdsBase(adConfig);
    });

    it('should call showBannerImpl with correct parameters', () => {
        // Arrange
        const showBannerImplMock = jest.spyOn(adsBase as any, 'showBannerImpl');

        // Act
        adsBase.showBanner(true, "bottom");

        // Assert
        expect(showBannerImplMock).toHaveBeenCalledWith(true, "bottom");
    });

    it('should show banner at bottom when called with default parameters', () => {
        // Arrange
        const showBannerImplMock = jest.spyOn(adsBase as any, 'showBannerImpl');

        // Act
        adsBase.showBanner();

        // Assert
        expect(showBannerImplMock).toHaveBeenCalledWith(true, "bottom");
    });

    it('should hide banner when called with shouldShow=false', () => {
        // Arrange
        const showBannerImplMock = jest.spyOn(adsBase as any, 'showBannerImpl');

        // Act
        adsBase.showBanner(false);

        // Assert
        expect(showBannerImplMock).toHaveBeenCalledWith(false, "bottom");
    });

    it('should show banner at top when called with position="top"', () => {
        // Arrange
        const showBannerImplMock = jest.spyOn(adsBase as any, 'showBannerImpl');

        // Act
        adsBase.showBanner(true, "top");

        // Assert
        expect(showBannerImplMock).toHaveBeenCalledWith(true, "top");
    });

    it('should throw error when called with invalid position', () => {
        // Act & Assert
        expect(() => {
            adsBase.showBanner(true, "invalid");
        }).toThrowError("showBanner called with invalid position: Expected \"top\" or \"bottom\", got invalid");
    });

    it('should throw error when called with invalid shouldShow parameter', () => {
        // Act & Assert
        expect(() => {
            adsBase.showBanner("invalid");
        }).toThrowError("showBanner called with invalid shouldShow parameter. Expected boolean, got string");
    });

    it('should throw error when called with null position', () => {
        // Act & Assert
        expect(() => {
            adsBase.showBanner(true, null);
        }).toThrowError("showBanner called with invalid position: Expected \"top\" or \"bottom\", got null");
    });

    it('should throw error when called with null shouldShow parameter', () => {
        // Act & Assert
        expect(() => {
            adsBase.showBanner(null);
        }).toThrowError("showBanner called with invalid shouldShow parameter. Expected boolean, got object");
    });

    it('should log API call to WortalLogger', () => {
        // Arrange
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');

        // Act
        adsBase.showBanner();

        // Assert
        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ADS_SHOW_BANNER);
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

    it('should call showInterstitialImpl with the correct parameters without noFill', () => {
        // Arrange
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();

        const showInterstitialImplMock = jest.spyOn(adsBase as any, 'showInterstitialImpl');

        // Act
        adsBase.showInterstitial(placement, description, beforeAd, afterAd);

        // Assert
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

    it('should call showInterstitialImpl with the correct parameters with noFill', () => {
        // Arrange
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();

        const showInterstitialImplMock = jest.spyOn(adsBase as any, 'showInterstitialImpl');

        // Act
        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        // Assert
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
        // Arrange
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();
        adsBase.showInterstitialImpl = jest.fn().mockImplementation((ad) => {
            ad.callbacks.afterAd?.();
        });

        // Act
        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        // Assert
        expect(afterAd).toHaveBeenCalled();
    });

    it('should call the noFill callback when no ad is shown', () => {
        // Arrange
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();
        adsBase.showInterstitialImpl = jest.fn().mockImplementation((ad) => {
            ad.callbacks.noFill?.();
        });

        // Act
        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        // Assert
        expect(noFill).toHaveBeenCalled();
    });

    it('should call noFill callback and not call showInterstitialImpl when isAdBlocked is true', () => {
        // Arrange
        adConfig.setAdBlocked(true);
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();

        const showInterstitialImplMock = jest.spyOn(adsBase as any, 'showInterstitialImpl');

        // Act
        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        // Assert
        expect(noFill).toHaveBeenCalled();
        expect(showInterstitialImplMock).not.toHaveBeenCalled();
    });

    it('should call noFill callback and throw an error when showInterstitialImpl throws error', () => {
        // Arrange
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();
        adsBase.showInterstitialImpl = jest.fn(() => {
            throw new Error("showInterstitialImpl error");
        });

        // Act & Assert
        expect(() =>
            adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill)
        ).toThrowError("showInterstitialImpl error");
        expect(noFill).toHaveBeenCalled();
    });

    it('should throw error when called with null placement', () => {
        // Act & Assert
        expect(() => {
            adsBase.showInterstitial(null);
        }).toThrowError("showInterstitial called with invalid placement type: null");
    });

    it('should throw error when called with invalid placement', () => {
        // Act & Assert
        expect(() => {
            adsBase.showInterstitial("invalid");
        }).toThrowError("showInterstitial called with invalid placement type: invalid");
    });

    it('should throw error when called with reward placement', () => {
        // Act & Assert
        expect(() => {
            adsBase.showInterstitial("reward");
        }).toThrowError("showInterstitial called with placement type 'reward'. Call showRewarded instead to display a rewarded ad.");
    });

    it('should throw error when called with preroll placement and preroll was already shown', () => {
        // Arrange
        adsBase._internalAdConfig.setPrerollShown(true);

        // Act & Assert
        expect(() => {
            adsBase.showInterstitial("preroll");
        }).toThrowError("Preroll ads can only be shown once during game load.");
    });

    it('should throw error when called with preroll placement and preroll game timer is greater than 10', () => {
        // Arrange
        Object.defineProperty(Wortal, "session",
            {
                value: {
                    _internalGameState: {
                        gameTimer: 11,
                    }
                },
                writable: true,
            })

        // Act & Assert
        expect(() => {
            adsBase.showInterstitial("preroll");
        }).toThrowError("Preroll ads can only be shown once during game load.");
    });

    it('should throw error when called with preroll placement and platform does not support preroll', () => {
        // Arrange
        Object.defineProperty(Wortal, "_internalPlatform",
            {
                value: "facebook",
                writable: true,
            });

        // Act & Assert
        expect(() => {
            adsBase.showInterstitial("preroll");
        }).toThrowError("Current platform does not support preroll ads.");
    });

    it('should throw error when called with missing ad unit IDs and platform requires them', () => {
        // Arrange
        adConfig._data.interstitialId = null;
        Object.defineProperty(Wortal, "_internalPlatform",
            {
                value: "facebook",
                writable: true,
            });

        // Act & Assert
        expect(() => {
            adsBase.showInterstitial("next");
        }).toThrowError("Interstitial ad unit ID is missing or invalid.");
    });

    it('should log API call to WortalLogger', () => {
        // Arrange
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');
        const placement = "start";
        const description = "Interstitial Ad";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const noFill = jest.fn();

        // Act
        adsBase.showInterstitial(placement, description, beforeAd, afterAd, noFill);

        // Assert
        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ADS_SHOW_INTERSTITIAL);
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

    it('should call showRewardedImpl when all parameters are valid and ads are not blocked', () => {
        // Arrange
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();
        adsBase.showRewardedImpl = jest.fn();

        // Act
        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        // Assert
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
        // Arrange
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

        // Act
        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        // Assert
        expect(beforeAd).toHaveBeenCalled();
        expect(afterAd).toHaveBeenCalled();
        expect(adDismissed).toHaveBeenCalled();
    });

    it('should call the beforeAd, afterAd, and adViewed callbacks when an ad is shown and viewed', () => {
        // Arrange
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

        // Act
        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        // Assert
        expect(beforeAd).toHaveBeenCalled();
        expect(afterAd).toHaveBeenCalled();
        expect(adViewed).toHaveBeenCalled();
    });

    it('should call the noFill and adDismissed callbacks when ads are blocked', () => {
        // Arrange
        adConfig.setAdBlocked(true);
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();

        // Act
        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        // Assert
        expect(noFill).toHaveBeenCalled();
        expect(adDismissed).toHaveBeenCalled();
    });

    it('should call the noFill and adDismissed callbacks when validation fails', () => {
        // Arrange
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();
        adsBase.validateShowRewarded = jest.fn().mockReturnValue({ valid: false, error: new Error("Validation error") });

        // Act
        try {
            adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);
        } catch (error) {}

        // Assert
        expect(noFill).toHaveBeenCalled();
        expect(adDismissed).toHaveBeenCalled();
    });

    it('should call the noFill and adDismissed callbacks when showRewardedImpl throws error', () => {
        // Arrange
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();
        adsBase.showRewardedImpl = jest.fn(() => {
            throw new Error("showRewardedImpl error");
        });

        // Act & Assert
        expect(() => {
            adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill)
        }).toThrowError("showRewardedImpl error");
        expect(noFill).toHaveBeenCalled();
        expect(adDismissed).toHaveBeenCalled();
    });

    it('should throw error when called with invalid adViewed callback', () => {
        // Arrange
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = "invalid";
        const noFill = jest.fn();

        // Act & Assert
        expect(() => {
            adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);
        }).toThrowError("showRewarded called with invalid adViewed callback.");
    });

    it('should throw error when called with missing ad unit IDs and platform requires them', () => {
        // Arrange
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

        // Act & Assert
        expect(() => {
            adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);
        }).toThrowError("Rewarded ad unit ID is missing or invalid.");
    });

    it('should log API call to WortalLogger', () => {
        // Arrange
        const wortalLoggerMock = jest.spyOn(WortalLogger.prototype, 'apiCall');
        const description = "Watch this ad to earn rewards";
        const beforeAd = jest.fn();
        const afterAd = jest.fn();
        const adDismissed = jest.fn();
        const adViewed = jest.fn();
        const noFill = jest.fn();

        // Act
        adsBase.showRewarded(description, beforeAd, afterAd, adDismissed, adViewed, noFill);

        // Assert
        expect(wortalLoggerMock).toHaveBeenCalledWith(WORTAL_API.ADS_SHOW_REWARDED);
    });

});

