/**
 * Leaderboard interface for Facebook Instant Games.
 * @hidden
 */
export interface Leaderboard_Facebook {
    getName(): string;
    getContextID(): string;
    getEntryCountAsync(): Promise<number>;
    setScoreAsync(score: number, extraData: string): Promise<LeaderboardEntry_Facebook>;
    getPlayerEntryAsync(): Promise<LeaderboardEntry_Facebook>;
    getEntriesAsync(count: number, offset: number): Promise<LeaderboardEntry_Facebook[]>;
    getConnectedPlayerEntriesAsync(count: number, offset: number): Promise<LeaderboardEntry_Facebook[]>;
}

/**
 * Leaderboard entry interface for Facebook Instant Games.
 * @hidden
 */
export interface LeaderboardEntry_Facebook {
    getScore(): number;
    getFormattedScore(): string;
    getTimestamp(): number;
    getRank(): number;
    getExtraData(): string | undefined;
    getPlayer(): LeaderboardPlayer_Facebook;
}

/**
 * Leaderboard player interface for Facebook Instant Games.
 * @hidden
 */
export interface LeaderboardPlayer_Facebook {
    getName(): string;
    getPhoto(): string | undefined;
    getID(): string;
}
