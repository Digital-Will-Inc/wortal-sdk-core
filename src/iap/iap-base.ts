import { API_URL, WORTAL_API } from "../data/core-data";
import { invalidParams } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { apiCall, debug, internalCall } from "../utils/logger";
import { isValidPurchaseConfig, isValidString } from "../utils/validators";
import { Product } from "./interfaces/product";
import { Purchase } from "./interfaces/purchase";
import { PurchaseConfig } from "./interfaces/purchase-config";
import { SubscribableProduct } from "./interfaces/subscribable-product";
import { Subscription } from "./interfaces/subscription";

/**
 * Base implementation of the IAP API. Extend this class to implement the IAP API for a specific platform.
 * @hidden
 */
export abstract class IAPBase {
//#region Protected/Internal Members

    protected _isIAPEnabled: boolean = false;

    constructor() {
    }

//#endregion
//#region Public API

    public cancelSubscriptionAsync(purchaseToken: string): Promise<void> {
        apiCall(WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC);

        const validationResult = this.validateCancelSubscriptionAsync(purchaseToken);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.cancelSubscriptionAsyncImpl(purchaseToken);
    }

    public consumePurchaseAsync(token: string): Promise<void> {
        apiCall(WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC);

        const validationResult = this.validateConsumePurchaseAsync(token);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.consumePurchaseAsyncImpl(token);
    }

    public getCatalogAsync(): Promise<Product[]> {
        apiCall(WORTAL_API.IAP_GET_CATALOG_ASYNC);

        return this.getCatalogAsyncImpl();
    }

    public getPurchasesAsync(): Promise<Purchase[]> {
        apiCall(WORTAL_API.IAP_GET_PURCHASES_ASYNC);

        return this.getPurchasesAsyncImpl();
    }

    public getSubscribableCatalogAsync(): Promise<SubscribableProduct[]> {
        apiCall(WORTAL_API.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC);

        return this.getSubscribableCatalogAsyncImpl();
    }

    public getSubscriptionsAsync(): Promise<Subscription[]> {
        apiCall(WORTAL_API.IAP_GET_SUBSCRIPTIONS_ASYNC);

        return this.getSubscriptionsAsyncImpl();
    }

    public isEnabled(): boolean {
        apiCall(WORTAL_API.IAP_IS_ENABLED);

        return this.isEnabledImpl();
    }

    public makePurchaseAsync(purchase: PurchaseConfig): Promise<Purchase> {
        apiCall(WORTAL_API.IAP_MAKE_PURCHASE_ASYNC);

        const validationResult = this.validateMakePurchaseAsync(purchase);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.makePurchaseAsyncImpl(purchase);
    }

    public purchaseSubscriptionAsync(productID: string): Promise<Subscription> {
        apiCall(WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC);

        const validationResult = this.validatePurchaseSubscriptionAsync(productID);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.purchaseSubscriptionAsyncImpl(productID);
    }

//#endregion
//#region Internal API

    /**
     * Tries to enable IAP for the current platform. This is only supported on some platforms and takes some time to
     * initialize. Once the platform SDK signals that the IAP is ready, the SDK will enable the IAP API. If this fails
     * for any reason, the IAP API will not be enabled.
     * @hidden
     */
    _tryEnableIAP(): void {
        internalCall("IAP._tryEnableIAP");

        debug("Checking for IAP compatibility..");
        const platform = Wortal.session.getPlatform();
        if (platform === "viber" || platform === "facebook") {
            Wortal._internalPlatformSDK.payments.onReady(() => {
                this._isIAPEnabled = true;
                debug(`IAP initialized for ${platform} platform.`);
            });
        } else if (platform === "debug") {
            this._isIAPEnabled = true;
            debug("IAP initialized for debugging.");
        } else {
            debug(`IAP not supported in this session. This may be due to platform, device or regional restrictions. \nPlatform: ${platform} // Device: ${Wortal.session.getDevice()} // Region: ${Wortal.session._internalSession.country}`);
        }
    }

//#endregion
//#region Implementation interface

    protected abstract cancelSubscriptionAsyncImpl(purchaseToken: string): Promise<void>;
    protected abstract consumePurchaseAsyncImpl(token: string): Promise<void>;
    protected abstract getCatalogAsyncImpl(): Promise<Product[]>;
    protected abstract getPurchasesAsyncImpl(): Promise<Purchase[]>;
    protected abstract getSubscribableCatalogAsyncImpl(): Promise<SubscribableProduct[]>;
    protected abstract getSubscriptionsAsyncImpl(): Promise<Subscription[]>;
    protected abstract isEnabledImpl(): boolean;
    protected abstract makePurchaseAsyncImpl(purchase: PurchaseConfig): Promise<Purchase>;
    protected abstract purchaseSubscriptionAsyncImpl(productID: string): Promise<Subscription>;

//#endregion
//#region Validation

    protected validateCancelSubscriptionAsync(purchaseToken: string): ValidationResult {
        if (!isValidString(purchaseToken)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC, API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateConsumePurchaseAsync(token: string): ValidationResult {
        if (!isValidString(token)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateMakePurchaseAsync(purchase: PurchaseConfig): ValidationResult {
        if (!isValidPurchaseConfig(purchase)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validatePurchaseSubscriptionAsync(productID: string): ValidationResult {
        if (!isValidString(productID)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC, API_URL.IAP_PURCHASE_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

//#endregion
}
