import { YandexIAPObject } from "../../core/interfaces/yandex-sdk";
import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported, rethrowError_Yandex } from "../../errors/error-handler";
import Wortal from "../../index";
import { IAPBase } from "../iap-base";
import { Product } from "../interfaces/product";
import { Purchase } from "../interfaces/purchase";
import { PurchaseConfig } from "../interfaces/purchase-config";
import { SubscribableProduct } from "../interfaces/subscribable-product";
import { Subscription } from "../interfaces/subscription";
import { Product_Yandex } from "../interfaces/yandex-product";
import { Purchase_Yandex } from "../interfaces/yandex-purchase";

/**
 * Yandex implementation of the IAP API.
 * @hidden
 */
export class IAPYandex extends IAPBase {
    // This is set in tryEnableIAP. If that fails then we know IAP is not available and the base layer will
    // reject all IAP calls in validation. We should never have a scenario where this is undefined, and we're
    // still trying to access it.
    private _iapObject!: YandexIAPObject;

    protected cancelSubscriptionAsyncImpl(purchaseToken: string): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC, API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC));
    }

    protected consumePurchaseAsyncImpl(token: string): Promise<void> {
        return this._iapObject.consumePurchase(token)
            .catch((error: any) => {
                throw rethrowError_Yandex(error, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC);
            });
    }

    protected getCatalogAsyncImpl(): Promise<Product[]> {
        return this._iapObject.getCatalog()
            .then((products: Product_Yandex[]) => {
                return products.map((product: Product_Yandex) => this._convertToWortalProduct(product));
            }).catch((error: any) => {
                throw rethrowError_Yandex(error, WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);
            });
    }

    protected getPurchasesAsyncImpl(): Promise<Purchase[]> {
        return this._iapObject.getPurchases()
            .then((purchases: Purchase_Yandex[]) => {
                return purchases.map((purchase: Purchase_Yandex) => this._convertToWortalPurchase(purchase));
            }).catch((error: any) => {
                throw rethrowError_Yandex(error, WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);
            });
    }

    protected getSubscribableCatalogAsyncImpl(): Promise<SubscribableProduct[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC, API_URL.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC));
    }

    protected getSubscriptionsAsyncImpl(): Promise<Subscription[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_GET_SUBSCRIPTIONS_ASYNC, API_URL.IAP_GET_SUBSCRIPTIONS_ASYNC));
    }

    protected isEnabledImpl(): boolean {
        return this._isIAPEnabled;
    }

    protected makePurchaseAsyncImpl(purchase: PurchaseConfig): Promise<Purchase> {
        return this._iapObject.purchase(purchase)
            .then((purchase: Purchase_Yandex) => {
                return this._convertToWortalPurchase(purchase);
            })
            .catch((error: any) => {
                //TODO: remove this warning after typing out all possible errors
                Wortal._log.warn("Purchase failed: no product with this id exists in the developer dashboard, the user didn't log in, changed their mind, and closed the payment window, the purchase timed out, there were insufficient funds, or for any other reason.")
                throw rethrowError_Yandex(error, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
            });
    }

    protected purchaseSubscriptionAsyncImpl(productID: string): Promise<Subscription> {
        return Promise.reject(notSupported(undefined, WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC, API_URL.IAP_PURCHASE_SUBSCRIPTION_ASYNC));
    }

    protected _tryEnableIAPImpl() {
        Wortal._internalPlatformSDK.getPayments({signed: true})
            .then((iapObject: YandexIAPObject) => {
                this._iapObject = iapObject;
                this._isIAPEnabled = true;
            })
            .catch((error: any) => {
                // For now, just log this and list the possible reasons given by Yandex.
                // https://yandex.com/dev/games/doc/en/sdk/sdk-purchases#install
                // TODO: handle error properly
                this._isIAPEnabled = false;
                Wortal._log.exception(error);
                Wortal._log.warn("Purchases are unavailable. Enable monetization in the developer dashboard. Make sure the Purchases tab in the developer dashboard features a table with at least one in-game product and the \"Purchases are allowed\" label.");
            });
    }

    private _convertToWortalProduct(product: Product_Yandex): Product {
        return {
            description: product.description,
            imageURI: product.imageURI,
            price: product.price,
            priceAmount: !isNaN(parseFloat(product.priceValue)) ? parseFloat(product.priceValue) : -1.0, //TODO: handle this as an error
            priceCurrencyCode: product.priceCurrencyCode,
            productID: product.id,
            title: product.title,
        };
    }

    private _convertToWortalPurchase(purchase: Purchase_Yandex): Purchase {
        return {
            productID: purchase.productId,
            purchaseToken: purchase.purchaseToken,
            signedRequest: purchase.signature,
            purchaseTime: "",
            paymentID: "",
        };
    }

}
