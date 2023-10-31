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
