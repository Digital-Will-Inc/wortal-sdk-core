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
