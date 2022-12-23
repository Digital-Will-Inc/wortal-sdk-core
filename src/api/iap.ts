import { Product, Purchase, PurchaseConfig } from "../types/iap";
import { invalidParams, notSupported, rethrowRakuten } from "../utils/error-handler";
import { isValidPurchaseConfig, isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Checks whether IAP is enabled in this session.
 * @returns True if IAP is available to the user. False if IAP is not supported on the current platform,
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
 * @returns Array of products available to the player. Returns an empty list if purchases are not supported in the
 * player's region.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getCatalogAsync(): Promise<Product[]> {
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled.", "iap.getCatalogAsync");
        }

        if (config.session.platform === "viber") {
            return (window as any).wortalGame.payments.getCatalogAsync()
                .then((products: Product[]) => {
                    return products;
                })
                .catch((e: any) => {
                    throw rethrowRakuten(e, "iap.getCatalogAsync");
                });
        } else {
            throw notSupported("IAP API not currently supported on platform: " + config.session.platform, "iap.getCatalogAsync");
        }
    });
}

/**
 * Gets the purchases the player has made that have not yet been consumed. Purchase signature should be
 * validated on the game developer's server or transaction database before provisioning the purchase to the player.
 * @example
 * Wortal.iap.getPurchasesAsync()
 *  .then(purchases => console.log(purchases));
 * @returns Array of purchases.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getPurchasesAsync(): Promise<Purchase[]> {
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled.", "iap.getPurchasesAsync");
        }

        if (config.session.platform === "viber") {
            return (window as any).wortalGame.payments.getPurchasesAsync()
                .then((purchases: Purchase[]) => {
                    return purchases;
                })
                .catch((e: any) => {
                    throw rethrowRakuten(e, "iap.getPurchasesAsync");
                });
        } else {
            throw notSupported("IAP API not currently supported on platform: " + config.session.platform, "iap.getPurchasesAsync");
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
 * @returns Information about the purchase.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function makePurchaseAsync(purchase: PurchaseConfig): Promise<Purchase> {
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled.", "iap.makePurchaseAsync");
        }
        if (!isValidPurchaseConfig(purchase)) {
            throw invalidParams("productID cannot be null or empty.", "iap.makePurchaseAsync");
        }

        if (config.session.platform === "viber") {
            return (window as any).wortalGame.payments.purchaseAsync(purchase)
                .then((purchase: Purchase) => {
                    return purchase;
                })
                .catch((e: any) => {
                    throw rethrowRakuten(e, "iap.makePurchaseAsync");
                });
        } else {
            throw notSupported("IAP API not currently supported on platform: " + config.session.platform, "iap.makePurchaseAsync");
        }
    });
}

/**
 * Consumes the given purchase. This will remove the purchase from the player's available purchases inventory and
 * reset its availability in the catalog.
 * @example
 * Wortal.iap.consumePurchaseAsync('abc123');
 * @param token String representing the purchaseToken of the item to consume.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function consumePurchaseAsync(token: string): Promise<void> {
    return Promise.resolve().then(() => {
        if (!config.isIAPEnabled) {
            throw notSupported("IAP is currently disabled.", "iap.consumePurchaseAsync");
        }
        if (!isValidString(token)) {
            throw invalidParams("token cannot be null or empty.", "iap.consumePurchaseAsync");
        }

        if (config.session.platform === "viber") {
            return (window as any).wortalGame.payments.consumePurchaseAsync(token)
                .catch((e: any) => {
                    throw rethrowRakuten(e, "iap.consumePurchaseAsync");
                });
        } else {
            throw notSupported("IAP API not currently supported on platform: " + config.session.platform, "iap.consumePurchaseAsync");
        }
    });
}
