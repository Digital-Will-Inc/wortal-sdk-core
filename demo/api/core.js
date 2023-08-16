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
