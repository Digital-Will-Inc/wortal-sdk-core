import { LocalizableContent } from "./localizable-content";
import { ContextFilterViber } from "./context-viber";

/**
 * Payload for various function calls in the context API.
 */
export interface ContextPayload {
    /** URL of base64 encoded image to be displayed. This is required for the payload to be sent. */
    image: string;
    /** Message body. This is required for the payload to be sent. */
    text: string | LocalizableContent;
    /** Text of the call-to-action button. */
    caption?: string | LocalizableContent;
    /** Object passed to any session launched from this context message.
     *  Its size must be <=1000 chars when stringified.
     *  It can be accessed from `Wortal.context.getEntryPointData()`.
     */
    data?: Record<string, unknown>;
    /** An array of filters to be applied to the friend list. Only the first filter is currently used. */
    filter?: [ContextFilterViber];
    /** Context maximum size. */
    maxSize?: number;
    /** Context minimum size. */
    minSize?: number;
    /** Specify how long a friend should be filtered out after the current player sends them a message.
     * This parameter only applies when `NEW_INVITATIONS_ONLY` filter is used.
     * When not specified, it will filter out any friend who has been sent a message.
     */
    hoursSinceInvitation?: number;
    /** Optional customizable text field in the share UI.
     * This can be used to describe the incentive a user can get from sharing.
     */
    description?: string | LocalizableContent;
    /** Message format to be used. There's no visible difference among the available options. */
    type?: 'INVITE' | 'REQUEST' | 'CHALLENGE' | 'SHARE';
    /** Optional property to switch share UI mode.
     * DEFAULT: Serial contact card with share and skip button.
     * MULTIPLE: Selectable contact list.
     */
    ui?: 'DEFAULT' | 'MULTIPLE';
    /** Defines the minimum number of players to be selected to start sharing. */
    minShare?: number;
    /** Defines how the update message should be delivered.
     * 'IMMEDIATE': will be sent immediately.
     * 'LAST': when the game session ends, the latest payload will be sent.
     * 'IMMEDIATE_CLEAR': will be sent immediately, and also discard any pending `LAST` payloads in the same session.
     */
    strategy?: 'IMMEDIATE' | 'LAST' | 'IMMEDIATE_CLEAR';
    /** Specifies if the message should trigger push notification. */
    notifications?: 'NO_PUSH' | 'PUSH';
    /** Not used */
    action?: 'CUSTOM';
    /** Not used */
    template?: string;
}
