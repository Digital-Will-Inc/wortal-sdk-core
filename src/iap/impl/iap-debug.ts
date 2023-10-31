import { IAPBase } from "../iap-base";
import { Product } from "../interfaces/product";
import { Purchase } from "../interfaces/purchase";
import { PurchaseConfig } from "../interfaces/purchase-config";
import { SubscribableProduct } from "../interfaces/subscribable-product";
import { Subscription } from "../interfaces/subscription";
import { SubscriptionTerm } from "../types/subscription-types";

/**
 * Debug implementation of the IAP API.
 * @hidden
 */
export class IAPDebug extends IAPBase {
    constructor() {
        super();
    }

    protected cancelSubscriptionAsyncImpl(purchaseToken: string): Promise<void> {
        return Promise.resolve();
    }

    protected consumePurchaseAsyncImpl(token: string): Promise<void> {
        return Promise.resolve();
    }

    protected getCatalogAsyncImpl(): Promise<Product[]> {
        return Promise.resolve([this._getMockProduct(), this._getMockProduct(), this._getMockProduct()]);
    }

    protected getPurchasesAsyncImpl(): Promise<Purchase[]> {
        return Promise.resolve([this._getMockPurchase(), this._getMockPurchase(), this._getMockPurchase()]);
    }

    protected getSubscribableCatalogAsyncImpl(): Promise<SubscribableProduct[]> {
        return Promise.resolve([this._getMockSubscribableProduct(), this._getMockSubscribableProduct(), this._getMockSubscribableProduct()]);
    }

    protected getSubscriptionsAsyncImpl(): Promise<Subscription[]> {
        return Promise.resolve([this._getMockSubscription(), this._getMockSubscription(), this._getMockSubscription()]);
    }

    protected isEnabledImpl(): boolean {
        return true;
    }

    protected makePurchaseAsyncImpl(purchase: PurchaseConfig): Promise<Purchase> {
        return Promise.resolve(this._getMockPurchase());
    }

    protected purchaseSubscriptionAsyncImpl(productID: string): Promise<Subscription> {
        return Promise.resolve(this._getMockSubscription());
    }

    private _getMockProduct(): Product {
        const productID = Math.floor(Math.random() * 900) + 100;
        const cost = (Math.random() * (99.99 - 0.10) + 0.10).toFixed(2);

        return {
            productID: `mock.product.${productID}`,
            title: `Mock Product ${productID}`,
            description: "A mock product for testing.",
            price: cost,
            priceCurrencyCode: "USD",
        };
    }

    private _getMockPurchase(): Purchase {
        const productID = Math.floor(Math.random() * 900) + 100;
        const timestamp = Math.floor((new Date().getTime() - 300000) / 1000).toString();
        const paymentID = `mock.payment.${productID}.${timestamp}`;

        return {
            productID: `mock.product.${productID}`,
            paymentID: paymentID,
            purchaseTime: timestamp,
            purchaseToken: paymentID,
            signedRequest: "mock.signedRequest",
        };
    }

    private _getMockSubscribableProduct(): SubscribableProduct {
        const terms: SubscriptionTerm[] = ["WEEKLY", "MONTHLY", "ANNUAL"];
        const randomTerm: SubscriptionTerm = terms[Math.floor(Math.random() * terms.length)];

        return {
            subscriptionTerm: randomTerm,
        };
    }

    private _getMockSubscription(): Subscription {
        const productID = Math.floor(Math.random() * 900) + 100;
        const timestamp = Math.floor((new Date().getTime() - 300000) / 1000).toString();
        const startTimestamp = Math.floor((new Date().getTime() - 300000) / 1000);
        const endTimestamp = Math.floor((new Date().getTime() + 300000) / 1000);

        return {
            isEntitlementActive: true,
            periodStartTime: startTimestamp,
            periodEndTime: endTimestamp,
            productID: `mock.product.${productID}`,
            purchasePlatform: "FB",
            purchasePrice: {
                amount: 1,
                currencyCode: "USD",
            },
            purchaseTime: timestamp,
            purchaseToken: {
                token: `mock.payment.${productID}.${timestamp}`,
            },
            signedRequest: "mock.signedRequest",
            subscriptionTerm: "MONTHLY",
        };
    }

}
