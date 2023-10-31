import { Signature } from "../types/purchase-types";
import { PurchasePlatform } from "../types/subscription-types";

/**
 * Represents an individual purchase of a game product.
 */
export interface Purchase {
    /**
     * A developer-specified string, provided during the purchase of the product.
     */
    developerPayload?: string,
    /**
     * The identifier for the purchase transaction.
     */
    paymentID: string,
    /**
     * The product's game-specified identifier.
     */
    productID: string,
    /**
     * Unix timestamp of when the purchase occurred.
     */
    purchaseTime: string,
    /**
     * A token representing the purchase that may be used to consume the purchase.
     */
    purchaseToken: string,
    /**
     * Server-signed encoding of the purchase request.
     */
    signedRequest: Signature,
    /**
     * Whether the purchase has been consumed. Facebook only.
     */
    isConsumed?: boolean,
    /**
     * The current status of the purchase, such as 'charge' or 'refund'. Facebook only.
     */
    paymentActionType?: string,
    /**
     * The platform associated with the purchase, such as "FB" for Facebook and "GOOGLE" for Google. Facebook only.
     */
    purchasePlatform?: PurchasePlatform,
    /**
     * Contains the local amount and currency associated with the purchased item. Facebook only.
     */
    purchasePrice?: object,
}
