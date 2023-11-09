import { AdCallbacks_Yandex, AdStatus_Yandex } from "../../ads/interfaces/yandex-ads";

/**
 * Yandex SDK interface
 * @hidden
 */
export interface YandexSDK {
    init(): Promise<YandexSDK>;
    features: {
        LoadingAPI?: {
            ready(): void;
        }
    },
    adv: {
        showFullscreenAdv(params: {callbacks: AdCallbacks_Yandex}): void;
        showRewardedVideo(params: {callbacks: AdCallbacks_Yandex}): void;
        getBannerAdvStatus(): Promise<AdStatus_Yandex>;
        showBannerAdv(): void;
        hideBannerAdv(): void;
    }
}
