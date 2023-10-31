import { MediaContent } from "./media-content";

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
