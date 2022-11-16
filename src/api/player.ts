import ConnectedPlayer from "../models/connected-player";
import { ConnectedPlayerPayload, PlayerData } from "../types/player";
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
 */
export function getDataAsync(keys: string[]): Promise<any> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.player.getDataAsync(keys)
            .then((data: any) => {
                return data;
            })
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Platform data not currently supported on platform: " + config.session.platform);
    }
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
 */
export function setDataAsync(data: Record<string, unknown>): Promise<void> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.player.setDataAsync(data)
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Platform data not currently supported on platform: " + config.session.platform);
    }
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
 */
export function getConnectedPlayersAsync(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.player.getConnectedPlayersAsync(payload)
            .then((players: any) => {
                 return players.map((player:any) => {
                    let playerData: PlayerData = {
                        id: player.getID(),
                        name: player.getName(),
                        photo: player.getPhoto(),
                        isFirstPlay: !player.hasPlayed,
                        daysSinceFirstPlay: 0,
                    };
                    return new ConnectedPlayer(playerData);
                });
            })
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Connected players not currently supported on platform: " + config.session.platform);
    }
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
 */
export function getSignedPlayerInfoAsync(): Promise<object> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.player.getSignedPlayerInfoAsync()
            .then((info: any) => {
                return {
                    id: info.getPlayerID(),
                    signature: info.getSignature(),
                };
            })
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Platform data not currently supported on platform: " + config.session.platform);
    }
}
