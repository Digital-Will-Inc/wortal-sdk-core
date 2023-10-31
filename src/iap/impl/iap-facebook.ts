import { API_URL, WORTAL_API } from "../../data/core-data";
import { rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Facebook } from "../../errors/interfaces/facebook-error";
import Wortal from "../../index";
import { IAPBase } from "../iap-base";
import { Product } from "../interfaces/product";
import { Purchase } from "../interfaces/purchase";
import { PurchaseConfig } from "../interfaces/purchase-config";
import { SubscribableProduct } from "../interfaces/subscribable-product";
import { Subscription } from "../interfaces/subscription";

/**
 * Facebook implementation of the IAP API.
 * @hidden
 */
export class IAPFacebook extends IAPBase {
    constructor() {
        super();
    }

    protected cancelSubscriptionAsyncImpl(purchaseToken: string): Promise<void> {
        return Wortal._internalPlatformSDK.payments.cancelSubscriptionAsync(purchaseToken)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC, API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC);
            });
    }

    protected consumePurchaseAsyncImpl(token: string): Promise<void> {
        return Wortal._internalPlatformSDK.payments.consumePurchaseAsync(token)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC);
            });
    }

    protected getCatalogAsyncImpl(): Promise<Product[]> {
        return Wortal._internalPlatformSDK.payments.getCatalogAsync()
            .then((products: Product[]) => {
                return products;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);
            });
    }

    protected getPurchasesAsyncImpl(): Promise<Purchase[]> {
        return Wortal._internalPlatformSDK.payments.getPurchasesAsync()
            .then((purchases: Purchase[]) => {
                return purchases;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);
            });
    }

    protected getSubscribableCatalogAsyncImpl(): Promise<SubscribableProduct[]> {
        return Wortal._internalPlatformSDK.payments.getSubscribableCatalogAsync()
            .then((products: SubscribableProduct[]) => {
                return products;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC, API_URL.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC);
            });
    }

    protected getSubscriptionsAsyncImpl(): Promise<Subscription[]> {
        return Wortal._internalPlatformSDK.payments.getSubscriptionsAsync()
            .then((subscriptions: Subscription[]) => {
                return subscriptions;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_GET_SUBSCRIPTIONS_ASYNC, API_URL.IAP_GET_SUBSCRIPTIONS_ASYNC);
            });
    }

    protected isEnabledImpl(): boolean {
        return this._isIAPEnabled;
    }

    protected makePurchaseAsyncImpl(purchase: PurchaseConfig): Promise<Purchase> {
        return Wortal._internalPlatformSDK.payments.purchaseAsync(purchase)
            .then((purchase: Purchase) => {
                return purchase;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
            });
    }

    protected purchaseSubscriptionAsyncImpl(productID: string): Promise<Subscription> {
        return Wortal._internalPlatformSDK.payments.purchaseSubscriptionAsync(productID)
            .then((subscription: Subscription) => {
                return subscription;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC, API_URL.IAP_PURCHASE_SUBSCRIPTION_ASYNC);
            });
    }

}
