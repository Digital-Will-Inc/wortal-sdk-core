import { ConnectedPlayer } from "../classes/player";
import { ConnectedPlayerPayload, PlayerData, SignedASID } from "../interfaces/player";
import { Error_Facebook_Rakuten } from "../interfaces/wortal";
import { Error_CrazyGames } from "../types/wortal";
import { API_URL, WORTAL_API } from "../utils/config";
import {
    invalidParams,
    notSupported,
    operationFailed,
    rethrowError_CrazyGames,
    rethrowError_Facebook_Rakuten
} from "../utils/error-handler";
import { warn } from "../utils/logger";
import { isSupportedOnCurrentPlatform } from "../utils/wortal-utils";
import { config } from "./index";

/**
 * Gets the player's ID from the platform.
 * @example
 * Wortal.player.getID(); // 'Player123ABC'
 * @returns {string | null} The player's ID.
 */
export function getID(): string | null {
    return config.player.id;
}

/**
 * Gets the player's name on the platform.
 * @example
 * Wortal.player.getName(); // 'Ragnar Lothbrok'
 * @returns {string | null} The player's name.
 */
export function getName(): string | null {
    return config.player.name;
}

/**
 * Gets the player's photo from the platform.
 * @example
 * Wortal.player.getPhoto();
 * @returns {string | null} URL of image for the player's photo.
 */
export function getPhoto(): string | null {
    return config.player.photo;
}

/**
 * Checks whether this is the first time the player has played this game.
 * @example
 * if (Wortal.player.isFirstPlay()) {
 *    // Show tutorial
 *    Wortal.player.setDataAsync({ tutorialShown: true });
 * }
 * @returns {boolean} True if it is the first play. Some platforms do not have data persistence and always return true.
 */
export function isFirstPlay(): boolean {
    return config.player.isFirstPlay;
}

/**
 * Retrieve data from the designated cloud storage of the current player.
 *
 * PLATFORM NOTE: JSON objects stored as string values will be returned back as JSON objects on Facebook.
 * @example
 * Wortal.player.getDataAsync(['items', 'lives'])
 *  .then(data => {
 *      console.log(data['items']);
 *      console.log(data['lives']);
 *  });
 * @param keys Array of keys for the data to get.
 * @returns {Promise<any>} Promise that resolves with an object which contains the current key-value pairs for each
 * key specified in the input array, if they exist.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>NETWORK_FAILURE</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * </ul>
 */
export function getDataAsync(keys: string[]): Promise<any> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!Array.isArray(keys) || !keys.length) {
            throw invalidParams(undefined, WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC);
        }

        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_GET_DATA_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_GET_DATA_ASYNC);
        }

        if (platform === "debug") {
            const data = localStorage.getItem("wortal-data");
            if (data) {
                const dataObj = JSON.parse(data);
                const result: any = {};
                keys.forEach((key: string) => {
                    result[key] = dataObj[key];
                });
                return result;
            } else {
                warn("No wortal-data found in localStorage. Returning empty object.");
                return {};
            }
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.player.getDataAsync(keys)
                .then((data: any) => {
                    return data;
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC);
                });
        }
    });
}

/**
 * Set data to be saved to the designated cloud storage of the current player. The game can store up to 1MB of data
 * for each unique player.
 * @example
 * Wortal.player.setDataAsync({
 *     items: {
 *         coins: 100,
 *         boosters: 2
 *     },
 *     lives: 3,
 * });
 * @param data An object containing a set of key-value pairs that should be persisted to cloud storage. The object must
 * contain only serializable values - any non-serializable values will cause the entire modification to be rejected.
 * @returns {Promise<void>} Promise that resolves when the input values are set.
 *
 * NOTE: The promise resolving does not necessarily mean that the input has already been persisted. Rather, it means
 * that the data was valid and has been scheduled to be saved. It also guarantees that all values that were set are now
 * available in `player.getDataAsync`.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>NETWORK_FAILURE</li>
 * <li>PENDING_REQUEST</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * </ul>
 */
export function setDataAsync(data: Record<string, unknown>): Promise<void> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_SET_DATA_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_SET_DATA_ASYNC);
        }

        if (platform === "debug") {
            try {
                localStorage.setItem("wortal-data", JSON.stringify(data));
            } catch (error: any) {
                throw operationFailed(`Error saving object to localStorage: ${error.message}`, WORTAL_API.PLAYER_SET_DATA_ASYNC);
            }
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.player.setDataAsync(data)
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
                });
        }
    });
}

/**
 * Flushes any unsaved data to the platform's storage. This function is expensive, and should primarily be used for
 * critical changes where persistence needs to be immediate and known by the game. Non-critical changes should rely on
 * the platform to persist them in the background.
 *
 * NOTE: Calls to `player.setDataAsync` will be rejected while this function's result is pending.
 * @example
 * Wortal.player.flushDataAsync()
 *  .then(() => console.log("Data flushed."));
 * @returns {Promise<void>} Promise that resolves when changes have been persisted successfully, and rejects if the save fails.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>NETWORK_FAILURE</li>
 * <li>PENDING_REQUEST</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * </ul>
 */
export function flushDataAsync(): Promise<void> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_FLUSH_DATA_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_FLUSH_DATA_ASYNC);
        }

        if (platform === "debug") {
            return;
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.player.flushDataAsync()
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_FLUSH_DATA_ASYNC, API_URL.PLAYER_FLUSH_DATA_ASYNC);
                });
        }
    });
}

/**
 * Fetches an array of ConnectedPlayer objects containing information about active players that are connected to the current player.
 *
 * PLATFORM NOTE: Facebook does not support the payload parameter or any filters, it will always return the list of
 * connected players who have played the game in the last 90 days. Facebook also requires the user_data permission to
 * be granted to the game in order to use this API.
 * @example
 * Wortal.player.getConnectedPlayersAsync({
 *     filter: 'ALL',
 *     size: 20,
 *     hoursSinceInvitation: 4,
 * }).then(players => console.log(players.length));
 * @param payload Options for the friends to get.
 * @returns {Promise<ConnectedPlayer[]>} Promise that resolves with a list of connected player objects.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>NETWORK_FAILURE</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * </ul>
 */
export function getConnectedPlayersAsync(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC);
        }

        if (platform === "debug") {
            return [ConnectedPlayer.mock(), ConnectedPlayer.mock(), ConnectedPlayer.mock()];
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.player.getConnectedPlayersAsync(payload)
                .then((players: any) => {
                    return players.map((player: any) => {
                        const playerData: PlayerData = {
                            id: player.getID(),
                            name: player.getName(),
                            photo: player.getPhoto(),
                            // Facebook's player model doesn't have the hasPlayed flag.
                            isFirstPlay: platform === "facebook" ? false : !player.hasPlayed,
                            daysSinceFirstPlay: 0,
                        };
                        return new ConnectedPlayer(playerData);
                    });
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC, API_URL.PLAYER_GET_CONNECTED_PLAYERS_ASYNC);
                });
        }
    });
}

/**
 * Gets a signed player object that includes the player ID and signature for validation. This can be used to
 * send something to a backend server for validation, such as game or purchase data.
 * @example
 * Wortal.player.getSignedPlayerInfoAsync()
 *  .then(info => {
 *      myServer.validate(
 *          info.id,
 *          info.signature,
 *          gameDataToValidate,
 *      )
 *  });
 * @returns {Promise<object>} Promise that resolves with an object containing the player ID and signature.
 * @see Signature
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>NETWORK_FAILURE</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * </ul>
 */
export function getSignedPlayerInfoAsync(): Promise<object> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC);
        }

        if (platform === "debug") {
            return {
                id: config.player.id,
                signature: "debug.signature",
            };
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.player.getSignedPlayerInfoAsync()
                .then((info: any) => {
                    return {
                        id: info.getPlayerID(),
                        signature: info.getSignature(),
                    };
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC, API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC);
                });
        }
    });
}

/**
 * A unique identifier for the player. This is the standard Facebook Application-Scoped ID which is used for all Graph
 * API calls. If your game shares an AppID with a native game this is the ID you will see in the native game too.
 * @example
 * Wortal.player.getASIDAsync()
 * .then(asid => console.log("Player ASID: " + asid));
 * @returns {Promise<string>} A unique identifier for the player. String is nullable.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getASIDAsync(): Promise<string> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_GET_ASID_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_GET_ASID_ASYNC);
        }

        if (platform === "debug") {
            return config.player.id;
        }

        if (platform === "facebook") {
            return config.platformSDK.player.getASIDAsync()
                .then((asid: string) => {
                    return asid;
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_ASID_ASYNC, API_URL.PLAYER_GET_ASID_ASYNC);
                });
        }
    });
}

/**
 * A unique identifier for the player. This is the standard Facebook Application-Scoped ID which is used for all Graph
 * API calls. If your game shares an AppID with a native game this is the ID you will see in the native game too.
 * @example
 * Wortal.player.getSignedASIDAsync()
 *  .then(info => {
 *     myServer.validate(
 *     info.asid,
 *     info.signature,
 *     );
 *   });
 * @returns {Promise<SignedASID>} Promise that resolves with an object containing player ASID and signature.
 * @see SignedASID
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getSignedASIDAsync(): Promise<SignedASID> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC);
        }

        if (platform === "debug") {
            return {
                asid: config.player.id,
                signature: "debug.signature",
            };
        }

        if (platform === "facebook") {
            return config.platformSDK.player.getSignedASIDAsync()
                .then((info: any) => {
                    return {
                        asid: info.getASID(),
                        signature: info.getSignature(),
                    };
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC, API_URL.PLAYER_GET_SIGNED_ASID_ASYNC);
                });
        }
    });
}

/**
 * Checks if the current user can subscribe to the game's bot.
 * @example
 * Wortal.player.canSubscribeBotAsync()
 * .then(canSubscribe => console.log("Can subscribe to bot: " + canSubscribe));
 * @returns {Promise<boolean>} Promise that resolves whether a player can subscribe to the game bot or not. Developer can only call
 * `player.subscribeBotAsync()` after checking `player.canSubscribeBotAsync()`, and the game will only be able to show the player their
 * bot subscription dialog once per week.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RATE_LIMITED</li>
 * <li>INVALID_OPERATION</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * </ul>
 */
export function canSubscribeBotAsync(): Promise<boolean> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC);
        }

        if (platform === "debug") {
            return true;
        }

        if (platform === "facebook") {
            return config.platformSDK.player.canSubscribeBotAsync()
                .then((canSubscribe: boolean) => {
                    return canSubscribe;
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC);
                });
        }
    });
}

/**
 * Request that the player subscribe the bot associated to the game. The API will reject if the subscription fails -
 * else, the player will subscribe the game bot.
 * @example
 * Wortal.player.subscribeBotAsync()
 * .then(() => console.log("Player subscribed to bot"));
 * @returns {Promise<void>} Promise that resolves if player successfully subscribed to the game bot, or rejects if
 * request failed or player chose to not subscribe.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>PENDING_REQUEST</li>
 * <li>CLIENT_REQUIRES_UPDATE</li>
 * </ul>
 */
export function subscribeBotAsync(): Promise<void> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC);
        }

        if (platform === "debug") {
            return;
        }

        if (platform === "facebook") {
            return config.platformSDK.player.subscribeBotAsync()
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC);
                });
        }
    });
}

/**
 * Gets the player token from the platform.
 * @example
 * Wortal.player.getTokenAsync()
 * .then(token => console.log("Player token: " + token));
 * @returns {Promise<string>} Promise that resolves with the player token.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>AUTH_NOT_ENABLED</li>
 * <li>USER_NOT_AUTHENTICATED</li>
 * <li>UNKNOWN</li>
 * <li>NOT_SUPPORTED</li>
 * </ul>
 */
export function getTokenAsync(): Promise<string | undefined> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_GET_TOKEN_ASYNC)) {
            throw notSupported(undefined, WORTAL_API.PLAYER_GET_TOKEN_ASYNC);
        }

        if (platform === "debug") {
            return "debug.token";
        }

        if (platform === "crazygames") {
            return new Promise((resolve) => {
                const callback = (error: Error_CrazyGames, token: string) => {
                    if (error) {
                        throw rethrowError_CrazyGames(error, WORTAL_API.PLAYER_GET_TOKEN_ASYNC, API_URL.PLAYER_GET_TOKEN_ASYNC);
                    } else {
                        resolve(token);
                    }
                };
                config.platformSDK.user.getUserToken(callback);
            });
        }
    });
}

/**
 * Registers a callback to be called when the player logs in or registers for an account.
 * @param callback Callback to be called when the player logs in or registers for an account.
 * @example
 * Wortal.player.onLogin(() => console.log("Player logged in or registered"));
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * </ul>
 */
export function onLogin(callback: () => void): void {
    const platform = config.session.platform;
    if (typeof callback !== "function") {
        throw invalidParams(undefined, WORTAL_API.PLAYER_ON_LOGIN, API_URL.PLAYER_ON_LOGIN);
    }

    if (!isSupportedOnCurrentPlatform(WORTAL_API.PLAYER_ON_LOGIN)) {
        throw notSupported(undefined, WORTAL_API.PLAYER_ON_LOGIN);
    }

    if (platform === "debug") {
        callback();
    }

    if (platform === "crazygames") {
        config.platformSDK.user.addAuthListener(callback);
    }
}
