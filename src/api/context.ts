import { ContextPayload } from "../types/context-payload";
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
 * Wortal.context.shareAsync('Share text', 'https://link.to.img', {
 *         caption: 'Play',
 *         data: { exampleData: 'yourData' },
 *     }).then(result => console.log(result); // Contains shareCount with number of friends the share was sent to.
 * @param text Message body of the share.
 * @param image URL to the base64 image to include with this share.
 * @param payload Object defining the share message.
 * @returns Number of friends the message was shared with.
 */
export function shareAsync(text: string, image: string, payload?: ContextPayload): Promise<number> {
    if (!isValidString(text) || !isValidString(image)) {
        return Promise.reject("[Wortal] shareAsync() was passed invalid parameters. Text and image cannot be null or empty.");
    }

    if (config.session.platform === "link") {
        return (window as any).wortalGame.shareAsync(convertToLinkMessagePayload(text, image, payload))
            .then((result: any) => {
                return result.sharedCount;
            })
            .catch((error: any) => console.error(error));
    } else if (config.session.platform === "viber") {
        return (window as any).wortalGame.shareAsync(convertToViberSharePayload(text, image, payload))
            .then((result: any) => {
                return result.sharedCount;
            })
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Context not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Posts an update to the current context. Will send a message to the chat thread of the current context.
 * @example
 * Wortal.context.updateAsync('Update text', 'https://link.to.img', {
 *         caption: 'Play',
 *         data: { exampleData: 'yourData' },
 *     });
 * @param text Message body of the share.
 * @param image URL to the base64 image to include with this share.
 * @param payload Object defining the update message.
 */
export function updateAsync(text: string, image: string, payload?: ContextPayload): Promise<void> {
    if (!isValidString(text) || !isValidString(image)) {
        return Promise.reject("[Wortal] updateAsync() was passed invalid parameters. Text and image cannot be null or empty.");
    }

    if (config.session.platform === "link") {
        return (window as any).wortalGame.updateAsync(convertToLinkMessagePayload(text, image, payload))
            .catch((error: any) => console.error(error));
    } else if (config.session.platform === "viber") {
        return (window as any).wortalGame.updateAsync(convertToViberUpdatePayload(text, image, payload))
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Share not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Opens the platform UI to select friends to invite and play with.
 * @example
 * Wortal.context.chooseAsync('Invite text', 'https://link.to.img', {
 *         caption: 'Play',
 *         data: { exampleData: 'yourData' },
 *     })
 * @param text Message body of the share.
 * @param image URL to the base64 image to include with this share.
 * @param payload Object defining the options for the context choice.
 */
export function chooseAsync(text: string, image: string, payload?: ContextPayload): Promise<void> {
    if (!isValidString(text) || !isValidString(image)) {
        return Promise.reject("[Wortal] chooseAsync() was passed invalid parameters. Text and image cannot be null or empty.");
    }

    if (config.session.platform === "link") {
        return (window as any).wortalGame.context.chooseAsync(convertToLinkMessagePayload(text, image, payload))
            .catch((error: any) => console.error(error));
    } else if (config.session.platform === "viber") {
        return (window as any).wortalGame.context.chooseAsync(convertToViberChoosePayload(payload))
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Context not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Switches the current context to the context with the given ID.
 * @example
 * Wortal.context.switchAsync('abc123');
 * @param contextId ID of the context to switch to.
 */
export function switchAsync(contextId: string): Promise<void> {
    //TODO: add options
    if (!isValidString(contextId)) {
        return Promise.reject("[Wortal] Invalid or empty ID passed to switchAsync().");
    }

    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.context.switchAsync(contextId)
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Context not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Creates a context with the given player ID.
 * @example
 * Wortal.context.createAsync('player123');
 * @param playerId ID of player to create a context with.
 */
export function createAsync(playerId: string): Promise<void> {
    //TODO: add options
    if (!isValidString(playerId)) {
        return Promise.reject("[Wortal] Invalid or empty ID passed to createAsync().");
    }

    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.context.createAsync(playerId)
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Context not currently supported on platform: " + config.session.platform);
    }
}

function convertToLinkMessagePayload(text: string, image: string, payload?: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: image,
        text: text,
    }
    if (payload?.cta) obj.caption = payload.cta;
    if (payload?.caption) obj.caption = payload.caption;
    if (payload?.data) obj.data = payload.data;
    return obj;
}

function convertToViberChoosePayload(payload?: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        // Not used in this payload.
        image: "",
        text: "",
    }
    if (payload?.filters) obj.filters = payload.filters;
    if (payload?.maxSize) obj.maxSize = payload.maxSize;
    if (payload?.minSize) obj.minSize = payload.minSize;
    if (payload?.hoursSinceInvitation) obj.hoursSinceInvitation = payload.hoursSinceInvitation;
    if (payload?.description) obj.description = payload.description;
    return obj;
}

function convertToViberSharePayload(text: string, image: string, payload?: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: image,
        text: text,
    }
    if (payload?.data) obj.data = payload.data;
    if (payload?.filters) obj.filters = payload.filters;
    if (payload?.hoursSinceInvitation) obj.hoursSinceInvitation = payload.hoursSinceInvitation;
    if (payload?.minShare) obj.minShare = payload.minShare;
    if (payload?.description) obj.description = payload.description;
    if (payload?.ui) obj.ui = payload.ui;
    if (payload?.cta) obj.cta = payload.cta;
    if (payload?.caption) obj.cta = payload.caption;
    if (payload?.intent) obj.intent = payload.intent
    else obj.intent = 'REQUEST';
    return obj;
}

function convertToViberUpdatePayload(text: string, image: string, payload?: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: image,
        text: text,
    }
    if (payload?.cta) obj.cta = payload.cta;
    if (payload?.caption) obj.cta = payload.caption;
    if (payload?.data) obj.data = payload.data;
    if (payload?.strategy) obj.strategy = payload.strategy;
    if (payload?.notifications) obj.notifications = payload.notifications;
    if (payload?.action) obj.action = payload.action;
    else obj.action = "CUSTOM";
    if (payload?.template) obj.template = payload.template;
    else obj.template = "";
    return obj;
}

function isValidString(obj: any): boolean {
    return (typeof obj === "string" && obj !== "");
}
