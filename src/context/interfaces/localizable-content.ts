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
