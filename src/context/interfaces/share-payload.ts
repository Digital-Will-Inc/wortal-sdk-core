import { ContextFilter, Intent, ShareDestination, UI } from "../types/context-payload-property-types";
import { LocalizableContent } from "./localizable-content";

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
