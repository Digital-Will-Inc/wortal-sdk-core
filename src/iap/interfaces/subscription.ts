import { Signature } from "../types/purchase-types";
import { PurchasePlatform, SubscriptionTerm } from "../types/subscription-types";

/**
 * Represents the purchase of a subscription.
 */
export interface Subscription {
    /**
     * The Unix timestamp of when the subscription entitlement will no longer be active, if subscription not renewed or canceled. Otherwise, null.
     */
    deactivationTime?: number,
    /**
     * Whether the user is an active subscriber and should receive entitlement to the subscription benefits.
     */
    isEntitlementActive: boolean,
    /**
     * The current start Unix timestamp of the latest billing cycle.
     */
    periodStartTime: number,
    /**
     * The current end Unix timestamp of the latest billing cycle.
     */
    periodEndTime: number,
    /**
     * The corresponding subscribable product's game-specified identifier.
     */
    productID: string,
    /**
     * The platform associated with the purchase, such as "FB" for Facebook and "GOOGLE" for Google.
     */
    purchasePlatform: PurchasePlatform,
    /**
     * Contains the local amount and currency.
     */
    purchasePrice: object,
    /**
     * Unix timestamp of when the purchase occurred.
     */
    purchaseTime: string,
    /**
     * A token representing the purchase that may be used to consume the purchase.
     */
    purchaseToken: object,
    /**
     * Server-signed encoding of the purchase request.
     */
    signedRequest: Signature,
    /**
     * The billing cycle of a subscription.
     */
    subscriptionTerm: SubscriptionTerm,
}
