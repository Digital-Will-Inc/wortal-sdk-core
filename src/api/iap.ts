import { Product, Purchase, PurchaseConfig } from "../types/iap";
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
 * @returns Array of products available to the player. Returns an empty list if
 */
export function getCatalogAsync(): Promise<Product[]> {
    if (!config.isIAPEnabled) {
        return Promise.reject("[Wortal] IAP not enabled.");
    }

    if (config.session.platform === "viber") {
        return (window as any).wortalGame.payments.getCatalogAsync()
            .then((products: Product[]) => {
                return products;
            })
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] IAP not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Gets the purchases the player has made that have not yet been consumed. Purchase signature should be
 * validated on the game developer's server or transaction database before provisioning the purchase to the player.
 * @example
 * Wortal.iap.getPurchasesAsync()
 *  .then(purchases => console.log(purchases));
 * @returns Array of purchases.
 */
export function getPurchasesAsync(): Promise<Purchase[]> {
    if (!config.isIAPEnabled) {
        return Promise.reject("[Wortal] IAP not enabled.");
    }

    if (config.session.platform === "viber") {
        return (window as any).wortalGame.payments.getPurchasesAsync()
            .then((purchases: Purchase[]) => {
                return purchases;
            })
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] IAP not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Attempts to make a purchase of the given product. Will launch the native IAP screen and return the result.
 * @example
 * Wortal.iap.makePurchaseAsync({
 *     productID: 'my_product_123',
 * }).then(purchase => console.log(purchase));
 * @param purchase Object defining the product ID and purchase information.
 * @returns Information about the purchase.
 */
export function makePurchaseAsync(purchase: PurchaseConfig): Promise<Purchase> {
    if (!config.isIAPEnabled) {
        return Promise.reject("[Wortal] IAP not enabled.");
    }

    if (config.session.platform === "viber") {
        return (window as any).wortalGame.payments.purchaseAsync(purchase)
            .then((purchase: Purchase) => {
                return purchase;
            })
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] IAP not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Consumes the given purchase. This will remove the purchase from the player's available purchases inventory and
 * reset its availability in the catalog.
 * @example
 * Wortal.iap.consumePurchaseAsync('abc123');
 * @param token String representing the purchaseToken of the item to consume.
 */
export function consumePurchaseAsync(token: string): Promise<void> {
    if (!config.isIAPEnabled) {
        return Promise.reject("[Wortal] IAP not enabled.");
    }

    if (config.session.platform === "viber") {
        return (window as any).wortalGame.payments.consumePurchaseAsync(token)
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] IAP not currently supported on platform: " + config.session.platform);
    }
}
