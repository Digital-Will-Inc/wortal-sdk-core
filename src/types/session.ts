/**
 * Platform the game is currently being played on.
 */
export type Platform = 'wortal' | 'link' | 'viber' | 'gd' | 'facebook' | 'debug'

/** @hidden */
export interface SessionData {
    gameId: string;
    browser: string;
    country: string;
    platform: Platform;
}
