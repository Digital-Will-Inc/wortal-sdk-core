import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { IAPBase } from "../iap-base";
import { Product } from "../interfaces/product";
import { Purchase } from "../interfaces/purchase";
import { PurchaseConfig } from "../interfaces/purchase-config";
import { SubscribableProduct } from "../interfaces/subscribable-product";
import { Subscription } from "../interfaces/subscription";

/**
 * Poki implementation of the IAP API.
 * @hidden
 */
export class IAPPoki extends IAPBase {
    protected cancelSubscriptionAsyncImpl(purchaseToken: string): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC, API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC));
    }

    protected consumePurchaseAsyncImpl(token: string): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC));
    }

    protected getCatalogAsyncImpl(): Promise<Product[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC));
    }

    protected getPurchasesAsyncImpl(): Promise<Purchase[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC));
    }

    protected getSubscribableCatalogAsyncImpl(): Promise<SubscribableProduct[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC, API_URL.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC));
    }

    protected getSubscriptionsAsyncImpl(): Promise<Subscription[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIPTIONS_ASYNC, API_URL.IAP_GET_SUBSCRIPTIONS_ASYNC));
    }

    protected isEnabledImpl(): boolean {
        return false;
    }

    protected makePurchaseAsyncImpl(purchase: PurchaseConfig): Promise<Purchase> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC));
    }

    protected purchaseSubscriptionAsyncImpl(productID: string): Promise<Subscription> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC, API_URL.IAP_PURCHASE_SUBSCRIPTION_ASYNC));
    }

    protected _tryEnableIAPImpl(): void {
        this._isIAPEnabled = false;
        Wortal._log.debug(`IAP not supported in this session. This may be due to platform, device or regional restrictions. \nPlatform: ${Wortal._internalPlatform} // Device: ${Wortal.session.getDevice()} // Region: ${Wortal.session._internalSession.country}`);
    }

}
