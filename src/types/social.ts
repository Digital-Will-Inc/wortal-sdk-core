import {LocalizedContent} from "./localized-content";
import {GroupFilter} from "./social-group";

export interface SocialRequest {
    /**
     * Request type to be used.
     */
    type: 'INVITE' | 'REQUEST' | 'CHALLENGE' | 'SHARE';
    /**
     * Data URL of a base64 encoded image.
     */
    image: string;
    /**
     * Message body.
     */
    text: string | LocalizedContent;
    /**
     * Object passed to any session launched from this update message.
     * It can be accessed from `Wortal.social.getEntryPointData()`.
     * Size must be <=1000 chars when stringified.
     */
    data?: Record<string, unknown>;
    /**
     * Filter to be applied to the request.
     */
    filter?: GroupFilter[];
    /**
     * Define how long a friend should be filtered out after the current player sends them a message.
     * This parameter only applies when the `NEW_INVITES_ONLY` filter is used.
     * When not defined, it will filter out any friend who has already been sent a message.
     */
    hoursSinceInvitation?: number;
    /**
     * Define the minimum number of players to be selected to start sharing.
     */
    minShare?: number;
    /**
     * Optional customizable text field in the share UI.
     * This can be used to describe the incentive a user can get from sharing.
     */
    description?: string | LocalizedContent;
    /**
     * Optional property to switch share UI mode.
     * DEFAULT: Serial contact card with share and skip button.
     * MULTIPLE: Selectable contact list.
     */
    ui?: 'DEFAULT' | 'MULTIPLE';
    /**
     * Call-To-Action button text. If not specified, "Play" will be used by default.
     */
    cta?: string | LocalizedContent;
    /**
     * Optional property to directly send share messages to multiple players with a confirmation prompt.
     * Selection UI will be skipped if this property is set.
     */
    playerIds?: string[];
}

export interface SocialResult {
    /**
     * The number of players who are sent the share message.
     */
    sharedCount: number;
}
