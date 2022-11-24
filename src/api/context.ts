import { ContextPayload } from "../types/context-payload";
import {
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
    if (config.session.platform === "link" || config.session.platform === "viber") {
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
 */
export function shareAsync(payload: ContextPayload): Promise<number> {
    return Promise.resolve().then(() => {
        if (!isValidPayloadText(payload.text)) {
            throw invalidParams("Text cannot be null or empty.", "context.shareAsync");
        } else if (!isValidPayloadImage(payload.image)) {
            throw invalidParams("Image needs to be a data URL for a base64 encoded image.", "context.shareAsync");
        }

        if (config.session.platform === "link") {
            return (window as any).wortalGame.shareAsync(contextToLinkMessagePayload(payload))
                .then((result: any) => {
                    return result.sharedCount;
                })
                .catch((e: any) => {
                    throw rethrowRakuten(e, "context.shareAsync");
                });
        } else if (config.session.platform === "viber") {
            return (window as any).wortalGame.shareAsync(contextToViberSharePayload(payload))
                .then((result: any) => {
                    return result.sharedCount;
                })
                .catch((e: any) => {
                    throw rethrowRakuten(e, "context.shareAsync");
                });
        } else {
            throw notSupported("Context API not currently supported on platform: " + config.session.platform, "context.shareAsync");
        }
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
 */
export function updateAsync(payload: ContextPayload): Promise<void> {
    return Promise.resolve().then(() => {
        if (!isValidPayloadText(payload.text)) {
            throw invalidParams("Text cannot be null or empty.", "context.updateAsync");
        } else if (!isValidPayloadImage(payload.image)) {
            throw invalidParams("Image needs to be a data URL for a base64 encoded image.", "context.updateAsync");
        }

        if (config.session.platform === "link") {
            return (window as any).wortalGame.updateAsync(contextToLinkMessagePayload(payload))
                .catch((e: any) => {
                    throw rethrowRakuten(e, "context.updateAsync");
                });
        } else if (config.session.platform === "viber") {
            return (window as any).wortalGame.updateAsync(contextToViberUpdatePayload(payload))
                .catch((e: any) => {
                    throw rethrowRakuten(e, "context.updateAsync");
                });
        } else {
            throw notSupported("Context API not currently supported on platform: " + config.session.platform, "context.updateAsync");
        }
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
 */
export function chooseAsync(payload: ContextPayload): Promise<void> {
    return Promise.resolve().then(() => {
        if (!isValidPayloadText(payload.text)) {
            throw invalidParams('Text cannot be null or empty.', 'context.chooseAsync');
        } else if (!isValidPayloadImage(payload.image)) {
            throw invalidParams('Image needs to be a data URL for a base64 encoded image.', 'context.chooseAsync');
        }

        if (config.session.platform === "link") {
            return (window as any).wortalGame.context.chooseAsync(contextToLinkMessagePayload(payload))
                .catch((e: any) => {
                    throw rethrowRakuten(e, "context.chooseAsync");
                });
        } else if (config.session.platform === "viber") {
            return (window as any).wortalGame.context.chooseAsync(contextToViberChoosePayload(payload))
                .catch((e: any) => {
                    throw rethrowRakuten(e, "context.chooseAsync");
                });
        } else {
            throw notSupported("Context API not currently supported on platform: " + config.session.platform, "context.chooseAsync");
        }
    });
}

/**
 * Switches the current context to the context with the given ID.
 * @example
 * Wortal.context.switchAsync('abc123');
 * @param contextId ID of the context to switch to.
 */
export function switchAsync(contextId: string): Promise<void> {
    //TODO: add options
    return Promise.resolve().then(() => {
        if (!isValidString(contextId)) {
            throw invalidParams("contextId cannot be null or empty.", "context.switchAsync");
        }

        if (config.session.platform === "link" || config.session.platform === "viber") {
            return (window as any).wortalGame.context.switchAsync(contextId)
                .catch((e: any) => {
                    throw rethrowRakuten(e, "context.switchAsync");
                });
        } else {
            throw notSupported("Context API not currently supported on platform: " + config.session.platform, "context.switchAsync");
        }
    });
}

/**
 * Creates a context with the given player ID.
 * @example
 * Wortal.context.createAsync('player123');
 * @param playerId ID of player to create a context with.
 */
export function createAsync(playerId: string): Promise<void> {
    //TODO: add options
    return Promise.resolve().then(() => {
        if (!isValidString(playerId)) {
            throw invalidParams("playerId cannot be null or empty.", "context.createAsync");
        }

        if (config.session.platform === "link" || config.session.platform === "viber") {
            return (window as any).wortalGame.context.createAsync(playerId)
                .catch((e: any) => {
                    throw rethrowRakuten(e, "context.createAsync");
                });
        } else {
            throw notSupported("Context API not currently supported on platform: " + config.session.platform, "context.createAsync");
        }
    });
}
