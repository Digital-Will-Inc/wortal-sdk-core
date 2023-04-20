import { Platform } from "../types/platform";
import { TrafficSource } from "../types/traffic-source";
import { notSupported, rethrowRakuten } from "../utils/error-handler";
import { config } from "./index";

/**
 * Gets the data bound to the entry point.
 * @example
 * let data = Wortal.session.getEntryPointData();
 * console.log(data.property);
 * @returns Data about the entry point or an empty object if none exists.
 */
export function getEntryPointData(): Record<string, unknown> {
    let platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return (window as any).wortalGame.getEntryPointData();
    } else {
        return {};
    }
}

/**
 * Gets the entry point of where the game started from.
 * @example
 * Wortal.session.getEntryPointAsync()
 *  .then(entryPoint => console.log(entryPoint);
 * @returns Details about where the game started from.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getEntryPointAsync(): Promise<string> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.getEntryPointAsync()
                .then((entryPoint: string) => {
                    return entryPoint;
                })
                .catch((e: any) => {
                    if (platform === "link" || platform === "viber") {
                        throw rethrowRakuten(e, "player.getEntryPointAsync");
                    } else {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Session API not currently supported on platform: " + platform, "session.getEntryPointAsync");
        }
    });
}

/**
 * Sets the data for this session. This is not persistent and is only used to populate webhook events.
 * @example
 * Wortal.session.setSessionData({
 *     'high-score': 100,
 *     'current-level': 2,
 * });
 * @param data Data to set.
 */
export function setSessionData(data: Record<string, unknown>): void {
    let platform = config.session.platform;
    if (platform === "viber" || platform === "facebook") {
        (window as any).wortalGame.setSessionData(data);
    } else {
        // Fail silently.
    }
}

/**
 * Gets the locale the player is using. This is useful for localizing your game.
 * @example
 * let lang = Wortal.session.getLocale();
 * @returns Locale in [BCP47](http://www.ietf.org/rfc/bcp/bcp47.txt) format.
 */
export function getLocale(): string {
    return navigator.language;
}

/**
 * Gets the traffic source info for the game. This is useful for tracking where players are coming from.
 * For example, if you want to track where players are coming from for a specific campaign.
 * @example
 * let source = Wortal.session.getTrafficSource();
 * console.log(source['r_entrypoint']);
 * console.log(source['utm_source']);
 * @returns URL parameters attached to the game.
 */
export function getTrafficSource(): TrafficSource {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.getTrafficSource();
    } else {
        return {};
    }
}

/**
 * Gets the platform the game is running on. This is useful for platform specific code.
 * For example, if you want to show a different social share asset on Facebook than on Link.
 * @example
 * let platform = Wortal.session.getPlatform();
 * console.log(platform);
 * @returns Platform the game is running on.
 */
export function getPlatform(): Platform {
    return config.session.platform;
}
