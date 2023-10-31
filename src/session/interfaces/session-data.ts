import { Platform } from "../types/session-types";

/**
 * Data about the current session.
 * @hidden
 */
export interface SessionData {
    gameId: string;
    browser: string;
    country: string;
    platform: Platform;
}
