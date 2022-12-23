/** @hidden */
export function isValidString(obj: any): boolean {
    return (typeof obj === "string" && obj !== "");
}

/** @hidden */
export function isValidNumber(obj: any): boolean {
    if (typeof obj !== "number") {
        return false;
    } else {
        return !isNaN(obj);
    }
}

/** @hidden */
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

/** @hidden */
export function isValidPayloadImage(obj: any): boolean {
    if (typeof obj === "string" && obj !== "") {
        if (obj.startsWith("data:")) {
            return true;
        }
    }
    return false;
}

/** @hidden */
export function isValidPurchaseConfig(obj: any): boolean {
    return (typeof obj.productID === "string" && obj.productID !== "");
}
