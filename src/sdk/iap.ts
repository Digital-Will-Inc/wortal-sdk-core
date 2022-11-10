import { Product, Purchase, PurchaseConfig } from "../types/iap";
import { sdk } from "./index";

/**
 * Checks whether IAP is enabled in this session.
 * @returns True if IAP is available to the user. False if IAP is not supported on the current platform,
 * the player's device, or the IAP service failed to load properly.
 */
export function isEnabled(): boolean {
    return sdk.isIAPEnabled;
}

/**
 * Gets the catalog of available products the player can purchase.
 * @returns Array of products available to the player. Returns an empty list if
 */
export function getCatalogAsync(): Promise<Product[]> {
    if (!sdk.isIAPEnabled) {
        console.log("[Wortal] IAP not enabled.");
        return Promise.reject("[Wortal] IAP not enabled.");
    }

    if (sdk.session.platform === "viber") {
        return (window as any).wortalGame.payments.getCatalogAsync()
            .then((products: Product[]) => {
                console.log(products.length)
                return products;
            })
            .catch((error: any) => console.error(error));
    } else {
        console.log("[Wortal] IAP not currently supported on platform: " + sdk.session.platform);
        return Promise.reject("[Wortal] IAP not currently supported on platform: " + sdk.session.platform);
    }
}

/**
 * Gets the purchases the player has made that have not yet been consumed. Purchase signature should be
 * validated on the game developer's server or transaction database before provisioning the purchase to the player.
 * @returns Array of purchases.
 */
export function getPurchasesAsync(): Promise<Purchase[]> {
    if (!sdk.isIAPEnabled) {
        console.log("[Wortal] IAP not enabled.");
        return Promise.reject("[Wortal] IAP not enabled.");
    }

    if (sdk.session.platform === "viber") {
        return (window as any).wortalGame.payments.getPurchasesAsync()
            .then((purchases: Purchase[]) => {
                console.log(purchases.length)
                return purchases;
            })
            .catch((error: any) => console.error(error));
    } else {
        console.log("[Wortal] IAP not currently supported on platform: " + sdk.session.platform);
        return Promise.reject("[Wortal] IAP not currently supported on platform: " + sdk.session.platform);
    }
}

/**
 * Attempts to make a purchase of the given product. Will launch the native IAP screen and return the result.
 * @param config Object defining the product ID and purchase information.
 * @returns Information about the purchase.
 */
export function makePurchaseAsync(config: PurchaseConfig): Promise<Purchase> {
    if (!sdk.isIAPEnabled) {
        console.log("[Wortal] IAP not enabled.");
        return Promise.reject("[Wortal] IAP not enabled.");
    }

    if (sdk.session.platform === "viber") {
        return (window as any).wortalGame.payments.purchaseAsync(config)
            .then((purchase: Purchase) => {
                //TODO: remove these after testing
                console.log("Payment ID: " + purchase.paymentID)
                console.log("Purchase token: " + purchase.purchaseToken)
                return purchase;
            })
            .catch((error: any) => console.error(error));
    } else {
        console.log("[Wortal] IAP not currently supported on platform: " + sdk.session.platform);
        return Promise.reject("[Wortal] IAP not currently supported on platform: " + sdk.session.platform);
    }
}

/**
 * Consumes the given purchase. This will remove the purchase from the player's available purchases inventory and
 * reset its availability in the catalog.
 * @param token String representing the purchaseToken of the item to consume.
 */
export function consumePurchaseAsync(token: string): Promise<void> {
    if (!sdk.isIAPEnabled) {
        console.log("[Wortal] IAP not enabled.");
        return Promise.reject("[Wortal] IAP not enabled.");
    }

    if (sdk.session.platform === "viber") {
        return (window as any).wortalGame.payments.consumePurchaseAsync(token)
            .then(() => console.log("Purchase consumed"))
            .catch((error: any) => console.error(error));
    } else {
        console.log("[Wortal] IAP not currently supported on platform: " + sdk.session.platform);
        return Promise.reject("[Wortal] IAP not currently supported on platform: " + sdk.session.platform);
    }
}
