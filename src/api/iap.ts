import { Product, Purchase, PurchaseConfig } from "../interfaces/iap";
import { invalidParams, notSupported, rethrowPlatformError } from "../utils/error-handler";
import { isValidPurchaseConfig, isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Checks whether IAP is enabled in this session.
 * @example
 * const canShowShop = Wortal.iap.isEnabled();
 * shopButton.visible = canShowShop;
 * @returns {boolean} True if IAP is available to the user. False if IAP is not supported on the current platform,
 * the player's device, or the IAP service failed to load properly.
 */
export function isEnabled(): boolean {
    return config.isIAPEnabled;
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
export function getCatalogAsync(): Promise<Product[]> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled. Please check iap.isEnabled before using the IAP API.",
                "iap.getCatalogAsync");
        }

        if (platform === "viber" || platform === "facebook") {
            return config.platformSDK.payments.getCatalogAsync()
                .then((products: Product[]) => {
                    return products;
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e,
                        "iap.getCatalogAsync",
                        "https://sdk.html5gameportal.com/api/iap/#getcatalogasync");
                });
        } else {
            throw notSupported(`IAP API not currently supported on platform: ${platform}`,
                "iap.getCatalogAsync");
        }
    });
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
export function getPurchasesAsync(): Promise<Purchase[]> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled. Please check iap.isEnabled before using the IAP API.",
                "iap.getPurchasesAsync");
        }

        if (platform === "viber" || platform === "facebook") {
            return config.platformSDK.payments.getPurchasesAsync()
                .then((purchases: Purchase[]) => {
                    return purchases;
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e,
                        "iap.getPurchasesAsync",
                        "https://sdk.html5gameportal.com/api/iap/#getpurchasesasync");
                });
        } else {
            throw notSupported(`IAP API not currently supported on platform: ${platform}`,
                "iap.getPurchasesAsync");
        }
    });
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
export function makePurchaseAsync(purchase: PurchaseConfig): Promise<Purchase> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled. Please check iap.isEnabled before using the IAP API.",
                "iap.makePurchaseAsync");
        }

        if (!isValidPurchaseConfig(purchase)) {
            throw invalidParams("productID cannot be null or empty. Please provide a valid string for the productID parameter.",
                "iap.makePurchaseAsync",
                "https://sdk.html5gameportal.com/api/interfaces/purchase-config/");
        }

        if (platform === "viber" || platform === "facebook") {
            return config.platformSDK.payments.purchaseAsync(purchase)
                .then((purchase: Purchase) => {
                    return purchase;
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e,
                        "iap.makePurchaseAsync",
                        "https://sdk.html5gameportal.com/api/iap/#makepurchaseasync");
                });
        } else {
            throw notSupported(`IAP API not currently supported on platform: ${platform}`,
                "iap.makePurchaseAsync");
        }
    });
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
export function consumePurchaseAsync(token: string): Promise<void> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled. Please check iap.isEnabled before using the IAP API.",
                "iap.consumePurchaseAsync");
        }

        if (!isValidString(token)) {
            throw invalidParams("token cannot be null or empty. Please provide a valid string for the token parameter.",
                "iap.consumePurchaseAsync",
                "https://sdk.html5gameportal.com/api/iap/#parameters");
        }

        if (platform === "viber" || platform === "facebook") {
            return config.platformSDK.payments.consumePurchaseAsync(token)
                .catch((e: any) => {
                    throw rethrowPlatformError(e,
                        "iap.consumePurchaseAsync",
                        "https://sdk.html5gameportal.com/api/iap/#consumepurchaseasync");
                });
        } else {
            throw notSupported(`IAP API not currently supported on platform: ${platform}`,
                "iap.consumePurchaseAsync");
        }
    });
}
