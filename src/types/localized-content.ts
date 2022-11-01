/**
 * Used for passing localized content to API calls.
 */
export interface LocalizedContent {
    /**
     * Default text to use if no matching locale is found.
     */
    default: string,
    /**
     * Records of locale and localized content.
     * @example
     * en_US: "Play",
     * es_ES: "Jugar",
     * fr_FR: "Jouer",
     */
    localizations: Record<string, string>
}
