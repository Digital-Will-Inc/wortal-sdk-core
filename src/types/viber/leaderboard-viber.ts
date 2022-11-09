import { PlayerRawDataViber } from './player-viber';

/** @hidden */
export interface LeaderboardEntryRawDataViber {
    score: number;
    formattedScore: string;
    timestamp: number;
    rank: number;
    extraData: string | null;
    player: LeaderboardPlayerRawDataViber;
}

/** @hidden */
export type LeaderboardPlayerRawDataViber = PlayerRawDataViber;
