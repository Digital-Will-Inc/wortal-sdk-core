import { ContextFilter } from "../types/context-payload-property-types";
import { LocalizableContent } from "./localizable-content";

/**
 * Payload for `context.chooseAsync`. Defines the filters and search parameters to apply to the friend list.
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
    /**
     * Image which will be displayed to contact.
     * A string containing data URL of a base64 encoded image.
     * If not specified, game's icon image will be used by default.
     *
     * PLATFORM NOTE: Link only.
     */
    image?: string,
    /**
     * Message which will be displayed to contact.
     * If not specified, "SENDER_NAMEと一緒に「GAME_NAME」をプレイしよう！" will be used by default.
     *
     * PLATFORM NOTE: Link only.
     */
    text?: string | LocalizableContent,
    /**
     * Text of the call-to-action button.
     * If not specified, "今すぐプレイ" will be used by default.
     *
     * PLATFORM NOTE: Link only.
     */
    caption?: string | LocalizableContent,
    /**
     * Object passed to any session launched from this update message.
     * It can be accessed from `Wortal.session.getEntryPointData()`.
     * Its size must be <=1000 chars when stringified.
     *
     * PLATFORM NOTE: Link only.
     */
    data?: Record<string, unknown>,
}
