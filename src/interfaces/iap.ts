import { PurchasePlatform, Signature, SubscriptionTerm } from "../types/iap";

/**
 * Represents a game's product information.
 */
export interface Product {
    /**
     * The title of the product.
     */
    title: string,
    /**
     * The product's game-specified identifier.
     */
    productID: string,
    /**
     * The product description.
     */
    description?: string,
    /**
     * A link to the product's associated image.
     */
    imageURI?: string,
    /**
     * A localized string representing the product's price in the local currency, e.g. "$1".
     */
    price: string,
    /**
     * A string representing which currency is the price calculated in, following [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
     */
    priceCurrencyCode: string,
    /**
     * The numeric price of a product.
     */
    priceAmount?: number,
}

/**
 * The configuration of a purchase request for a product registered to the game.
 */
export interface PurchaseConfig {
    /**
     * The identifier of the product to purchase.
     */
    productID: string,
    /**
     * An optional developer-specified payload, to be included in the returned purchase's signed request.
     */
    developerPayload?: string
}

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

/**
 * Represents a game's subscribable product information.
 */
export interface SubscribableProduct {
    /**
     * The billing cycle of a subscription.
     */
    subscriptionTerm: SubscriptionTerm,
}
