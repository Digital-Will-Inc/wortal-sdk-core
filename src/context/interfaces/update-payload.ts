import { Action, Notifications, Strategy } from "../types/context-payload-property-types";
import { LocalizableContent } from "./localizable-content";
import { MediaParams } from "./media-params";

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
