// Link
import { MessageOptionsLink } from "../types/link/message-options-link";
// Viber
import { ContextChoosePayloadViber } from "../types/viber/context-viber";
import { CustomUpdatePayloadViber } from "../types/viber/custom-update-payload-viber";
import { SharePayloadViber } from "../types/viber/share-payload-viber";
// SDK
import { ContextPayload } from "../types/context-payload";
import { ShareResult } from "../types/share-result";
import { sdk } from "./index";

/**
 * Gets the ID of the current context.
 * @returns String ID of the current context if one exists. Null if the player is playing solo. Empty string if the
 * game is being played on a platform that does not currently support context.
 */
export function getId(): string {
    if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
        return (window as any).wortalGame.context.getID();
    } else {
        console.log("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
        return "";
    }
}

/**
 * Gets the data bound to the entry point.
 * @returns Data about the entry point or an empty object if none exists.
 */
export function getEntryPointData(): Record<string, unknown> {
    if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
        return (window as any).wortalGame.getEntryPointData();
    } else {
        console.log("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
        return {};
    }
}

/**
 * Share messages to the player's friends.
 * @param payload Object defining the share message.
 * @returns Number of friends the message was shared with.
 */
export function shareAsync(payload: ContextPayload): Promise<number> {
    if (sdk.session.platform === "link") {
        return (window as any).wortalGame.shareAsync(convertToLinkMessagePayload(payload))
            .then((result: ShareResult) => console.log(result.sharedCount))
            .catch((error: any) => console.error(error));
    } else if (sdk.session.platform === "viber") {
        return (window as any).wortalGame.shareAsync(convertToViberSharePayload(payload))
            .then((result: ShareResult) => console.log(result.sharedCount))
            .catch((error: any) => console.error(error));
    } else {
        console.log("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
        return Promise.reject("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
    }
}

/**
 * Posts an update to the current context.
 * @param payload Object defining the update message.
 */
export function updateAsync(payload: ContextPayload): Promise<void> {
    if (sdk.session.platform === "link") {
        return (window as any).wortalGame.updateAsync(convertToLinkMessagePayload(payload))
            .catch((error: any) => console.error(error));
    } else if (sdk.session.platform === "viber") {
        return (window as any).wortalGame.updateAsync(convertToViberUpdatePayload(payload))
            .catch((error: any) => console.error(error));
    } else {
        console.log("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
        return Promise.reject("[Wortal] Share not currently supported on platform: " + sdk.session.platform);
    }
}

/**
 * Opens the platform UI to select friends to invite and play with.
 * @param payload Object defining the options for the context choice.
 */
export function chooseAsync(payload: ContextPayload): Promise<void> {
    if (sdk.session.platform === "link") {
        return (window as any).wortalGame.context.chooseAsync(convertToLinkMessagePayload(payload))
            .then(() => console.log((window as any).wortalGame.context.getID()))
            .catch((error: any) => console.error(error));
    } else if (sdk.session.platform === "viber") {
        return (window as any).wortalGame.context.chooseAsync(convertToViberChoosePayload(payload))
            .then(() => console.log((window as any).wortalGame.context.getID()))
            .catch((error: any) => console.error(error));
    } else {
        console.log("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
        return Promise.reject("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
    }
}

/**
 * Switches the current context to the context with the given ID.
 * @param contextId ID of the context to switch to.
 */
export function switchAsync(contextId: string): Promise<void> {
    //TODO: add options
    if (contextId === null || contextId === "") {
        return Promise.reject("[Wortal] Empty ID passed to switchGroupAsync().");
    }
    if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
        return (window as any).wortalGame.context.switchAsync(contextId)
            .then(() => console.log((window as any).wortalGame.context.getID()))
            .catch((error: any) => console.error(error));
    } else {
        console.log("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
        return Promise.reject("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
    }
}

/**
 * Creates a context with the given player ID.
 * @param playerId ID of player to create a context with.
 */
export function createAsync(playerId: string): Promise<void> {
    //TODO: add options
    if (playerId === null || playerId === "") {
        return Promise.reject("[Wortal] Empty ID passed to createGroupAsync().");
    }
    if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
        return (window as any).wortalGame.context.createAsync(playerId)
            .then(() => console.log((window as any).wortalGame.context.getID()))
            .catch((error: any) => console.error(error));
    } else {
        console.log("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
        return Promise.reject("[Wortal] Context not currently supported on platform: " + sdk.session.platform);
    }
}

function convertToLinkMessagePayload(payload: ContextPayload): MessageOptionsLink {
    return {
        image: payload.image,
        text: payload.text,
        caption: payload.caption,
        data: payload.data,
    }
}

function convertToViberChoosePayload(payload: ContextPayload): ContextChoosePayloadViber {
    return {
        filters: payload.filter,
        maxSize: payload.maxSize,
        minSize: payload.minSize,
        hoursSinceInvitation: payload.hoursSinceInvitation,
        description: payload.description,
    }
}

function convertToViberSharePayload(payload: ContextPayload): SharePayloadViber {
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
        playerIds: [],
    }
}

function convertToViberUpdatePayload(payload: ContextPayload): CustomUpdatePayloadViber {
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
