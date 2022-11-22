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
    if (!isValidPayloadText(payload.text) || !isValidPayloadImage(payload.image)) {
        return Promise.reject("[Wortal] shareAsync() was passed invalid parameters. Text and image cannot be null or empty.");
    }

    if (config.session.platform === "link") {
        return (window as any).wortalGame.shareAsync(convertToLinkMessagePayload(payload))
            .then((result: any) => { return result.sharedCount; })
            .catch((error: any) => console.error(error));
    } else if (config.session.platform === "viber") {
        return (window as any).wortalGame.shareAsync(convertToViberSharePayload(payload))
            .then((result: any) => { return result.sharedCount; })
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Context not currently supported on platform: " + config.session.platform);
    }
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
    if (!isValidPayloadText(payload.text) || !isValidPayloadImage(payload.image)) {
        return Promise.reject("[Wortal] updateAsync() was passed invalid parameters. Text and image cannot be null or empty.");
    }

    if (config.session.platform === "link") {
        return (window as any).wortalGame.updateAsync(convertToLinkMessagePayload(payload))
            .catch((error: any) => console.error(error));
    } else if (config.session.platform === "viber") {
        return (window as any).wortalGame.updateAsync(convertToViberUpdatePayload(payload))
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Share not currently supported on platform: " + config.session.platform);
    }
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
    if (!isValidPayloadText(payload.text) || !isValidPayloadImage(payload.image)) {
        return Promise.reject("[Wortal] chooseAsync() was passed invalid parameters. Text and image cannot be null or empty.");
    }

    if (config.session.platform === "link") {
        return (window as any).wortalGame.context.chooseAsync(convertToLinkMessagePayload(payload))
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

function convertToLinkMessagePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.cta) obj.caption = payload.cta;
    if (payload?.caption) obj.caption = payload.caption;
    if (payload?.data) obj.data = payload.data;
    return obj;
}

function convertToViberChoosePayload(payload: ContextPayload): ContextPayload {
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

function convertToViberSharePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
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

function convertToViberUpdatePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
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

function isValidPayloadText(obj: any): boolean {
    if (typeof obj === "string" && obj !== "") {
        return true;
    } else if (typeof obj === "object") {
        if (typeof obj.default === "string" && obj.default !== "") {
            return true;
        }
    }
    return false;
}

function isValidPayloadImage(obj: any): boolean {
    if (typeof obj === "string" && obj !== "") {
        if (obj.startsWith("data:")) {
            return true;
        }
    }
    return false;
}
