let productID = "";
let token = "";

function iapIsEnabled() {
    appendText(Wortal.iap.isEnabled());
}

function iapGetCatalogAsync() {
    Wortal.iap.getCatalogAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function iapGetPurchasesAsync() {
    Wortal.iap.getPurchasesAsync()
        .then(result => {
            appendText(JSON.stringify(result));
            if (result.length > 0) {
                token = result[0].purchaseToken;
            }
        })
        .catch(error => appendText(error));
}

function iapMakePurchaseAsync() {
    Wortal.iap.makePurchaseAsync({productID: productID})
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function iapConsumePurchaseAsync() {
    Wortal.iap.consumePurchaseAsync(token)
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}
