import { YandexAdFailReason } from "../types/yandex-ad-types";

/**
 * Ad callbacks used by Yandex. These get mapped to Wortal AdCallbacks at runtime.
 * @see AdCallbacks
 * @hidden
 */
export interface AdCallbacks_Yandex {
    onOpen(): void;
    onClose(wasShown: boolean): void;
    onError(error: unknown): void;
    onOffline?(): void;
    onRewarded?(): void;
}

/**
 * Represents the status of the Yandex banner ad.
 * @hidden
 */
export interface AdStatus_Yandex {
    stickyAdvIsShowing: boolean;
    reason?: YandexAdFailReason;
}
