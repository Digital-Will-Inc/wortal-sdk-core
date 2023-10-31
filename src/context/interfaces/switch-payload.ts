import { LocalizableContent } from "./localizable-content";

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
