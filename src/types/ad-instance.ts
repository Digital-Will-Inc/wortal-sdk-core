/**
 * Types of ad placements as defined by Google:
 * https://developers.google.com/ad-placement/docs/placement-types
 */
export enum PlacementType {
    /// Your game has not loaded its UI and is not playing sound. There can only be one ‘preroll’ placement in your game
    /// for each page load. Preroll ads can only use the adBreakDone callback.
    PREROLL = 'preroll',
    /// Your game has loaded, the UI is visible and sound is enabled, the player can interact with the game, but the
    /// game play has not started yet.
    START = 'start',
    /// The player pauses the game.
    PAUSE = 'pause',
    /// The player navigates to the next level.
    NEXT = 'next',
    /// The player explores options outside of gameplay.
    BROWSE = 'browse',
    /// The player reaches a point in the game where they can be offered a reward.
    REWARD = 'reward',
}

/** @hidden */
export interface AdInstanceData {
    placementType: PlacementType;
    adUnitId: string;
    description: string;
    beforeAd: Function;
    afterAd: Function;
    adDismissed?: Function;
    adViewed?: Function;
}
