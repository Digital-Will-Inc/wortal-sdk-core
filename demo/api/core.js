function coreAuthenticateAsync() {
    Wortal.authenticateAsync()
        .then(result => appendText("Auth result: " + result.status))
        .catch(error => appendText(error));
}

function coreLinkAccountAsync() {
    Wortal.linkAccountAsync()
        .then(result => appendText("Link account result: " + result))
        .catch(error => appendText(error));
}

function coreOnPause() {
    Wortal.onPause(() => appendText('Paused'));
}

function corePerformHapticFeedbackAsync() {
    Wortal.performHapticFeedbackAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function coreGetSupportedAPIs() {
    const supportedAPIs = Wortal.getSupportedAPIs();
    appendText(supportedAPIs);
}
