import { LocalizableContent } from "./localizable-content";

/**
 * Defines the filtering behavior
 *
 * - `NEW_CONTEXT_ONLY` only enlists contexts that the current player is in, but never participated in (e.g. a new context created by a friend).
 * - `INCLUDE_EXISTING_CHALLENGES` enlists contexts that the current player has participated before.
 * - `NEW_PLAYERS_ONLY` only enlists friends who haven't played this game before.
 * - `NEW_INVITATIONS_ONLY` only enlists friends who haven't been sent an in-game message before. This filter can be fine-tuned with `hoursSinceInvitation` parameter.
 */
export type ContextFilter = 'NEW_CONTEXT_ONLY'
    | 'INCLUDE_EXISTING_CHALLENGES'
    | 'NEW_PLAYERS_ONLY'
    | 'NEW_INVITATIONS_ONLY';

/**
 * A filter that may be applied to an inviteAsync operation. If no results are returned with the filters, then the filters will not be applied.
 *
 * - 'NEW_CONTEXT_ONLY' - Prefer to only surface contexts the game has not been played in before. This can include players who have not played the game before.
 * - 'NEW_PLAYERS_ONLY' - Prefer to only surface people who have not played the game before.
 * - 'EXISTING_CONTEXT_ONLY' - Prefer to only surface contexts the game has been played in before.
 * - 'EXISTING_PLAYERS_ONLY' - Prefer to only surface people who have played the game before.
 */
export type InviteFilter = 'NEW_CONTEXT_ONLY'
    | 'NEW_PLAYERS_ONLY'
    | 'EXISTING_CONTEXT_ONLY'
    | 'EXISTING_PLAYERS_ONLY';

/**
 * The type of the current game context.
 *
 * - `SOLO` - Default context, where the player is the only participant.
 * - `THREAD` - A chat thread.
 * - `POST` - A Facebook post - FB only
 * - `GROUP` - A Facebook group - FB only.
 */
export type ContextType = 'SOLO' | 'THREAD' | 'GROUP' | 'POST';

/**
 * A parameter that may be applied to a shareAsync operation. This set up sharing destination in the share dialog.
 * - 'NEWSFEED' - Enable share to newsfeed option
 * - 'GROUP' - Enable share to official game group option. This is only available for games with official game group. To set up official game group, add a page in the game app setting in https://www.developers.facebook.com, and then create a group for the page in https://facebook.com.
 * - 'COPY_LINK' - Enable copy the game link in clipboard
 * - 'MESSENGER' - Enable share game to messenger option
 */
export type ShareDestination = 'NEWSFEED' | 'GROUP' | 'COPY_LINK' | 'MESSENGER';

/**
 * Response from context.isSizeBetween API. Contains the answer and the min and max size.
 */
export interface ContextSizeResponse {
    answer: boolean,
    maxSize: number,
    minSize: number,
}

/**
 * @deprecated Starting in v1.5.0 this is no longer supported. Use the specific payloads for each API instead.
 */
export interface ContextPayload {
    /**
     * URL of base64 encoded image to be displayed. This is required for the payload to be sent.
     */
    image: string;
    /**
     * Message body. This is required for the payload to be sent.
     */
    text: string | LocalizableContent;
    /**
     * Text of the call-to-action button.
     */
    caption?: string | LocalizableContent;
    /**
     * Text of the call-to-action button.
     */
    cta?: string | LocalizableContent;
    /**
     * Object passed to any session launched from this context message.
     * Its size must be <=1000 chars when stringified.
     * It can be accessed from `Wortal.context.getEntryPointData()`.
     */
    data?: Record<string, unknown>;
    /**
     * An array of filters to be applied to the friend list. Only the first filter is currently used.
     */
    filters?: [ContextFilter];
    /**
     * Context maximum size.
     */
    maxSize?: number;
    /**
     * Context minimum size.
     */
    minSize?: number;
    /**
     * Specify how long a friend should be filtered out after the current player sends them a message.
     * This parameter only applies when `NEW_INVITATIONS_ONLY` filter is used.
     * When not specified, it will filter out any friend who has been sent a message.
     */
    hoursSinceInvitation?: number;
    /**
     * Optional customizable text field in the share UI.
     * This can be used to describe the incentive a user can get from sharing.
     */
    description?: string | LocalizableContent;
    /**
     * Message format to be used. There's no visible difference among the available options.
     */
    intent?: 'INVITE' | 'REQUEST' | 'CHALLENGE' | 'SHARE';
    /**
     * Optional property to switch share UI mode.
     *
     * - DEFAULT: Serial contact card with share and skip button.
     * - MULTIPLE: Selectable contact list.
     */
    ui?: 'DEFAULT' | 'MULTIPLE';
    /**
     * Defines the minimum number of players to be selected to start sharing.
     */
    minShare?: number;
    /**
     * Defines how the update message should be delivered.
     *
     * - 'IMMEDIATE': will be sent immediately.
     * - 'LAST': when the game session ends, the latest payload will be sent.
     * - 'IMMEDIATE_CLEAR': will be sent immediately, and also discard any pending `LAST` payloads in the same session.
     */
    strategy?: 'IMMEDIATE' | 'LAST' | 'IMMEDIATE_CLEAR';
    /**
     * Specifies if the message should trigger push notification.
     */
    notifications?: 'NO_PUSH' | 'PUSH';
    /**
     * Specifies where the share should appear.
     */
    shareDestination?: 'NEWSFEED' | 'GROUP' | 'COPY_LINK' | 'MESSENGER';
    /**
     * Should the player switch context or not.
     */
    switchContext?: boolean;
    /**
     * Not used
     */
    action?: 'CUSTOM';
    /**
     * Not used
     */
    template?: string;
}
