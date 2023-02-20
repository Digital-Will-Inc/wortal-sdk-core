import ConnectedPlayer from "../models/connected-player";
import { ConnectedPlayerPayload, PlayerData } from "../types/player";
import { invalidParams, notSupported, rethrowRakuten } from "../utils/error-handler";
import { config } from "./index";

/**
 * Gets the player's ID from the platform.
 * @returns The player's ID.
 */
export function getID(): string {
    return config.player.id;
}

/**
 * Gets the player's name on the platform.
 * @returns The player's name.
 */
export function getName(): string {
    return config.player.name;
}

/**
 * Gets the player's photo from the platform.
 * @returns URL of base64 image for the player's photo.
 */
export function getPhoto(): string {
    return config.player.photo;
}

/**
 * Checks whether this is the first time the player has played this game.
 * @returns True if it is the first play. Some platforms always return true.
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
 *  @returns Object with player ID and signature.
 *  @see Signature
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
