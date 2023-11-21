import { AdCallbacks_Yandex, AdStatus_Yandex } from "../../ads/interfaces/yandex-ads";
import { PurchaseConfig } from "../../iap/interfaces/purchase-config";
import { Product_Yandex } from "../../iap/interfaces/yandex-product";
import { Purchase_Yandex } from "../../iap/interfaces/yandex-purchase";
import {
    Leaderboard_Yandex,
    LeaderboardEntry_Yandex,
    LeaderboardGetEntriesOptions_Yandex, LeaderboardGetEntriesResult_Yandex
} from "../../leaderboard/interfaces/yandex-leaderboard";
import { PlayerPhotoSize_Yandex } from "../../player/types/yandex-player-types";

/*
* PLATFORM NOTE
* Yandex SDK uses different objects for accessing APIs such as IAP and Leaderboards, rather than just calling
* the SDK directly. This is why we have separate interfaces for each of these objects. Each module implementation that uses
* these objects will manage their lifecycle and call the appropriate methods on them, rather than _internalPlatformSDK.
*
* We take this approach because that's how the Yandex SDK docs explain to use the SDK. I'm not sure what the impact
* of repeatedly calling for these objects is, but it might be problematic to do so. This is why we store them in the
* implementation layer and only call for them once. The impl layer is also responsible for validating these objects
* as the base layer is not aware of them.
*
* Ex: Leaderboards are accessed via the YandexLeaderboardObject, which is created by calling getLeaderboards() on the SDK.
* This object is then stored in the implementation layer and used to call the appropriate methods such as getLeaderboardDescription().
*/

/**
 * Yandex SDK interface
 * https://yandex.com/dev/games/doc/en/sdk/sdk-about
 * @hidden
 */
export interface YandexSDK {
    init(): Promise<YandexSDK>;
    getPayments(params: {signed: true}): Promise<YandexIAPObject>;
    getLeaderboards(): Promise<YandexLeaderboardObject>;
    auth: {
        openAuthDialog(): Promise<void>;
    }
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

/**
 * Object used by Yandex SDK to access the Leaderboards API.
 * https://yandex.com/dev/games/doc/en/sdk/sdk-leaderboard
 * @hidden
 */
export interface YandexLeaderboardObject {
    getLeaderboardDescription(leaderboardName: string): Promise<Leaderboard_Yandex>;
    setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    getLeaderboardPlayerEntry(leaderboardName: string): Promise<LeaderboardEntry_Yandex>;
    getLeaderboardEntries(leaderboardName: string, options: LeaderboardGetEntriesOptions_Yandex): Promise<LeaderboardGetEntriesResult_Yandex>;
}

/**
 * Object used by Yandex SDK to access the Player API.
 * https://yandex.com/dev/games/doc/en/sdk/sdk-player
 * @hidden
 */
export interface YandexPlayerObject {
    setData(data: Record<string, unknown>, flush: boolean): Promise<void>;
    getData(keys: string[]): Promise<Record<string, unknown>>;
    setStats(stats: Record<string, number>): Promise<void>;
    incrementStats(stats: Record<string, number>): Promise<Record<string, number>>;
    getStats(keys: string[]): Promise<Record<string, number>>;
    getUniqueID(): string;
    getName(): string;
    getPhoto(size: PlayerPhotoSize_Yandex): string;
    getIDsPerGame(): Record<number, string>;
}
