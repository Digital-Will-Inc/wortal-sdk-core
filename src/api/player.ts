import ConnectedPlayer from "../models/connected-player";
import { ConnectedPlayerPayload, PlayerData } from "../types/player";
import { SignedASID } from "../types/signed-asid";
import { invalidParams, notSupported, rethrowRakuten } from "../utils/error-handler";
import { config } from "./index";

/**
 * Gets the player's ID from the platform.
 * @example
 * Wortal.player.getID(); // 'Player123ABC'
 * @returns The player's ID.
 */
export function getID(): string {
    return config.player.id;
}

/**
 * Gets the player's name on the platform.
 * @example
 * Wortal.player.getName(); // 'Ragnar Lothbrok'
 * @returns The player's name.
 */
export function getName(): string {
    return config.player.name;
}

/**
 * Gets the player's photo from the platform.
 * @example
 * Wortal.player.getPhoto(); // 'data:image/png;base64,iVBORw0KGgoAAAANSUh..' (base64 encoded image)
 * @returns URL of base64 image for the player's photo.
 */
export function getPhoto(): string {
    return config.player.photo;
}

/**
 * Checks whether this is the first time the player has played this game.
 * @example
 * if (Wortal.player.isFirstPlay()) {
 *    // Show tutorial
 *    Wortal.player.setDataAsync({ tutorialShown: true });
 * }
 * @returns True if it is the first play. Some platforms do not have data persistence and always return true.
 */
export function isFirstPlay(): boolean {
    return config.player.isFirstPlay;
}

/**
 * Gets the game data with the specific keys from the platform's storage.
 * @example
 * Wortal.player.getDataAsync(['items', 'lives'])
 *  .then(data => {
 *      console.log(data['items]);
 *      console.log(data['lives']);
 *  });
 * @param keys Array of keys for the data to get.
 * @returns Key-value pairs of the data.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getDataAsync(keys: string[]): Promise<any> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!Array.isArray(keys) || !keys.length) {
            throw invalidParams("keys cannot be null or empty.", "player.getDataAsync");
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.player.getDataAsync(keys)
                .then((data: any) => {
                    return data;
                })
                .catch((e: any) => {
                    if (platform === "link" || platform === "viber") {
                        throw rethrowRakuten(e, "player.getDataAsync");
                    } else {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Player API not currently supported on platform: " + platform, "player.getDataAsync");
        }
    });
}

/**
 * Uploads game data to the platform's storage. Max size is 1MB.
 * @example
 * Wortal.player.setDataAsync({
 *     items: {
 *         coins: 100,
 *         boosters: 2
 *     },
 *     lives: 3,
 * });
 * @param data Key-value pairs of the data to upload. Nullable values will remove the data.
 * @returns Promise that resolves when the data is uploaded.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function setDataAsync(data: Record<string, unknown>): Promise<void> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.player.setDataAsync(data)
                .catch((e: any) => {
                    if (platform === "link" || platform === "viber") {
                        throw rethrowRakuten(e, "player.setDataAsync");
                    } else {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Player API not currently supported on platform: " + platform, "player.setDataAsync");
        }
    });
}

/**
 * Flushes any unsaved data to the platform's storage. This function is expensive, and should primarily be used for
 * critical changes where persistence needs to be immediate and known by the game. Non-critical changes should rely on
 * the platform to persist them in the background.
 * NOTE: Calls to player.setDataAsync will be rejected while this function's result is pending.
 * @example
 * Wortal.player.flushDataAsync()
 *  .then(() => console.log("Data flushed."));
 * @returns Promise that resolves when the data is flushed.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function flushDataAsync(): Promise<void> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.player.flushDataAsync()
                .catch((e: any) => {
                    if (platform === "link" || platform === "viber") {
                        throw rethrowRakuten(e, "player.flushDataAsync");
                    } else {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Player API not currently supported on platform: " + platform, "player.flushDataAsync");
        }
    });
}

/**
 * Gets the friends of the player who have also played this game before.
 * @example
 * Wortal.player.getConnectedPlayersAsync({
 *     filter: 'ALL',
 *     size: 20,
 *     hoursSinceInvitation: 4,
 * }).then(players => console.log(players.length);
 * @param payload Options for the friends to get.
 * @returns Array of connected players.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getConnectedPlayersAsync(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.player.getConnectedPlayersAsync(payload)
                .then((players: any) => {
                    return players.map((player: any) => {
                        let playerData: PlayerData = {
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
                .catch((e: any) => {
                    if (platform === "link" || platform === "viber") {
                        throw rethrowRakuten(e, "player.getConnectedPlayersAsync");
                    } else {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Player API not currently supported on platform: " + platform, "player.getConnectedPlayersAsync");
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
 * @returns Object with player ID and signature.
 * @see Signature
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getSignedPlayerInfoAsync(): Promise<object> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.player.getSignedPlayerInfoAsync()
                .then((info: any) => {
                    return {
                        id: info.getPlayerID(),
                        signature: info.getSignature(),
                    };
                })
                .catch((e: any) => {
                    if (platform === "link" || platform === "viber") {
                        throw rethrowRakuten(e, "player.getSignedPlayerInfoAsync");
                    } else {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Player API not currently supported on platform: " + platform, "player.getSignedPlayerInfoAsync");
        }
    });
}

/**
 * A unique identifier for the player. This is the standard Facebook Application-Scoped ID which is used for all Graph
 * API calls. If your game shares an AppID with a native game this is the ID you will see in the native game too.
 * @example
 * Wortal.player.getASIDAsync()
 * .then(asid => console.log("Player ASID: " + asid));
 * @returns A unique identifier for the player. String is nullable.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getASIDAsync(): Promise<string> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "facebook") {
            return (window as any).wortalGame.player.getASIDAsync()
                .catch((e: any) => {
                    if (platform === "facebook") {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Player API not currently supported on platform: " + platform, "player.getASIDAsync");
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
 * @returns Object with player ASID and signature.
 * @see SignedASID
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getSignedASIDAsync(): Promise<SignedASID> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "facebook") {
            return (window as any).wortalGame.player.getSignedASIDAsync()
                .then((info: any) => {
                    return {
                        asid: info.getASID(),
                        signature: info.getSignature(),
                    };
                })
                .catch((e: any) => {
                    if (platform === "facebook") {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Player API not currently supported on platform: " + platform, "player.getSignedASIDAsync");
        }
    });
}

/**
 * Checks if the current user can subscribe to the game's bot.
 * @example
 * Wortal.player.canSubscribeBotAsync()
 * .then(canSubscribe => console.log("Can subscribe to bot: " + canSubscribe));
 * @returns Whether a player can subscribe to the game bot or not. Developer can only call subscribeBotAsync() after
 * checking canSubscribeBotAsync(), and the game will only be able to show the player their bot subscription
 * dialog once per week.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function canSubscribeBotAsync(): Promise<boolean> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "facebook") {
            return (window as any).wortalGame.player.canSubscribeBotAsync()
                .catch((e: any) => {
                    if (platform === "facebook") {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Player API not currently supported on platform: " + platform, "player.canSubscribeBotAsync");
        }
    });
}

/**
 * Request that the player subscribe the bot associated to the game. The API will reject if the subscription fails -
 * else, the player will subscribe the game bot.
 * @example
 * Wortal.player.subscribeBotAsync()
 * .then(() => console.log("Player subscribed to bot"));
 * @returns Promise that resolves when the player has subscribed to the game bot. Rejects if the player is unable to
 * subscribe to the game bot.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function subscribeBotAsync(): Promise<void> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "facebook") {
            return (window as any).wortalGame.player.subscribeBotAsync()
                .catch((e: any) => {
                    if (platform === "facebook") {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Player API not currently supported on platform: " + platform, "player.subscribeBotAsync");
        }
    });
}
