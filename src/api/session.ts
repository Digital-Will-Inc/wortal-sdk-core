import { TrafficSource } from "../interfaces/session";
import { Device, Platform } from "../types/session";
import { notSupported, rethrowPlatformError } from "../utils/error-handler";
import { detectDevice } from "../utils/wortal-utils";
import { config } from "./index";

/**
 * Returns any data object associated with the entry point that the game was launched from.
 *
 * The contents of the object are developer-defined, and can occur from entry points on different platforms.
 * This will return null for older mobile clients, as well as when there is no data associated with the particular entry point.
 * @example
 * const data = Wortal.session.getEntryPointData();
 * console.log(data.property);
 * @returns {Record<string, unknown>} Data about the entry point or an empty object if none exists.
 */
export function getEntryPointData(): Record<string, unknown> {
    const platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return config.platformSDK.getEntryPointData();
    } else {
        return {};
    }
}

/**
 * Returns the entry point that the game was launched from.
 * @example
 * Wortal.session.getEntryPointAsync()
 *  .then(entryPoint => console.log(entryPoint);
 * @returns {Promise<string>} Promise that resolves with the name of the entry point from which the user started the game.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getEntryPointAsync(): Promise<string> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.getEntryPointAsync()
                .then((entryPoint: string) => {
                    return entryPoint;
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "player.getEntryPointAsync");
                });
        } else {
            throw notSupported(`Session API not currently supported on platform: ${platform}`, "session.getEntryPointAsync");
        }
    });
}

/**
 * Sets the data associated with the individual gameplay session for the current context.
 *
 * This function should be called whenever the game would like to update the current session data.
 * This session data may be used to populate a variety of payloads, such as game play webhooks.
 * @example
 * Wortal.session.setSessionData({
 *     'high-score': 100,
 *     'current-level': 2,
 * });
 * @param data An arbitrary data object, which must be less than or equal to 1000 characters when stringified.
 */
export function setSessionData(data: Record<string, unknown>): void {
    const platform = config.session.platform;
    if (platform === "viber" || platform === "facebook") {
        config.platformSDK.setSessionData(data);
    }
}

/**
 * Gets the locale the player is using. This is useful for localizing your game.
 * @example
 * const lang = Wortal.session.getLocale();
 * @returns {string} Locale in [BCP47](http://www.ietf.org/rfc/bcp/bcp47.txt) format.
 */
export function getLocale(): string {
    return navigator.language;
}

/**
 * Gets the traffic source info for the game. This is useful for tracking where players are coming from.
 * For example, if you want to track where players are coming from for a specific campaign.
 * @example
 * const source = Wortal.session.getTrafficSource();
 * console.log(source['r_entrypoint']);
 * console.log(source['utm_source']);
 * @returns {TrafficSource} URL parameters attached to the game.
 */
export function getTrafficSource(): TrafficSource {
    const platform = config.session.platform;
    if (platform === "link" || platform === "viber") {
        return config.platformSDK.getTrafficSource();
    } else {
        return {};
    }
}

/**
 * Gets the platform the game is running on. This is useful for platform specific code.
 * For example, if you want to show a different social share asset on Facebook than on Link.
 * @example
 * const platform = Wortal.session.getPlatform();
 * console.log(platform);
 * @returns {Platform} Platform the game is running on.
 */
export function getPlatform(): Platform {
    return config.session.platform;
}

/**
 * Gets the device the player is using. This is useful for device specific code.
 * @example
 * const device = Wortal.session.getDevice();
 * console.log(device);
 * @returns {Device} Device the player is using.
 */
export function getDevice(): Device {
    const platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return config.platformSDK.getPlatform();
    } else {
        return detectDevice();
    }
}
