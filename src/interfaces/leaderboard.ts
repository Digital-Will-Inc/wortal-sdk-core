import { LeaderboardPlayerData } from "../types/leaderboard";

/** @hidden */
export interface LeaderboardData {
    id: number;
    name: string;
    contextId: string;
}

/** @hidden */
export interface LeaderboardEntryData {
    player?: LeaderboardPlayerData,
    rank: number,
    score: number,
    formattedScore: string,
    timestamp: number,
    details?: string,
}
