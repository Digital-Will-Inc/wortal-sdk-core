import { LocalizableContent } from '../localizable-content'

/** @hidden */
export interface MessageOptionsLink {
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
