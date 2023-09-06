import { TrafficSource } from "../interfaces/session";
import { Error_Facebook_Rakuten } from "../interfaces/wortal";
import { Device, Orientation, Platform } from "../types/session";
import { API_URL, WORTAL_API } from "../utils/config";
import { invalidParams, notSupported, rethrowError_Facebook_Rakuten } from "../utils/error-handler";
import { isValidString } from "../utils/validators";
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
    //TODO: parse crazygames entrypoint data
    const platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return config.platformSDK.getEntryPointData();
    } else if (platform === "debug") {
        return {
            "referral_id": "debug",
            "bonus_data": "debug",
        };
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
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC, API_URL.SESSION_GET_ENTRY_POINT_ASYNC);
                });
        } else if (platform === "debug") {
            return "debug";
        } else {
            throw notSupported(undefined, WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC);
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
    } else if (platform === "debug") {
        return {
            "r_entrypoint": "debug",
            "utm_source": "debug",
        };
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

/**
 * Gets the orientation of the device the player is using. This is useful for determining how to display the game.
 * @example
 * const orientation = Wortal.session.getOrientation();
 * if (orientation === 'portrait') {
 *    // Render portrait mode.
 * }
 * @returns {Orientation} Orientation of the device the player is using.
 */
export function getOrientation(): Orientation {
    const portrait = window.matchMedia("(orientation: portrait)").matches;
    if (portrait) {
        return "portrait";
    } else {
        return "landscape";
    }
}

/**
 * Assigns a callback to be invoked when the orientation of the device changes.
 * @example
 * Wortal.session.onOrientationChange(orientation => {
 *    if (orientation === 'portrait') {
 *      // Render portrait mode
 *    }
 * });
 * @param callback Callback to be invoked when the orientation of the device changes.
 */
export function onOrientationChange(callback: (orientation: Orientation) => void): void {
    if (typeof callback !== "function") {
        throw invalidParams(undefined, WORTAL_API.SESSION_ON_ORIENTATION_CHANGE, API_URL.SESSION_ON_ORIENTATION_CHANGE);
    }

    window.matchMedia("(orientation: portrait)").addEventListener("change", event => {
        const portrait = event.matches;
        if (portrait) {
            callback("portrait");
        } else {
            callback("landscape");
        }
    });
}

/**
 * Request to switch to another game. The API will reject if the switch fails - else, the client will load the new game.
 * @example
 * Wortal.session.switchGameAsync(
 *   '12345678',
 *   { referrer: 'game_switch', reward_coins: 30 });
 * @param gameID ID of the game to switch to. The application must be a Wortal game.
 * @param data An optional data payload. This will be set as the entrypoint data for the game being switched to. Must be less than or equal to 1000 characters when stringified.
 * @returns {Promise<void>} Promise that resolves when the game has switched. If the game fails to switch, the promise will reject.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAMS</li>
 * <li>USER_INPUT</li>
 * <li>PENDING_REQUEST</li>
 * <li>CLIENT_REQUIRES_UPDATE</li>
 * <li>NOT_SUPPORTED</li>
 * </ul>
 */
export function switchGameAsync(gameID: string, data?: object): Promise<void> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(gameID)) {
            throw invalidParams(undefined, WORTAL_API.SESSION_SWITCH_GAME_ASYNC, API_URL.SESSION_SWITCH_GAME_ASYNC);
        }

        if (platform === "facebook") {
            return config.platformSDK.switchGameAsync(gameID, data)
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.SESSION_SWITCH_GAME_ASYNC, API_URL.SESSION_SWITCH_GAME_ASYNC);
                });
        } else if (platform === "debug") {
            return;
        } else {
            throw notSupported(undefined, WORTAL_API.SESSION_SWITCH_GAME_ASYNC);
        }
    });
}

/**
 * The happyTimeAsync method can be called on various player achievements (beating a boss, reaching a high score, etc.).
 * It makes the website celebrate (for example by launching some confetti). There is no need to call this when a level
 * is completed, or an item is obtained.
 * @example
 * // Player defeats a boss
 * Wortal.session.happyTime();
 */
export function happyTime(): void {
    const platform = config.session.platform;
    if (platform === "crazygames") {
        config.platformSDK.game.happytime();
    }
}

/**
 * Tracks the start of a gameplay session, including resuming play after a break.
 * Call whenever the player starts playing or resumes playing after a break
 * (menu/loading/achievement screen, game paused, etc.).
 * @example
 * // Player closes in-game menu and resumes playing
 * Wortal.session.gameplayStart();
 */
export function gameplayStart(): void {
    const platform = config.session.platform;
    if (platform === "crazygames") {
        config.platformSDK.game.gameplayStart();
    }
}

/**
 * Tracks the end of a gameplay session, including pausing play or opening a menu.
 * Call on every game break (entering a menu, switching level, pausing the game, ...)
 * @example
 * // Player opens in-game menu
 * Wortal.session.gameplayStop();
 */
export function gameplayStop(): void {
    const platform = config.session.platform;
    if (platform === "crazygames") {
        config.platformSDK.game.gameplayStop();
    }
}

/**
 * Tracks the start of the game loading in the session. This is used to determine how long the game takes to load.
 * @hidden
 * @private
 */
export function _gameLoadingStart(): void {
    const platform = config.session.platform;
    if (platform === "crazygames") {
        config.platformSDK.game.sdkGameLoadingStart();
    } else {
        config.game.startGameLoadTimer();
    }
}

/**
 * Tracks the end of the game loading in the session. This is used to determine how long the game takes to load.
 * @hidden
 * @private
 */
export function _gameLoadingStop(): void {
    const platform = config.session.platform;
    if (platform === "crazygames") {
        config.platformSDK.game.sdkGameLoadingStop();
    } else {
        config.game.stopGameLoadTimer();
    }
}
