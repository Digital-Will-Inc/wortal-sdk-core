/**
 * Leaderboard interface for Link.
 * @hidden
 */
export interface Leaderboard_Link {
    getConnectedPlayerEntriesAsync(count: number, offset: number): Promise<LeaderboardEntry_Link[]>;
    getContextID(): null; // Link doesn't support context leaderboards, so this is always null
    getEntriesAsync(count: number, offset: number): Promise<LeaderboardEntry_Link[]>; // Same as getConnectedPlayerEntriesAsync as Link only returns friends
    getEntryCountAsync(): Promise<number>;
    getName(): string;
    getPlayerEntryAsync(): Promise<LeaderboardEntry_Link | null>;
    setScoreAsync(score: number, extraData?: string): Promise<LeaderboardEntry_Link>;
}

/**
 * Leaderboard entry interface for Link.
 * @hidden
 */
export interface LeaderboardEntry_Link {
    getExtraData(): string | null;
    getFormattedScore(): string;
    getPlayer(): LeaderboardPlayer_Link;
    getRank(): number;
    getScore(): number;
    getTimestamp(): number;
}

/**
 * Leaderboard player interface for Link.
 * @hidden
 */
export interface LeaderboardPlayer_Link {
    getID(): string;
    getName(): string;
    getPhoto(): string;
    hasPlayed(): true; // Always returns true as the player has to have played to be on the leaderboard.
}
