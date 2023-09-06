import { Product, Purchase, PurchaseConfig } from "../interfaces/iap";
import { Error_Facebook_Rakuten } from "../interfaces/wortal";
import { API_URL, WORTAL_API } from "../utils/config";
import { invalidParams, notSupported, rethrowError_Facebook_Rakuten } from "../utils/error-handler";
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
            throw notSupported(undefined, WORTAL_API.IAP_GET_CATALOG_ASYNC);
        }

        if (platform === "viber" || platform === "facebook") {
            return config.platformSDK.payments.getCatalogAsync()
                .then((products: Product[]) => {
                    return products;
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_GET_CATALOG_ASYNC, API_URL.IAP_GET_CATALOG_ASYNC);
                });
        } else if (platform === "debug") {
            return [_getMockProduct(), _getMockProduct(), _getMockProduct()];
        } else {
            throw notSupported(undefined, WORTAL_API.IAP_GET_CATALOG_ASYNC);
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
            throw notSupported(undefined, WORTAL_API.IAP_GET_PURCHASES_ASYNC);
        }

        if (platform === "viber" || platform === "facebook") {
            return config.platformSDK.payments.getPurchasesAsync()
                .then((purchases: Purchase[]) => {
                    return purchases;
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_GET_PURCHASES_ASYNC, API_URL.IAP_GET_PURCHASES_ASYNC);
                });
        } else if (platform === "debug") {
            return [_getMockPurchase(), _getMockPurchase(), _getMockPurchase()];
        } else {
            throw notSupported(undefined, WORTAL_API.IAP_GET_PURCHASES_ASYNC);
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
        if (!isValidPurchaseConfig(purchase)) {
            throw invalidParams(undefined, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
        }

        if (!config.isIAPEnabled) {
            throw notSupported(undefined, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC);
        }

        if (platform === "viber" || platform === "facebook") {
            return config.platformSDK.payments.purchaseAsync(purchase)
                .then((purchase: Purchase) => {
                    return purchase;
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC, API_URL.IAP_MAKE_PURCHASE_ASYNC);
                });
        } else if (platform === "debug") {
            return _getMockPurchase();
        } else {
            throw notSupported(undefined, WORTAL_API.IAP_MAKE_PURCHASE_ASYNC);
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
        if (!isValidString(token)) {
            throw invalidParams(undefined, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC);
        }

        if (!config.isIAPEnabled) {
            throw notSupported(undefined, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC);
        }

        if (platform === "viber" || platform === "facebook") {
            return config.platformSDK.payments.consumePurchaseAsync(token)
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC, API_URL.IAP_CONSUME_PURCHASE_ASYNC);
                });
        } else if (platform === "debug") {
            return;
        } else {
            throw notSupported(undefined, WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC);
        }
    });
}

/**
 * Returns a mock product for debug and testing purposes.
 * Randomly generates a product ID (100-999) and price (0.10 - 99.99 USD).
 * @hidden
 * @private
 */
function _getMockProduct(): Product {
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

/**
 * Returns a mock purchase for debug and testing purposes.
 * Randomly generates a product ID (100-999) and timestamp of 5 minutes ago. PaymentID and purchaseToken are generated
 * from the product ID and timestamp. SignedRequest is a mock string and does not represent a real signed request or
 * value that the platform SDK would return.
 * @hidden
 * @private
 */
function _getMockPurchase(): Purchase {
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
