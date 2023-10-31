import { InviteFilter } from "../types/context-payload-property-types";
import { InviteSection } from "./invite-section";
import { LocalizableContent } from "./localizable-content";

/**
 * Payload for `context.inviteAsync`. Defines the content to be sent in the invite.
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
