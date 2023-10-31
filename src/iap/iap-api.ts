import { IAPBase } from "./iap-base";
import { Product } from "./interfaces/product";
import { Purchase } from "./interfaces/purchase";
import { PurchaseConfig } from "./interfaces/purchase-config";
import { SubscribableProduct } from "./interfaces/subscribable-product";
import { Subscription } from "./interfaces/subscription";

/**
 * In-App Purchase (IAP) API is used for purchasing in-game items and currency along with subscriptions for games.
 * In-app purchases are a great way to monetize your game and provide a better user experience.
 * @module IAP
 */
export class InAppPurchaseAPI {
    private _iap: IAPBase;

    constructor(impl: IAPBase) {
        this._iap = impl;
    }

    /** @internal */
    _internalTryEnableIAP(): void {
        this._iap._tryEnableIAP();
    }

    /**
     * Starts the asynchronous process of cancelling an existing subscription. This operation will only work if the
     * subscription entitlement is active. If the promise is resolved, this is only an indication that the cancellation has
     * begun and NOT that it has necessarily succeeded.
     *
     * The subscription's deactivationTime and isEntitlementActive properties should be queried for the latest status.
     * @example
     * Wortal.iap.cancelSubscriptionAsync('abc123')
     * .then(() => console.log('Subscription cancellation process has begun.'));
     * @param purchaseToken The purchase token of the subscription that should be cancelled.
     * @returns {Promise<void>} Promise that resolves when the subscription cancellation process has begun.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>PAYMENTS_OPERATION_FAILURE</li>
     * <li>INVALID_PARAM</li>
     * </ul>
     */
    public cancelSubscriptionAsync(purchaseToken: string): Promise<void> {
        return this._iap.cancelSubscriptionAsync(purchaseToken);
    }

    /**
     * Consumes a specific purchase belonging to the current player. Before provisioning a product's effects to the player,
     * the game should request the consumption of the purchased product. Once the purchase is successfully consumed,
     * the game should immediately provide the player with the effects of their purchase. This will remove the
     * purchase from the player's available purchases inventory and reset its availability in the catalog.
     * @example
     * Wortal.iap.consumePurchaseAsync('abc123');
     * @param token The purchase token of the purchase that should be consumed.
     * @returns {Promise<void>} Promise that resolves when the purchase is successfully consumed. Otherwise, it rejects.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>PAYMENTS_NOT_INITIALIZED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * </ul>
     */
    public consumePurchaseAsync(token: string): Promise<void> {
        return this._iap.consumePurchaseAsync(token);
    }

    /**
     * Gets the catalog of available products the player can purchase.
     * @example
     * Wortal.iap.getCatalogAsync()
     *  .then(products => console.log(products));
     * @returns {Promise<Product[]>} Promise that resolves with an array of products available to the player.
     * Returns an empty array if purchases are not supported in the player's region.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>PAYMENTS_NOT_INITIALIZED</li>
     * <li>NETWORK_FAILURE</li>
     * </ul>
     */
    public getCatalogAsync(): Promise<Product[]> {
        return this._iap.getCatalogAsync();
    }

    /**
     * Fetches all the player's unconsumed purchases. The game should fetch the current player's purchases as soon as the
     * client indicates that it is ready to perform payments-related operations, i.e. at game start. The game can then
     * process and consume any purchases that are waiting to be consumed.
     * @example
     * Wortal.iap.getPurchasesAsync()
     *  .then(purchases => console.log(purchases));
     * @returns {Promise<Purchase[]>} Promise that resolves with an array of purchases that the player has made for the game.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>PAYMENTS_NOT_INITIALIZED</li>
     * <li>NETWORK_FAILURE</li>
     * </ul>
     */
    public getPurchasesAsync(): Promise<Purchase[]> {
        return this._iap.getPurchasesAsync();
    }

    /**
     * Fetches the game's catalog for subscribable products.
     * @example
     * Wortal.iap.getSubscribableCatalogAsync()
     * .then(products => console.log(products));
     * @returns {Promise<SubscribableProduct[]>} Promise that resolves with an array of subscribable products available to the player.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>NETWORK_FAILURE</li>
     * </ul>
     */
    public getSubscribableCatalogAsync(): Promise<SubscribableProduct[]> {
        return this._iap.getSubscribableCatalogAsync();
    }

    /**
     * Fetches all the player's subscriptions.
     * @example
     * Wortal.iap.getSubscriptionsAsync()
     * .then(subscriptions => console.log(subscriptions));
     * @returns {Promise<Subscription[]>} Promise that resolves with an array of subscriptions that the player has made for the game.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>NETWORK_FAILURE</li>
     * </ul>
     */
    public getSubscriptionsAsync(): Promise<Subscription[]> {
        return this._iap.getSubscriptionsAsync();
    }

    /**
     * Checks whether IAP is enabled in this session.
     * @example
     * const canShowShop = Wortal.iap.isEnabled();
     * shopButton.visible = canShowShop;
     * @returns {boolean} True if IAP is available to the user. False if IAP is not supported on the current platform,
     * the player's device, or the IAP service failed to load properly.
     */
    public isEnabled(): boolean {
        return this._iap.isEnabled();
    }

    /**
     * Begins the purchase flow for a specific product.
     * @example
     * Wortal.iap.makePurchaseAsync({
     *     productID: 'my_product_123',
     * }).then(purchase => console.log(purchase));
     * @param {PurchaseConfig} purchase The purchase's configuration details.
     * @returns {Promise<Purchase>} Promise that resolves when the product is successfully purchased by the player. Otherwise, it rejects.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>PAYMENTS_NOT_INITIALIZED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>INVALID_OPERATION</li>
     * <li>USER_INPUT</li>
     * </ul>
     */
    public makePurchaseAsync(purchase: PurchaseConfig): Promise<Purchase> {
        return this._iap.makePurchaseAsync(purchase);
    }

    /**
     * Begins the purchase subscription flow for a specific product. Will immediately reject if called before
     * startGameAsync() has resolved and fail if the productID passed is not that of a subscribable product.
     * @example
     * Wortal.iap.purchaseSubscriptionAsync('my_product_123')
     * .then(subscription => console.log(subscription));
     * @param productID The subscribable product id that will be purchased.
     * @returns {Promise<Subscription>} Promise that resolves when the product is successfully purchased by the player. Otherwise, it rejects.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>PAYMENTS_NOT_INITIALIZED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>INVALID_OPERATION</li>
     * <li>USER_INPUT</li>
     * </ul>
     */
    public purchaseSubscriptionAsync(productID: string): Promise<Subscription> {
        return this._iap.purchaseSubscriptionAsync(productID);
    }
}
