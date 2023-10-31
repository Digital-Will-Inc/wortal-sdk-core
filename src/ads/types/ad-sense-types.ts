/**
 * Types of ad placements as defined by Google:
 * https://developers.google.com/ad-placement/docs/placement-types
 *
 * - `start`: Your game has loaded, the UI is visible and sound is enabled, the player can interact with the game, but the game play has not started yet.
 * - `pause`: The player pauses the game.
 * - `next`: The player navigates to the next level.
 * - `browse`: The player explores options outside of gameplay.
 *
 * NOTE: `preroll` and `reward` are reserved for special ad calls. Do not pass these types to any ads API calls.
 * Use ads.showRewarded() which will automatically add the 'reward' type.
 */
export type PlacementType = "preroll" | "start" | "pause" | "next" | "browse" | "reward"

/**
 * Status of an ad break.
 * https://developers.google.com/ad-placement/apis/adbreak#adbreakdone_and_placementinfo
 * @hidden
 */
export type AdBreakStatus = "notReady" | "timeout" | "error" | "noAdPreloaded" | "frequencyCapped"
    | "ignored" | "other" | "dismissed" | "viewed"
