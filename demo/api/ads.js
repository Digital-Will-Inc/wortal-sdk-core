function adsIsBlocked() {
    const isBlocked = Wortal.ads.isAdBlocked();
    appendText('isAdBlocked: ' + isBlocked);
}

function showInterstitial() {
    appendText('showInterstitial');
    Wortal.ads.showInterstitial("next", "test", beforeAd, afterAd, noFill);
}

function showRewarded() {
    appendText('showRewarded');
    Wortal.ads.showRewarded("test", beforeAd, afterAd, adDismissed, adViewed, noFill);
}

function beforeAd() {
    appendText('beforeAd');
    pauseAudio();
}

function afterAd() {
    appendText('afterAd');
    playAudio();
}

function adDismissed() {
    appendText('adDismissed');
}

function adViewed() {
    appendText('adViewed');
}

function noFill() {
    appendText('noFill');
    playAudio();
}
