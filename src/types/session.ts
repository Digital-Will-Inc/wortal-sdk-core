/**
 * Platform the game is currently being played on.
 */
export type Platform = 'wortal' | 'link' | 'viber' | 'gd' | 'facebook' | 'debug'

/**
 * Device the player is currently using.
 */
export type Device = 'ANDROID' | 'IOS' | 'DESKTOP'

/** @hidden */
export interface SessionData {
    gameId: string;
    browser: string;
    country: string;
    platform: Platform;
}
