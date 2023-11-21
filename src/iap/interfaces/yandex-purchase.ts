import { Signature } from "../types/purchase-types";

/**
 * Purchase implementation for Yandex.
 * @see Purchase
 * @hidden
 */
export interface Purchase_Yandex {
    productId: string;
    purchaseToken: string;
    developerPayload?: string;
    signature: Signature;
}
