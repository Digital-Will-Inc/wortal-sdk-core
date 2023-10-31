import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { IAPBase } from "../iap-base";
import { Product } from "../interfaces/product";
import { Purchase } from "../interfaces/purchase";
import { PurchaseConfig } from "../interfaces/purchase-config";
import { SubscribableProduct } from "../interfaces/subscribable-product";
import { Subscription } from "../interfaces/subscription";

/**
 * Link implementation of the IAP API.
 * @hidden
 */
export class IAPLink extends IAPBase {
    constructor() {
        super();
    }

    protected cancelSubscriptionAsyncImpl(purchaseToken: string): Promise<void> {
        throw notSupported(undefined, WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC, API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC);
    }

    protected consumePurchaseAsyncImpl(token: string): Promise<void> {
        throw notSupported(undefined, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC);
    }

    protected getCatalogAsyncImpl(): Promise<Product[]> {
        throw notSupported(undefined, WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);
    }

    protected getPurchasesAsyncImpl(): Promise<Purchase[]> {
        throw notSupported(undefined, WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);
    }

    protected getSubscribableCatalogAsyncImpl(): Promise<SubscribableProduct[]> {
        throw notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC, API_URL.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC);
    }

    protected getSubscriptionsAsyncImpl(): Promise<Subscription[]> {
        throw notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIPTIONS_ASYNC, API_URL.IAP_GET_SUBSCRIPTIONS_ASYNC);
    }

    protected isEnabledImpl(): boolean {
        return false;
    }

    protected makePurchaseAsyncImpl(purchase: PurchaseConfig): Promise<Purchase> {
        throw notSupported(undefined, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
    }

    protected purchaseSubscriptionAsyncImpl(productID: string): Promise<Subscription> {
        throw notSupported(undefined, WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC, API_URL.IAP_PURCHASE_SUBSCRIPTION_ASYNC);
    }

}
