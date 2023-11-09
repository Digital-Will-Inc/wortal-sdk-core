import { AdCallbacks_Yandex, AdStatus_Yandex } from "../../ads/interfaces/yandex-ads";
import { PurchaseConfig } from "../../iap/interfaces/purchase-config";
import { Product_Yandex } from "../../iap/interfaces/yandex-product";
import { Purchase_Yandex } from "../../iap/interfaces/yandex-purchase";

/**
 * Yandex SDK interface
 * @hidden
 */
export interface YandexSDK {
    init(): Promise<YandexSDK>;
    getPayments(params: {signed: true}): Promise<YandexIAPObject>;
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

/**
 * Object used by Yandex SDK to access the In-App Purchases API.
 * https://yandex.com/dev/games/doc/en/sdk/sdk-purchases
 * @hidden
 */
export interface YandexIAPObject {
    purchase(purchaseConfig: PurchaseConfig): Promise<Purchase_Yandex>;
    getCatalog(): Promise<Product_Yandex[]>;
    getPurchases(): Promise<Purchase_Yandex[]>;
    consumePurchase(token: string): Promise<void>;
}
