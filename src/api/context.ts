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
 * Gets the data bound to the entry point.
 * @example
 * let data = Wortal.context.getEntryPointData();
 * console.log(data.property);
 * @returns Data about the entry point or an empty object if none exists.
 */
export function getEntryPointData(): Record<string, unknown> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.getEntryPointData();
    } else {
        return {};
    }
}

/**
 * Shares a message to the player's friends. Will trigger a UI for the player to choose which friends to share with.
 * @example
 * Wortal.context.shareAsync({
 *     image: 'https://link.to.img',
 *     text: 'Share text',
 *     caption: 'Play',
 *     data: { exampleData: 'yourData' },
 * }).then(result => console.log(result); // Contains shareCount with number of friends the share was sent to.
 * @param payload Object defining the share message.
 * @returns Number of friends the message was shared with.
 */
export function shareAsync(payload: ContextPayload): Promise<number> {
    if (config.session.platform === "link") {
        return (window as any).wortalGame.shareAsync(convertToLinkMessagePayload(payload))
            .then((result: any) => {
                return result.sharedCount;
            })
            .catch((error: any) => console.error(error));
    } else if (config.session.platform === "viber") {
        return (window as any).wortalGame.shareAsync(convertToViberSharePayload(payload))
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
 * Wortal.context.updateAsync({
 *     image: 'https://link.to.img',
 *     text: 'Update text',
 *     caption: 'Play',
 *     data: { exampleData: 'yourData' },
 * });
 * @param payload Object defining the update message.
 */
export function updateAsync(payload: ContextPayload): Promise<void> {
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
 *    image: 'https://link.to.img',
 *    text: 'Invite text',
 *    caption: 'Play',
 *    data: { exampleData: 'yourData' },
 * });
 * @param payload Object defining the options for the context choice.
 */
export function chooseAsync(payload: ContextPayload): Promise<void> {
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
    if (contextId === null || contextId === "") {
        return Promise.reject("[Wortal] Empty ID passed to switchAsync().");
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
    if (playerId === null || playerId === "") {
        return Promise.reject("[Wortal] Empty ID passed to createAsync().");
    }

    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.context.createAsync(playerId)
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Context not currently supported on platform: " + config.session.platform);
    }
}

function convertToLinkMessagePayload(payload: ContextPayload): object {
    return {
        image: payload.image,
        text: payload.text,
        caption: payload.caption,
        data: payload.data,
    }
}

function convertToViberChoosePayload(payload: ContextPayload): object {
    return {
        filters: payload.filter,
        maxSize: payload.maxSize,
        minSize: payload.minSize,
        hoursSinceInvitation: payload.hoursSinceInvitation,
        description: payload.description,
    }
}

function convertToViberSharePayload(payload: ContextPayload): object {
    return {
        intent: payload.type ?? "SHARE",
        image: payload.image ?? "",
        text: payload.text ?? "",
        data: payload.data,
        filters: payload.filter,
        hoursSinceInvitation: payload.hoursSinceInvitation,
        minShare: payload.minShare,
        description: payload.description,
        ui: payload.ui,
        cta: payload.caption,
    }
}

function convertToViberUpdatePayload(payload: ContextPayload): object {
    return {
        action: payload.action ?? "CUSTOM",
        template: payload.template ?? "",
        cta: payload.caption,
        image: payload.image ?? "",
        text: payload.text ?? "",
        data: payload.data,
        strategy: payload.strategy,
        notification: payload.notifications,
    }
}
