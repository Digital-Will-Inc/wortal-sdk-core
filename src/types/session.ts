/**
 * Platform the game is currently being played on.
 */
export type Platform = 'wortal' | 'link' | 'viber' | 'gd' | 'facebook' | 'crazygames' | 'gamepix' | 'debug'

/**
 * Device the player is currently using.
 */
export type Device = 'ANDROID' | 'IOS' | 'DESKTOP' | 'WEB'

/**
 * Device orientation.
 */
export type Orientation = 'portrait' | 'landscape'

/** @hidden */
export interface SessionData {
    gameId: string;
    browser: string;
    country: string;
    platform: Platform;
}
