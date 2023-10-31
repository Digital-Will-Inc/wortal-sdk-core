import { LeaderboardPlayerData } from "../types/leaderboard-types";

/**
 * Data for a leaderboard.
 * @hidden
 */
export interface LeaderboardData {
    id: number;
    name: string;
    contextId: string;
}

/**
 * Data for a leaderboard entry.
 * @hidden
 */
export interface LeaderboardEntryData {
    player?: LeaderboardPlayerData,
    rank: number,
    score: number,
    formattedScore?: string,
    timestamp?: number,
    details?: string | null,
}
