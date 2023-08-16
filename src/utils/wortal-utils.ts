import { config } from "../api";
import Wortal from "../index";
import { Device } from "../types/session";
import { ShareTo } from "../types/wortal";
import { invalidParams } from "./error-handler";
import { debug, exception } from "./logger";
import { isValidShareDestination } from "./validators";

//
// UTILITY FUNCTIONS
//

/**
 * Gets a parameter from the URL.
 * Borrowed from https://stackoverflow.com/a/901144.
 * @param name Name of the parameter to get from the URL.
 * @returns {string|null} The value of the parameter, or null if it does not exist.
 * @hidden
 */
export function getParameterByName(name: string): string | null {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);

    if (!results) {
        return null;
    }

    if (!results[2]) {
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Tries to enable IAP for the current platform. This is only supported on some platforms and takes some time to
 * initialize. Once the platform SDK signals that the IAP is ready, the SDK will enable the IAP API. If this fails
 * for any reason, the IAP API will not be enabled.
 * @hidden
 */
export function tryEnableIAP(): void {
    debug("Checking for IAP compatibility..");
    const platform = config.session.platform;
    if (platform === "viber" || platform === "facebook") {
        config.platformSDK.payments.onReady(() => {
            config.enableIAP();
            debug("IAP initialized for platform.");
        });
    } else {
        debug("IAP not supported. This may be due to platform, device or regional restrictions.");
    }
}

/**
 * Checks the current state of the document and adds a loading cover if the document is finished loading. Otherwise,
 * adds a listener to add the loading cover when the document is finished loading. This is used for the Wortal and GD
 * platforms to prevent the game canvas from being shown before the preroll ad finishes.
 * @hidden
 */
export function addLoadingListener(): void {
    const platform = config.session.platform;
    if (document.readyState === "loading") {
        if (platform === "wortal" || platform === "gd") {
            document.addEventListener("DOMContentLoaded", addLoadingCover);
        }
    } else {
        if (platform === "wortal" || platform === "gd") {
            addLoadingCover();
        }
    }
}

/**
 * Adds a loading cover to the document. This is just a blank div that covers the entire screen. It is used to prevent
 * the game canvas from being shown before the preroll ad finishes.
 * @hidden
 */
export function addLoadingCover(): void {
    let cover = document.createElement("div");
    cover.id = "loading-cover";
    cover.style.cssText = "background: #000000; width: 100%; height: 100%; position: fixed; z-index: 100;";
    document.body.prepend(cover);
}

/**
 * Removes the loading cover from the document. This is used to remove the loading cover after the preroll ad finishes.
 * Failure to call this when the loading cover has been added will result in the game being hidden and unplayable.
 * @hidden
 */
export function removeLoadingCover(): void {
    if (document.getElementById("loading-cover")) {
        document.getElementById("loading-cover")!.style.display = "none";
    }
}

/**
 * Adds a listener to the document to log game end events when the document is hidden. This isn't entirely accurate,
 * as the game could be paused for other reasons, but it is the best we can do for now.
 * @hidden
 */
export function addGameEndEventListener(): void {
    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            Wortal.analytics._logGameEnd();
        }
    });
}

/**
 * Adds an event handler to the GD events object. This is used to trigger callbacks from the GD SDK.
 * @param {string} eventName Name of the event.
 * @param {Function} callback Callback function to be called when the event is triggered.
 * @hidden
 */
export function addGDCallback(eventName: string, callback: Function) {
    if (typeof callback !== "function") {
        throw invalidParams("[Wortal] Callback is not a function.", "addGDEvents()");
    }

    if (typeof config.adConfig.gdCallbacks !== "undefined") {
        config.adConfig.gdCallbacks[eventName] = callback;
    }
}

/**
 * Triggers a callback from the GD events object.
 * @param {string} value Name of the event to trigger.
 * @hidden
 */
export function gdEventTrigger(value: string): void {
    if (typeof config.adConfig.gdCallbacks !== "undefined") {
        const callback = config.adConfig.gdCallbacks[value];
        if (typeof callback !== "undefined") {
            callback();
        } else {
            debug(`GD event triggered, but no callback is defined for this event. Event: ${value}}`);
        }
    } else {
        exception("GD event triggered, but GDCallbacks is undefined. This is a fatal error that should have been caught during initialization.");
    }
}

/**
 * Detects the device the player is using. This is based on navigator.userAgent and is not guaranteed to be accurate.
 * @hidden
 */
export function detectDevice(): Device {
    //TODO: replace this with Navigator.userAgentData when its widely supported
    if (/android/i.test(navigator.userAgent)) {
        return "ANDROID";
    } else if (/iphone/i.test(navigator.userAgent)) {
        return "IOS";
    } else if (/ipad/i.test(navigator.userAgent)) {
        return "IOS";
    } else {
        return "DESKTOP";
    }
}

//
// PLATFORM FUNCTIONS
//

/**
 * Shares the game on the specified platform. This is only supported on Wortal and was ported over from the now
 * deprecated wortal.js. It is not recommended to use this function, as it is called from the page
 * displaying the game.
 * @hidden
 */
(window as any).shareGame = function (destination: ShareTo, message: string): void {
    if (!isValidShareDestination(destination)) {
        throw invalidParams("[Wortal] Invalid share destination.", "shareGame()");
    }

    switch (destination) {
        case "facebook":
            return _shareOnFacebook(message);
        case "twitter":
            return _shareOnTwitter(message);
    }
}

/**
 * @hidden
 * @private
 */
function _getShareUrl(): string | null {
    return getParameterByName("shareUrl");
}

/**
 * @hidden
 * @private
 */
function _shareOnFacebook(message: string): void {
    const shareUrl = _getShareUrl();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${message}`
    window.open(url, "_blank");
}

/**
 * @hidden
 * @private
 */
function _shareOnTwitter(message: string): void {
    const shareUrl = _getShareUrl();
    const url = "https://twitter.com/intent/tweet"
    window.open(`${url}?url=${shareUrl}&text=${message}`, "_blank");
}
