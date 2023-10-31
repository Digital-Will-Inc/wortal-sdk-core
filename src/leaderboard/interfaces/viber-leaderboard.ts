/**
 * Leaderboard interface for Viber.
 * @hidden
 */
export interface Leaderboard_Viber {
    getConnectedPlayerEntriesAsync(count: number, offset: number): Promise<LeaderboardEntry_Viber[]>;
    getContextID(): string | null;
    getEntriesAsync(count: number, offset: number): Promise<LeaderboardEntry_Viber[]>;
    getEntryCountAsync(): Promise<number>;
    getName(): string;
    getPlayerEntryAsync(): Promise<LeaderboardEntry_Viber | null>;
    setScoreAsync(score: number, extraData?: string): Promise<LeaderboardEntry_Viber>;
}

/**
 * Leaderboard entry interface for Viber.
 * @hidden
 */
export interface LeaderboardEntry_Viber {
    getExtraData(): string | null;
    getFormattedScore(): string;
    getPlayer(): LeaderboardPlayer_Viber;
    getRank(): number;
    getScore(): number;
    getTimestamp(): number;
}

/**
 * Leaderboard player interface for Viber.
 * @hidden
 */
export interface LeaderboardPlayer_Viber {
    getID(): string;
    getName(): string;
    getPhoto(): string;
    hasPlayed(): true; // Always returns true as the player has to have played to be on the leaderboard.
}
