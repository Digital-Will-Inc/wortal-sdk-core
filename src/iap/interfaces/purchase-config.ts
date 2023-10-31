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
