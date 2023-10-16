function adsIsBlocked() {
    const isBlocked = Wortal.ads.isAdBlocked();
    appendText('isAdBlocked: ' + isBlocked);
}

function adShowInterstitial() {
    appendText('showInterstitial');
    Wortal.ads.showInterstitial("next", "test", beforeAd, afterAd, noFill);
}

function adShowRewarded() {
    appendText('showRewarded');
    Wortal.ads.showRewarded("test", beforeAd, afterAd, adDismissed, adViewed, noFill);
}

function adShowBanner() {
    appendText('showBanner');
    Wortal.ads.showBanner(true, "bottom");
}

function adHideBanner() {
    appendText('hideBanner');
    Wortal.ads.showBanner(false);
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
