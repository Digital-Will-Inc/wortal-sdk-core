import { ContextPayload } from "../types/context-payload";
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
 * Shares a message to the player's friends. Will trigger a UI for the player to choose which friends to share with.
 * @example
 * Wortal.context.shareAsync({
 *     image: 'data:base64Image',
 *     text: 'Share text',
 *     caption: 'Play',
 *     data: { exampleData: 'yourData' },
 * }).then(result => console.log(result); // Contains shareCount with number of friends the share was sent to.
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
