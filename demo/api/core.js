function coreSetLoadingProgress() {
    Wortal.setLoadingProgress(5);
    Wortal.setLoadingProgress(50);
    Wortal.setLoadingProgress(100);
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
