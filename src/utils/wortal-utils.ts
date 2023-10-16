import { config } from "../api";
import Wortal from "../index";
import { Device } from "../types/session";
import { ShareTo } from "../types/wortal";
import { invalidParams } from "./error-handler";
import { debug, exception } from "./logger";
import { isValidShareDestination, isValidString } from "./validators";

//#region SDK Utility functions

/**
 * Functions stored here will be called when the game is paused.
 * @hidden
 */
export const onPauseFunctions: (() => void)[] = [];

/**
 * Does what the name suggests -- delays execution until a condition is met.
 * @param {Function} condition Function that returns a boolean. If the boolean is true, the promise will resolve.
 * @param {string} message Message to log while waiting for the condition to be met.
 * @hidden
 */
export function delayUntilConditionMet(condition: () => boolean, message: string = ""): Promise<void> {
    return new Promise(resolve => {
        const checkIfConditionMet = () => {
            if (condition()) {
                resolve();
            } else {
                if (isValidString(message)) {
                    debug(message);
                }
                setTimeout(checkIfConditionMet, 100);
            }
        };
        checkIfConditionMet();
    });
}

/**
 * Gets a parameter from the URL.
 * Borrowed from https://stackoverflow.com/a/901144.
 * @param name Name of the parameter to get from the URL.
 * @returns {string|null} The value of the parameter, or null if it does not exist.
 * @hidden
 */
export function getParameterByName(name: string): string | null {
    /* eslint-disable-next-line */
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
 * Gets all parameters from the URL.
 * @returns {Record<string, string>} Object containing all parameters from the URL.
 * @hidden
 */
export function getAllQueryParameters(): Record<string, string> {
    const params: any = {};
    const queryString = window.location.search.slice(1);
    const pairs = queryString.split("&");
    for (const pair of pairs) {
        const [key, value] = pair.split("=");
        params[key] = value;
    }
    return params;
}

/**
 * Generates a random ID. This can be used for a player or session ID.
 * @returns {string} Randomly generated ID.
 * @hidden
 */
export function generateRandomID(): string {
    const generateSegment = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    const segments = [
        generateSegment(),
        generateSegment(),
        generateSegment(),
        generateSegment(),
        generateSegment() + generateSegment() + generateSegment()
    ];

    return segments.join('-');
}

/**
 * Gets the size of a string in bytes. This is used to split JSON strings into chunks if they are too large to send
 * in one request.
 * @param str String to get the size of.
 * @returns {number} Size of the string in bytes.
 * @hidden
 */
export function getStringSizeInBytes(str: string): number {
    const encoder = new TextEncoder();
    const encodedString = encoder.encode(str);
    return encodedString.length;
}

/**
 * Splits a JSON string into chunks of a specified size. This is used to split large JSON strings into chunks that
 * can be sent in multiple requests.
 * @param jsonString JSON string to split into chunks.
 * @param chunkSizeInBytes Size of each chunk in bytes. Defaults to 8KB.
 * @returns {string[]} Array of JSON strings that are each smaller than the specified chunk size.
 * @hidden
 */
export function splitJSONStringIntoChunks(jsonString: string, chunkSizeInBytes: number = 8000): string[] {
    const chunks: string[] = [];
    let currentChunk = "";
    let currentChunkSize = 0;

    for (let i = 0; i < jsonString.length; i++) {
        const char: string = jsonString[i];
        const charSize: number = getStringSizeInBytes(char);

        if (currentChunkSize + charSize > chunkSizeInBytes) {
            chunks.push(currentChunk);
            currentChunk = "";
            currentChunkSize = 0;
        }

        currentChunk += char;
        currentChunkSize += charSize;
    }

    if (currentChunk !== "") {
        chunks.push(currentChunk);
    }

    return chunks;
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
            debug(`IAP initialized for ${platform} platform.`);
        });
    } else if (platform === "debug") {
        config.enableIAP();
        debug("IAP initialized for debugging.");
    } else {
        debug(`IAP not supported in this session. This may be due to platform, device or regional restrictions. \nPlatform: ${platform} // Device: ${Wortal.session.getDevice()} // Region: ${config.session.country}`);
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
    if (config.adConfig.hasPrerollShown || config.adConfig.isAdBlocked) {
        return;
    }

    const cover = document.createElement("div");
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
 * Adds a listener for the game losing focus, which will trigger any stored onPause functions. There is no onResume
 * function so games should display a popup to allow the player to resume the game when they have returned to the game.
 * @hidden
 */
export function addPauseListener(): void {
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            onPauseFunctions.forEach((callback) => {
                callback();
            });
        }
    });
}

/**
 * Adds an event handler to the ExternalEvents object. This is used to trigger callbacks from external SDKs such as
 * GD and GameMonetize that rely on a window object with a global event handler.
 * @param {string} eventName Name of the event.
 * @param {Function} callback Callback function to be called when the event is triggered.
 * @hidden
 */
export function addExternalCallback(eventName: string, callback: () => void): void {
    if (typeof callback !== "function") {
        throw invalidParams(undefined, "addExternalCallback()");
    }

    if (typeof config.session.externalCallbacks !== "undefined") {
        config.session.externalCallbacks[eventName] = callback;
    } else {
        exception("externalCallbacks is undefined. This is a fatal error that should have been caught during initialization.");
    }
}

/**
 * Triggers a callback from an external SDK. This is used by SDKs such as GD and GameMonetize that use a window
 * object with a global event handler to trigger callbacks.
 * @param {string} value Name of the event to trigger.
 * @hidden
 */
export function externalSDKEventTrigger(value: string): void {
    if (typeof config.session.externalCallbacks !== "undefined") {
        const callback = config.session.externalCallbacks[value];
        if (typeof callback !== "undefined") {
            debug(`External event triggered. Event: ${value}`);
            callback();
        } else {
            debug(`External event triggered, but no callback is defined for this event. Event: ${value}`);
        }
    } else {
        exception("External event triggered, but externalCallbacks is undefined. This is a fatal error that should have been caught during initialization.");
    }
}

/**
 * Awaits a callback from the Telegram SDK. Removes the listener after the callback is triggered or after a timeout.
 * @param eventName Name of the event to wait for.
 * @returns {Promise<any>} Promise that resolves when the event is triggered. Contains the data from the event, if any exists.
 * @hidden
 */
export function waitForTelegramCallback(eventName: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let timeoutID: any = null;

        const eventHandler = ({ data }: any) => {
            const playdeck = data?.playdeck;
            if (playdeck?.method === eventName) {
                debug(`Telegram event callback. Event: ${eventName}`, playdeck?.value);
                window.removeEventListener("message", eventHandler);
                clearTimeout(timeoutID);
                resolve(playdeck?.value);
            }
        }

        window.addEventListener("message", eventHandler);

        timeoutID = setTimeout(() => {
            window.removeEventListener("message", eventHandler);
            reject(new Error(`Timeout: '${eventName}' event not triggered within the timeout range.`));
        }, 5000);
    });
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

/**
 * Returns whether the specified API is supported on the current platform. This is just a wrapper for
 * Wortal.getSupportedAPIs().includes(api) so it's easier to read.
 * @param api API to check for support.
 * @returns {boolean} Whether the API is supported on the current platform. Always true on debug platform.
 * @hidden
 */
export function isSupportedOnCurrentPlatform(api: string): boolean {
    if (config.session.platform === "debug") {
        return true;
    }
    return Wortal.getSupportedAPIs().includes(api);
}

//#endregion
//#region Wortal page functions

window.shareGame = function (destination: ShareTo, message: string): void {
    if (!isValidShareDestination(destination)) {
        throw invalidParams(undefined, "shareGame()");
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

//#endregion
