import ConnectedPlayer from "../models/connected-player";
import { ContextPayload, ContextSizeResponse, ContextType } from "../types/context";
import { PlayerData } from "../types/player";
import {
    contextToFBInstantChoosePayload,
    contextToFBInstantSharePayload,
    contextToFBInstantUpdatePayload,
    contextToLinkMessagePayload,
    contextToViberChoosePayload,
    contextToViberSharePayload,
    contextToViberUpdatePayload
} from "../utils/converters";
import { invalidParams, notSupported, rethrowRakuten } from "../utils/error-handler";
import { isValidPayloadImage, isValidPayloadText, isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Gets the ID of the current context.
 * @example
 * let id = Wortal.context.getId();
 * console.log(id);
 * @returns String ID of the current context if one exists. Null if the player is playing solo. Empty string if the
 * game is being played on a platform that does not currently support context.
 */
export function getId(): string {
    let platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return (window as any).wortalGame.context.getID();
    } else {
        return "";
    }
}

/**
 * Gets the type of the current context.
 * @example
 * let type = Wortal.context.getType();
 * console.log(type);
 * @returns The type of the current context. Possible values are: "SOLO", "THREAD", "GROUP", "POST". Default is "SOLO"
 */
export function getType(): ContextType {
    let platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return (window as any).wortalGame.context.getType();
    } else {
        return "SOLO";
    }
}

/**
 * Gets the players in the current context.
 * @example
 * Wortal.context.getPlayersAsync()
 *  .then(players => {
 *    console.log(players.length);
 *    console.log(players[0].id);
 *    console.log(players[0].name);
 *    });
 * @returns Array of players in the current context.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function getPlayersAsync(): Promise<ConnectedPlayer[]> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.context.getPlayersAsync()
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
                        throw rethrowRakuten(e, "context.getPlayersAsync");
                    } else {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Context API not currently supported on platform: " + platform, "context.getPlayersAsync");
        }
    });
}

/**
 * Shares a message to the player's friends. Will trigger a UI for the player to choose which friends to share with.
 * @example
 * Wortal.context.shareAsync({
 *     image: 'data:base64Image',
 *     text: 'Share text',
 *     caption: 'Play',
 *     data: { exampleData: 'yourData' },
 * }).then(result => console.log(result)); // Contains shareCount with number of friends the share was sent to.
 * @param payload Object defining the share message.
 * @returns Number of friends the message was shared with.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function shareAsync(payload: ContextPayload): Promise<number> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        // Validate
        if (!isValidPayloadText(payload.text)) {
            throw invalidParams("Text cannot be null or empty.", "context.shareAsync");
        } else if (!isValidPayloadImage(payload.image)) {
            throw invalidParams("Image needs to be a data URL for a base64 encoded image.", "context.shareAsync");
        }

        // Convert
        let convertedPayload: ContextPayload;
        if (platform === "link") {
            convertedPayload = contextToLinkMessagePayload(payload);
        } else if (platform === "viber") {
            convertedPayload = contextToViberSharePayload(payload);
        } else if (platform === "facebook") {
            convertedPayload = contextToFBInstantSharePayload(payload);
        } else {
            throw notSupported("Context API not currently supported on platform: " + platform, "context.shareAsync");
        }

        // Call
        return (window as any).wortalGame.shareAsync(convertedPayload)
            .then((result: any) => {
                return result.sharedCount;
            })
            .catch((e: any) => {
                if (platform === "link" || platform === "viber") {
                    throw rethrowRakuten(e, "context.shareAsync");
                } else {
                    throw Error(e);
                }
            });
    });
}

/**
 * This invokes a dialog that contains a custom game link that users can copy to their clipboard, or share.
 * A blob of data can be attached to the custom link - game sessions initiated from the link will be able to access the
 * data through FBInstant.getEntryPointData(). This data should be less than or equal to 1000 characters when
 * stringified. The provided text and image will be used to generate the link preview, with the game name as the title
 * of the preview. The text is recommended to be less than 44 characters. The image is recommended to either be a square
 * or of the aspect ratio 1.91:1. The returned promise will resolve when the dialog is closed regardless if the user
 * actually shared the link or not.
 * @example
 * Wortal.context.shareLinkAsync({
 *    image: 'data:base64Image',
 *    text: 'Share text',
 *    data: { exampleData: 'yourData' },
 * })
 * .then(() => resumeGame);
 * @param payload Object defining the payload for the custom link.
 */
export function shareLinkAsync(payload: ContextPayload) : Promise<void> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        // Validate
        if (!isValidPayloadText(payload.text)) {
            throw invalidParams("Text cannot be null or empty.", "context.shareLinkAsync");
        } else if (!isValidPayloadImage(payload.image)) {
            throw invalidParams("Image needs to be a data URL for a base64 encoded image.", "context.shareLinkAsync");
        }

        // Convert
        let convertedPayload: ContextPayload;
        if (platform === "facebook") {
            convertedPayload = contextToFBInstantSharePayload(payload);
        } else {
            throw notSupported("Context API not currently supported on platform: " + platform, "context.shareLinkAsync");
        }

        // Call
        return (window as any).wortalGame.shareLinkAsync(convertedPayload)
            .catch((e: any) => {
                if (platform === "facebook") {
                    throw Error(e);
                }
            });
    });
}

/**
 * Posts an update to the current context. Will send a message to the chat thread of the current context.
 * @example
 * Wortal.context.updateAsync({
 *     image: 'data:base64Image',
 *     text: 'Update text',
 *     caption: 'Play',
 *     data: { exampleData: 'yourData' },
 * });
 * @param payload Object defining the update message.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function updateAsync(payload: ContextPayload): Promise<void> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        // Validate
        if (!isValidPayloadText(payload.text)) {
            throw invalidParams("Text cannot be null or empty.", "context.updateAsync");
        } else if (!isValidPayloadImage(payload.image)) {
            throw invalidParams("Image needs to be a data URL for a base64 encoded image.", "context.updateAsync");
        }

        // Convert
        let convertedPayload: ContextPayload;
        if (platform === "link") {
            convertedPayload = contextToLinkMessagePayload(payload);
        } else if (platform === "viber") {
            convertedPayload = contextToViberUpdatePayload(payload);
        } else if (platform === "facebook") {
            convertedPayload = contextToFBInstantUpdatePayload(payload);
        } else {
            throw notSupported("Context API not currently supported on platform: " + platform, "context.updateAsync");
        }

        // Call
        return (window as any).wortalGame.updateAsync(convertedPayload)
            .catch((e: any) => {
                if (platform === "link" || platform === "viber") {
                    throw rethrowRakuten(e, "context.updateAsync");
                } else {
                    throw Error(e);
                }
            });
    });
}

/**
 * Opens the platform UI to select friends to invite and play with.
 * @example
 * Wortal.context.chooseAsync({
 *     image: 'data:base64Image',
 *     text: 'Invite text',
 *     caption: 'Play',
 *     data: { exampleData: 'yourData' },
 * });
 * @param payload Object defining the options for the context choice.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function chooseAsync(payload: ContextPayload): Promise<void> {
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        // Validate
        if (!isValidPayloadText(payload.text)) {
            throw invalidParams("Text cannot be null or empty.", "context.chooseAsync");
        } else if (!isValidPayloadImage(payload.image)) {
            throw invalidParams("Image needs to be a data URL for a base64 encoded image.", "context.chooseAsync");
        }

        // Convert
        let convertedPayload: ContextPayload;
        if (platform === "link") {
            convertedPayload = contextToLinkMessagePayload(payload);
        } else if (platform === "viber") {
            convertedPayload = contextToViberChoosePayload(payload);
        } else if (platform === "facebook") {
            convertedPayload = contextToFBInstantChoosePayload(payload);
        } else {
            throw notSupported("Context API not currently supported on platform: " + platform, "context.chooseAsync");
        }

        // Call
        return (window as any).wortalGame.context.chooseAsync(convertedPayload)
            .catch((e: any) => {
                if (platform === "link" || platform === "viber") {
                    throw rethrowRakuten(e, "context.chooseAsync");
                } else {
                    throw Error(e);
                }
            });
    });
}

/**
 * Switches the current context to the context with the given ID.
 * @example
 * Wortal.context.switchAsync('abc123');
 * @param contextId ID of the context to switch to.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function switchAsync(contextId: string): Promise<void> {
    //TODO: add options
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(contextId)) {
            throw invalidParams("contextId cannot be null or empty.", "context.switchAsync");
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.context.switchAsync(contextId)
                .catch((e: any) => {
                    if (platform === "link" || platform === "viber") {
                        throw rethrowRakuten(e, "context.switchAsync");
                    } else {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Context API not currently supported on platform: " + platform, "context.switchAsync");
        }
    });
}

/**
 * Creates a context with the given player ID.
 * @example
 * Wortal.context.createAsync('player123');
 * @param playerId ID of player to create a context with.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>NOT_SUPPORTED</li>
 * <li>RETHROW_FROM_PLATFORM</li>
 * </ul>
 */
export function createAsync(playerId: string): Promise<void> {
    //TODO: add options
    let platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(playerId)) {
            throw invalidParams("playerId cannot be null or empty.", "context.createAsync");
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.context.createAsync(playerId)
                .catch((e: any) => {
                    if (platform === "link" || platform === "viber") {
                        throw rethrowRakuten(e, "context.createAsync");
                    } else {
                        throw Error(e);
                    }
                });
        } else {
            throw notSupported("Context API not currently supported on platform: " + platform, "context.createAsync");
        }
    });
}

/**
 * Check if the count of players in context is between given numbers.
 * @example
 * let result = Wortal.context.isSizeBetween(2, 4);
 * console.log(result.answer);
 * @param min Minimum number of players in context.
 * @param max Maximum number of players in context.
 * @returns {ContextSizeResponse} Object with the result of the check. Null if not supported.
 */
export function isSizeBetween(min?: number, max?: number): ContextSizeResponse | null {
    let platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return (window as any).wortalGame.context.isSizeBetween(min, max);
    } else {
        return null;
    }
}
