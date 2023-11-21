import { CurrencyCode_Yandex, CurrencyImageSize } from "../types/yandex-purchase-types";

/**
 * Represents a product available for purchase on Yandex.
 * @see Product
 * @hidden
 */
export interface Product_Yandex {
    id: string;
    title: string;
    description?: string;
    imageURI?: string;
    price: string; // <price> <currency code> format. For example, "25 YAN"
    priceValue: string;
    priceCurrencyCode: CurrencyCode_Yandex;
    getPriceCurrencyImage(size: CurrencyImageSize): string;
}
