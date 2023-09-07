import {
    Action,
    ContextFilter,
    Intent,
    InviteFilter,
    InviteSectionType,
    Notifications,
    ShareDestination,
    Strategy,
    UI
} from "../types/context";

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
     *
     * PLATFORM NOTE: Viber only.
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

/**
 * Payload for context.inviteAsync. Defines the content to be sent in the invite.
 */
export interface InvitePayload {
    /**
     * Data URL of base64 encoded image to be displayed. This is required for the payload to be sent.
     */
    image: string;
    /**
     * A text message, or an object with the default text as the value of 'default' and another object mapping locale keys to translations as the value of 'localizations'.
     */
    text: string | LocalizableContent;
    /**
     * Text of the call-to-action button.
     */
    cta?: string | LocalizableContent;
    /**
     * An optional title to display at the top of the invite dialog instead of the generic title.
     * This param is not sent as part of the message, but only displays in the dialog header.
     * The title can be either a string or an object with the default text as the value of 'default' and another object
     * mapping locale keys to translations as the value of 'localizations'.
     *
     * PLATFORM NOTE: Facebook only.
     */
    dialogTitle? : string | LocalizableContent;
    /**
     * Object passed to any session launched from this context message.
     * Its size must be <=1000 chars when stringified.
     * It can be accessed from `Wortal.session.getEntryPointData()`.
     */
    data?: Record<string, unknown>;
    /**
     * The set of filters to apply to the suggestions. Multiple filters may be applied. If no results are returned when
     * the filters are applied, the results will be generated without the filters.
     */
    filters?: InviteFilter[];
    /**
     * The set of sections to be included in the dialog. Each section can be assigned a maximum number of results to be
     * returned (up to a maximum of 10). If no max is included, a default max will be applied. Sections will be included
     * in the order they are listed in the array. The last section will include a larger maximum number of results, and
     * if a maxResults is provided, it will be ignored. If this array is left empty, default sections will be used.
     *
     * PLATFORM NOTE: Facebook only.
     */
    sections?: InviteSection[];
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
     * It can be accessed from `Wortal.session.getEntryPointData()`.
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
     *
     * PLATFORM NOTE: Viber only.
     */
    hoursSinceInvitation?: number;
    /**
     * Data URL of base64 encoded image to be displayed. This is required for the payload to be sent.
     */
    image: string;
    /**
     * Message format to be used. There's no visible difference among the available options.
     */
    intent?: Intent;
    /**
     * Defines the minimum number of players to be selected to start sharing.
     */
    minShare?: number;
    /**
     * Optional property to directly send share messages to multiple players with a confirmation prompt.
     * Selection UI will be skipped if this property is set.
     *
     * PLATFORM NOTE: Viber only.
     */
    playerIds?: string[];
    /**
     * A text message, or an object with the default text as the value of 'default' and another object mapping locale
     * keys to translations as the value of 'localizations'.
     */
    text: string | LocalizableContent;
    /**
     * Optional property to switch share UI mode.
     */
    ui?: UI;
    /**
     * An optional array to set sharing destinations in the share dialog.
     * If not specified all available sharing destinations will be displayed.
     *
     * PLATFORM NOTE: Facebook only.
     */
    shareDestination?: ShareDestination[];
    /**
     * A flag indicating whether to switch the user into the new context created on sharing.
     *
     * PLATFORM NOTE: Facebook only.
     */
    switchContext?: boolean;
}

/**
 * Payload for context.switchAsync. Defines the message to be sent to the context.
 */
export interface SwitchPayload {
    /**
     * Text of the call-to-action button.
     *
     * PLATFORM NOTE: Link only.
     */
    caption?: string | LocalizableContent;
    /**
     * Message which will be displayed to contact. GAME_NAME, SENDER_NAME, RECEIVER_NAME can be used as template string in the text.
     *
     * PLATFORM NOTE: Link only.
     */
    text?: string | LocalizableContent;
    /**
     * If switching into a solo context, set this to true to switch silently, with no confirmation dialog or toast.
     * This only has an effect when switching into a solo context. Defaults to false.
     *
     * PLATFORM NOTE: Facebook only.
     */
    switchSilentlyIfSolo?: boolean;
}

/**
 * Payload for context.updateAsync. Defines the message to be sent to the context.
 */
export interface UpdatePayload {
    /**
     * Message format to be used.
     */
    action?: Action;
    /**
     * Text of the call-to-action button.
     */
    cta?: string | LocalizableContent;
    /**
     * Object passed to any session launched from this context message.
     * Its size must be <=1000 chars when stringified.
     * It can be accessed from `Wortal.session.getEntryPointData()`.
     */
    data?: Record<string, unknown>;
    /**
     * Data URL of base64 encoded image to be displayed. This is required for the payload to be sent.
     */
    image: string;
    /**
     * Optional content for a gif or video. At least one image or media should be provided in order to render the update.
     *
     * PLATFORM NOTE: Facebook only.
     */
    media?: MediaParams;
    /**
     * Specifies notification setting for the custom update. This can be 'NO_PUSH' or 'PUSH', and defaults to 'NO_PUSH'.
     * Use push notification only for updates that are high-signal and immediately actionable for the recipients.
     * Also note that push notification is not always guaranteed, depending on user setting and platform policies.
     */
    notifications?: Notifications;
    /**
     * Specifies how the update should be delivered. This can be one of the following:
     * If no strategy is specified, we default to 'IMMEDIATE'.
     */
    strategy?: Strategy;
    /**
     * ID of the template this custom update is using. Templates should be predefined in fbapp-config.json.
     * See the [Bundle Config documentation](https://developers.facebook.com/docs/games/instant-games/bundle-config)
     * for documentation about fbapp-config.json.
     *
     * PLATFORM NOTE: Facebook only.
     */
    template?: string;
    /**
     * A text message, or an object with the default text as the value of 'default' and another object mapping locale
     * keys to translations as the value of 'localizations'.
     */
    text: string | LocalizableContent;
}

/**
 * Represents a custom link to be shared by the user.
 */
export interface LinkSharePayload {
    /**
     * A base64 encoded image to be shown for the link preview. The image is recommended to either be a square or of
     * the aspect ratio 1.91:1
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
     * Text of the call-to-action button.
     * If not specified, "今すぐプレイ" will be used by default.
     */
    caption?: string | LocalizableContent,
    /**
     * Object passed to any session launched from this update message.
     * It can be accessed from `Wortal.session.getEntryPointData()`.
     * Its size must be <=1000 chars when stringified.
     */
    data?: Record<string, unknown>,
}

/**
 * Enable passing localizable content to API calls.
 * SDK will use the current player's locale for locale matching.
 */
export interface LocalizableContent {
    /**
     * Text that will be used if a matching locale was not found.
     */
    default: string;
    /**
     * Key value pairs of localized strings.
     */
    localizations: Record<string, string>;
}

/**
 * Response from context.isSizeBetween API. Contains the answer and the min and max size.
 */
export interface ContextSizeResponse {
    answer: boolean,
    maxSize: number,
    minSize: number,
}

/**
 * Represents a section in the inviteAsync dialog that contains suggested matches. The sections will be shown in the
 * order they are included in the array, and the last section will contain as many results as possible.
 */
export interface InviteSection {
    /**
     * The type of section to include in the inviteAsync dialog
     */
    sectionType: InviteSectionType;
    /**
     * Optional maximum number of results to include in the section. This can be no higher than 10. This will be
     * disregarded for the last section, which will contain as many results as possible. If not included, the default
     * maximum number of results for that section type will be used.
     */
    maxResults?: number;
}

/**
 * Represents the media payload used by custom update and custom share.
 */
export interface MediaParams {
    /**
     * URL of the gif to be displayed.
     */
    gif?: MediaContent;
    /**
     * URL of the video to be displayed.
     */
    video?: MediaContent;
}

/**
 * Specifies the content for media.
 */
export interface MediaContent {
    url: string;
}
