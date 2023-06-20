import { ContextFilter, ShareDestination } from "./context";
import { LocalizableContent } from "./localizable-content";
import { MediaParams } from "./media";

/**
 * Payload for context.chooseAsync. Defines the filters and search parameters to apply to the friend list.
 */
export interface ChoosePayload {
    /**
     * Optional customizable text field in the share UI.
     * This can be used to describe the incentive a user can get from sharing.
     */
    description?: string | LocalizableContent;
    /**
     * An array of filters to be applied to the friend list. Only the first filter is currently used.
     */
    filters?: [ContextFilter];
    /**
     * Specify how long a friend should be filtered out after the current player sends them a message.
     * This parameter only applies when `NEW_INVITATIONS_ONLY` filter is used.
     * When not specified, it will filter out any friend who has been sent a message.
     */
    hoursSinceInvitation?: number;
    /**
     * Context maximum size for matching.
     */
    maxSize?: number;
    /**
     * Context minimum size for matching.
     */
    minSize?: number;
}

export interface InvitePayload {

}

/**
 * Payload for context.shareAsync. Defines the message to be sent to the context.
 */
export interface SharePayload {
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
     * Optional customizable text field in the share UI.
     * This can be used to describe the incentive a user can get from sharing.
     */
    description?: string | LocalizableContent;
    /**
     * An array of filters to be applied to the friend list. Only the first filter is currently used.
     */
    filters?: [ContextFilter];
    /**
     * Specify how long a friend should be filtered out after the current player sends them a message.
     * This parameter only applies when `NEW_INVITATIONS_ONLY` filter is used.
     * When not specified, it will filter out any friend who has been sent a message.
     */
    hoursSinceInvitation?: number;
    /**
     * Data URL of base64 encoded image to be displayed. This is required for the payload to be sent.
     */
    image: string;
    /**
     * Message format to be used. There's no visible difference among the available options.
     */
    intent?: 'INVITE' | 'REQUEST' | 'CHALLENGE' | 'SHARE';
    /**
     * Defines the minimum number of players to be selected to start sharing.
     */
    minShare?: number;
    /**
     * Optional property to directly send share messages to multiple players with a confirmation prompt.
     * Selection UI will be skipped if this property is set. Viber only.
     */
    playerIds?: string[];
    /**
     * Text of the message body.
     */
    text: string | LocalizableContent;
    /**
     * Optional property to switch share UI mode.
     *
     * - DEFAULT: Serial contact card with share and skip button.
     * - MULTIPLE: Selectable contact list.
     */
    ui?: 'DEFAULT' | 'MULTIPLE';
    /**
     * Am optional array to set sharing destinations in the share dialog.
     * If not specified all available sharing destinations will be displayed. Facebook only.
     */
    shareDestination?: ShareDestination[];
    /**
     * A flag indicating whether to switch the user into the new context created on sharing. Facebook only.
     */
    switchContext?: boolean;
}

/**
 * Payload for context.updateAsync. Defines the message to be sent to the context.
 */
export interface UpdatePayload {
    /**
     * Message format to be used.
     */
    action?: 'CUSTOM';
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
     * Data URL of base64 encoded image to be displayed. This is required for the payload to be sent.
     */
    image: string;
    /**
     * Optional content for a gif or video. At least one image or media should be provided in order to render the update.
     * Facebook only.
     */
    media?: MediaParams;
    /**
     * Specifies notification setting for the custom update. This can be 'NO_PUSH' or 'PUSH', and defaults to 'NO_PUSH'.
     * Use push notification only for updates that are high-signal and immediately actionable for the recipients.
     * Also note that push notification is not always guaranteed, depending on user setting and platform policies.
     */
    notifications?: 'NO_PUSH' | 'PUSH';
    /**
     * Specifies how the update should be delivered. This can be one of the following:
     *
     * - 'IMMEDIATE' - The update should be posted immediately.
     * - 'LAST' - The update should be posted when the game session ends. The most recent update sent using the 'LAST' strategy will be the one sent.
     * - 'IMMEDIATE_CLEAR': will be sent immediately, and also discard any pending LAST payloads in the same session.
     *
     * If no strategy is specified, we default to 'IMMEDIATE'.
     */
    strategy?: 'IMMEDIATE' | 'LAST' | 'IMMEDIATE_CLEAR';
    /**
     * ID of the template this custom update is using. Templates should be predefined in fbapp-config.json.
     * See the [Bundle Config documentation](https://developers.facebook.com/docs/games/instant-games/bundle-config) for documentation about fbapp-config.json.
     */
    template?: string;
    /**
     * Text of the message body.
     */
    text: string | LocalizableContent;
}

/**
 * Represents a custom link to be shared by the user.
 */
export interface LinkSharePayload {
    /**
     * A base64 encoded image to be shown for the link preview. The image is recommended to either be a square or of the aspect ratio 1.91:1
     */
    image?: string;
    /**
     * A text description for the link preview. Recommended to be less than 44 characters
     */
    text?: string;
    /**
     * A blob of data to associate with the shared link. All game sessions launched from the share will be able to
     * access this blob through Wortal.session.getEntryPointData().
     */
    data: Record<string, unknown>;
}

/** @hidden */
export interface LinkMessagePayload {
    /**
     * Image which will be displayed to contact.
     * A string containing data URL of a base64 encoded image.
     * If not specified, game's icon image will be used by default.
     */
    image?: string,
    /**
     * Message which will be displayed to contact.
     * If not specified, "SENDER_NAMEと一緒に「GAME_NAME」をプレイしよう！" will be used by default.
     */
    text?: string | LocalizableContent,
    /**
     * Text of the call to action button.
     * If not specified, "今すぐプレイ" will be used by default.
     */
    caption?: string | LocalizableContent,
    /**
     * Object passed to any session launched from this update message.
     * It can be accessed from `LinkGame.getEntryPointData()`.
     * Its size must be <=1000 chars when stringified.
     */
    data?: Record<string, unknown>,
}
