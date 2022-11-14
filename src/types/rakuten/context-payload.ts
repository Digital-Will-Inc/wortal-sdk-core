import { LocalizableContent } from "./localizable-content";
import { ContextFilterViber } from "./context-viber";

/**
 * Payload for various function calls in the context API.
 * @param {string} image URL of base64 encoded image to be displayed.
 * @param {string | LocalizableContent} text Message body.
 * @param {string | LocalizableContent} caption Text of the call-to-action button.
 * @param {Record<string, unknown>} data Object passed to any session launched from this context message.
 * Its size must be <=1000 chars when stringified.
 * It can be accessed from `Wortal.context.getEntryPointData()`.
 * @param {[ContextFilterViber]} filter An array of filters to be applied to the friend list. Only the first filter is currently used.
 * @param {number} maxSize Context maximum size.
 * @param {number} minSize Context minimum size.
 * @param {number} hoursSinceInvitation Specify how long a friend should be filtered out after the current player sends them a message.
 * This parameter only applies when `NEW_INVITATIONS_ONLY` filter is used.
 * When not specified, it will filter out any friend who has been sent a message.
 * @param {string | LocalizableContent} description Optional customizable text field in the share UI.
 * This can be used to describe the incentive a user can get from sharing.
 * @param {string | undefined} type Message format to be used. There's no visible difference among the available options.
 * 'INVITE' | 'REQUEST' | 'CHALLENGE' | 'SHARE'
 * @param {string | undefined} ui Optional property to switch share UI mode.
 * DEFAULT: Serial contact card with share and skip button.
 * MULTIPLE: Selectable contact list.
 * @param {number} minShare Defines the minimum number of players to be selected to start sharing.
 * @param {string | undefined} strategy Defines how the update message should be delivered.
 * 'IMMEDIATE': will be sent immediately.
 * 'LAST': when the game session ends, the latest payload will be sent.
 * 'IMMEDIATE_CLEAR': will be sent immediately, and also discard any pending `LAST` payloads in the same session.
 * @param {string | undefined} notifications Specifies if the message should trigger push notification. 'NO_PUSH' | 'PUSH'
 */
export interface ContextPayload {
    image?: string;
    text?: string | LocalizableContent;
    caption?: string | LocalizableContent;
    data?: Record<string, unknown>;
    filter?: [ContextFilterViber];
    maxSize?: number;
    minSize?: number;
    hoursSinceInvitation?: number;
    description?: string | LocalizableContent;
    type?: 'INVITE' | 'REQUEST' | 'CHALLENGE' | 'SHARE';
    ui?: 'DEFAULT' | 'MULTIPLE';
    minShare?: number;
    strategy?: 'IMMEDIATE' | 'LAST' | 'IMMEDIATE_CLEAR';
    notifications?: 'NO_PUSH' | 'PUSH';
    action?: "CUSTOM";
    template?: string;
}
