import { API_URL, WORTAL_API } from "../data/core-data";
import { implementationError, invalidOperation, invalidParams, notInitialized } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
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
export class IAPBase {
    protected _isIAPEnabled: boolean = false;

//#region Public API

    public cancelSubscriptionAsync(purchaseToken: string): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC);

        const validationResult = this.validateCancelSubscriptionAsync(purchaseToken);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.cancelSubscriptionAsyncImpl(purchaseToken);
    }

    public consumePurchaseAsync(token: string): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC);

        const validationResult = this.validateConsumePurchaseAsync(token);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.consumePurchaseAsyncImpl(token);
    }

    public getCatalogAsync(): Promise<Product[]> {
        Wortal._log.apiCall(WORTAL_API.IAP_GET_CATALOG_ASYNC);

        const validationResult = this.validateGetCatalogAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getCatalogAsyncImpl();
    }

    public getPurchasesAsync(): Promise<Purchase[]> {
        Wortal._log.apiCall(WORTAL_API.IAP_GET_PURCHASES_ASYNC);

        const validationResult = this.validateGetPurchasesAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getPurchasesAsyncImpl();
    }

    public getSubscribableCatalogAsync(): Promise<SubscribableProduct[]> {
        Wortal._log.apiCall(WORTAL_API.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC);

        const validationResult = this.validateGetSubscribableCatalogAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getSubscribableCatalogAsyncImpl();
    }

    public getSubscriptionsAsync(): Promise<Subscription[]> {
        Wortal._log.apiCall(WORTAL_API.IAP_GET_SUBSCRIPTIONS_ASYNC);

        const validationResult = this.validateGetSubscriptionsAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getSubscriptionsAsyncImpl();
    }

    public isEnabled(): boolean {
        Wortal._log.apiCall(WORTAL_API.IAP_IS_ENABLED);

        return this.isEnabledImpl();
    }

    public makePurchaseAsync(purchase: PurchaseConfig): Promise<Purchase> {
        Wortal._log.apiCall(WORTAL_API.IAP_MAKE_PURCHASE_ASYNC);

        const validationResult = this.validateMakePurchaseAsync(purchase);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.makePurchaseAsyncImpl(purchase);
    }

    public purchaseSubscriptionAsync(productID: string): Promise<Subscription> {
        Wortal._log.apiCall(WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC);

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
        Wortal._log.internalCall("IAP._tryEnableIAP");

        Wortal._log.debug("Checking for IAP compatibility..");
        return this._tryEnableIAPImpl();
    }

//#endregion
//#region Implementation interface

    protected cancelSubscriptionAsyncImpl(purchaseToken: string): Promise<void> { throw implementationError(); }
    protected consumePurchaseAsyncImpl(token: string): Promise<void> { throw implementationError(); }
    protected getCatalogAsyncImpl(): Promise<Product[]> { throw implementationError(); }
    protected getPurchasesAsyncImpl(): Promise<Purchase[]> { throw implementationError(); }
    protected getSubscribableCatalogAsyncImpl(): Promise<SubscribableProduct[]> { throw implementationError(); }
    protected getSubscriptionsAsyncImpl(): Promise<Subscription[]> { throw implementationError(); }
    protected isEnabledImpl(): boolean { throw implementationError(); }
    protected makePurchaseAsyncImpl(purchase: PurchaseConfig): Promise<Purchase> { throw implementationError(); }
    protected purchaseSubscriptionAsyncImpl(productID: string): Promise<Subscription> { throw implementationError(); }
    protected _tryEnableIAPImpl(): void { throw implementationError(); }

//#endregion
//#region Validation

    protected validateCancelSubscriptionAsync(purchaseToken: string): ValidationResult {
        if (!isValidString(purchaseToken)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        if (!this._isIAPEnabled) {
            return {
                valid: false,
                error: invalidOperation("IAP is not enabled.",
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateConsumePurchaseAsync(token: string): ValidationResult {
        if (!isValidString(token)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC,
                    API_URL.IAP_CONSUME_PURCHASE_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC,
                    API_URL.IAP_CONSUME_PURCHASE_ASYNC)
            };
        }

        if (!this._isIAPEnabled) {
            return {
                valid: false,
                error: invalidOperation("IAP is not enabled.",
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateGetCatalogAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.IAP_GET_CATALOG_ASYNC,
                    API_URL.IAP_GET_CATALOG_ASYNC)
            };
        }

        if (!this._isIAPEnabled) {
            return {
                valid: false,
                error: invalidOperation("IAP is not enabled.",
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateGetPurchasesAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.IAP_GET_PURCHASES_ASYNC,
                    API_URL.IAP_GET_PURCHASES_ASYNC)
            };
        }

        if (!this._isIAPEnabled) {
            return {
                valid: false,
                error: invalidOperation("IAP is not enabled.",
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateGetSubscribableCatalogAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC,
                    API_URL.IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC)
            };
        }

        if (!this._isIAPEnabled) {
            return {
                valid: false,
                error: invalidOperation("IAP is not enabled.",
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateGetSubscriptionsAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.IAP_GET_SUBSCRIPTIONS_ASYNC,
                    API_URL.IAP_GET_SUBSCRIPTIONS_ASYNC)
            };
        }

        if (!this._isIAPEnabled) {
            return {
                valid: false,
                error: invalidOperation("IAP is not enabled.",
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validateMakePurchaseAsync(purchase: PurchaseConfig): ValidationResult {
        if (!isValidPurchaseConfig(purchase)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.IAP_MAKE_PURCHASE_ASYNC,
                    API_URL.IAP_MAKE_PURCHASE_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.IAP_MAKE_PURCHASE_ASYNC,
                    API_URL.IAP_MAKE_PURCHASE_ASYNC)
            };
        }

        if (!this._isIAPEnabled) {
            return {
                valid: false,
                error: invalidOperation("IAP is not enabled.",
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

    protected validatePurchaseSubscriptionAsync(productID: string): ValidationResult {
        if (!isValidString(productID)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_PURCHASE_SUBSCRIPTION_ASYNC)
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.IAP_PURCHASE_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_PURCHASE_SUBSCRIPTION_ASYNC)
            };
        }

        if (!this._isIAPEnabled) {
            return {
                valid: false,
                error: invalidOperation("IAP is not enabled.",
                    WORTAL_API.IAP_CANCEL_SUBSCRIPTION_ASYNC,
                    API_URL.IAP_CANCEL_SUBSCRIPTION_ASYNC)
            };
        }

        return { valid: true };
    }

//#endregion
}
