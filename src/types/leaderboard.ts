import {PlayerData} from "./player";

/** @hidden */
export interface LeaderboardEntryData {
    player?: LeaderboardPlayerData,
    rank: number,
    score: number,
    formattedScore: string,
    timestamp: number,
    details?: string,
}

/** @hidden */
export type LeaderboardPlayerData = PlayerData;
