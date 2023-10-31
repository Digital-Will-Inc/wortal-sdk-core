/**
 * Leaderboard entry interface for Telegram.
 * @hidden
 */
export interface LeaderboardEntry_Telegram {
    position: number;
    score: number;
    username?: string; // This sometimes returns null. Telegram support says not everyone has a username, so it's not a bug.
}
