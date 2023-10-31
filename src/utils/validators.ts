import { PlacementType } from "../ads/types/ad-sense-types";
import { ShareTo } from "./wortal-utils";

/**
 * Validates if the given object is a valid string and not empty.
 * @hidden
 */
export function isValidString(obj: any): boolean {
    return (typeof obj === "string" && obj !== "");
}

/**
 * Validates if the given object is a valid number and not NaN.
 * @hidden
 */
export function isValidNumber(obj: any): boolean {
    if (typeof obj !== "number") {
        return false;
    } else {
        return !isNaN(obj);
    }
}

/**
 * Validates if the given object is a valid PlacementType.
 * @see PlacementType
 * @hidden
 */
export function isValidPlacementType(value: any): value is PlacementType {
    return ["preroll", "start", "pause", "next", "browse", "reward"].includes(value);
}

/**
 * Validates if the given object contains a valid text property in a payload.
 * @hidden
 */
export function isValidPayloadText(obj: any): boolean {
    if (typeof obj === "string" && obj !== "") {
        return true;
    } else if (typeof obj === "object") {
        if (typeof obj.default === "string" && obj.default !== "") {
            return true;
        }
    }
    return false;
}

/**
 * Validates if the given object contains a valid image property in a payload. This needs to be a base64 encoded string.
 * @hidden
 */
export function isValidPayloadImage(obj: any): boolean {
    if (typeof obj === "string" && obj !== "") {
        if (obj.startsWith("data:")) {
            return true;
        }
    }
    return false;
}

/**
 * Validates if the given object contains a valid productID property in a purchase config.
 * @hidden
 */
export function isValidPurchaseConfig(obj: any): boolean {
    return (typeof obj.productID === "string" && obj.productID !== "");
}

/**
 * Validates if the given object contains a valid shareTo property.
 * @hidden
 */
export function isValidShareDestination(value: any): value is ShareTo {
    return ["facebook", "twitter"].includes(value);
}
