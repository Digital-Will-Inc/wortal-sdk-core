import { Product, Purchase, PurchaseConfig } from "../types/iap";
import { invalidParams, notSupported, rethrowPlatformError } from "../utils/error-handler";
import { isValidPurchaseConfig, isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Checks whether IAP is enabled in this session.
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
 * @returns {Promise<Product[]>} Array of products available to the player. Returns an empty list if purchases are
 * not supported in the player's region.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * <li>PAYMENTS_NOT_INITIALIZED</li>
 * <li>NETWORK_FAILURE</li>
 * </ul>
 */
export function getCatalogAsync(): Promise<Product[]> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled.", "iap.getCatalogAsync");
        }

        if (platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.payments.getCatalogAsync()
                .then((products: Product[]) => {
                    return products;
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "iap.getCatalogAsync");
                });
        } else {
            throw notSupported("IAP API not currently supported on platform: " + platform, "iap.getCatalogAsync");
        }
    });
}

/**
 * Gets the purchases the player has made that have not yet been consumed. Purchase signature should be
 * validated on the game developer's server or transaction database before provisioning the purchase to the player.
 * @example
 * Wortal.iap.getPurchasesAsync()
 *  .then(purchases => console.log(purchases));
 * @returns {Promise<Purchase[]>} Array of purchases.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * <li>PAYMENTS_NOT_INITIALIZED</li>
 * <li>NETWORK_FAILURE</li>
 * </ul>
 */
export function getPurchasesAsync(): Promise<Purchase[]> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled.", "iap.getPurchasesAsync");
        }

        if (platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.payments.getPurchasesAsync()
                .then((purchases: Purchase[]) => {
                    return purchases;
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "iap.getPurchasesAsync");
                });
        } else {
            throw notSupported("IAP API not currently supported on platform: " + platform, "iap.getPurchasesAsync");
        }
    });
}

/**
 * Attempts to make a purchase of the given product. Will launch the native IAP screen and return the result.
 * @example
 * Wortal.iap.makePurchaseAsync({
 *     productID: 'my_product_123',
 * }).then(purchase => console.log(purchase));
 * @param purchase Object defining the product ID and purchase information.
 * @returns {Promise<Purchase>} A Promise that resolves when the product is successfully purchased by the player. Otherwise, it rejects.
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
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled.", "iap.makePurchaseAsync");
        }
        if (!isValidPurchaseConfig(purchase)) {
            throw invalidParams("productID cannot be null or empty.", "iap.makePurchaseAsync");
        }

        if (platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.payments.purchaseAsync(purchase)
                .then((purchase: Purchase) => {
                    return purchase;
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "iap.makePurchaseAsync");
                });
        } else {
            throw notSupported("IAP API not currently supported on platform: " + platform, "iap.makePurchaseAsync");
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
 * @returns {Promise<void>} A Promise that resolves when the purchase is successfully consumed. Otherwise, it rejects.
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
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled.", "iap.consumePurchaseAsync");
        }
        if (!isValidString(token)) {
            throw invalidParams("token cannot be null or empty.", "iap.consumePurchaseAsync");
        }

        if (platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.payments.consumePurchaseAsync(token)
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "iap.consumePurchaseAsync");
                });
        } else {
            throw notSupported("IAP API not currently supported on platform: " + platform, "iap.consumePurchaseAsync");
        }
    });
}
