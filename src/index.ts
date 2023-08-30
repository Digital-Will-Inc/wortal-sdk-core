import * as _Wortal from './api';
import { debug, exception } from "./utils/logger";

// This was directly ported over from the deprecated wortal.js. We can probably find a better way to do this.
// See: https://developers.google.com/ad-placement/docs/example#indexhtml_web
//TODO: explore different implementations for this
(window as any).adsbygoogle = (window as any).adsbygoogle || [];
(window as any).adBreak = (window as any).adConfig = function (o: any) {
    (window as any).adsbygoogle.push(o);
};

// This is set by the Wortal backend and is used to identify a Wortal player via session.
//TODO: deprecate this when player persistence is implemented
(window as any).wortalSessionId = "";

// Check if the SDK should be automatically initialized or not. Manual initialization is useful for games with
// large asset bundles that need to be downloaded before the game starts. This allows the game to control when
// it is shown to the player rather than the SDK automatically initializing and showing the game while the
// assets are still loading.
let isAutoInit: boolean = true;
const scriptElement = document.currentScript;
const manualInitFlag = scriptElement?.getAttribute("data-manual-init");
if (manualInitFlag === "true") {
    isAutoInit = false;
}

/** Wortal API */
const Wortal = _Wortal;

Wortal._initializeInternal({ autoInitialize: isAutoInit }).then(() => {
    // Check Wortal.isInitialized or listen for the wortal-sdk-initialized event instead of relying on this.
    // This returns before the SDK is fully initialized due to some async calls and late initialization after
    // the platform SDKs finish loading. Do not rely on this for anything mission-critical as it does not represent
    // the SDK being fully initialized.
}).catch((error: any) => {
    exception("SDK failed to initialize.", error);
});

export default Wortal;
