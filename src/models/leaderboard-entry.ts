import { LeaderboardEntryData } from "../types/leaderboard";
import LeaderboardPlayer from "./leaderboard-player";

export default class LeaderboardEntry {
    private _current: LeaderboardEntryData = {
        rank: 0,
        score: 0,
        formattedScore: "",
        timestamp: 0,
        details: "",
    }

    /** @hidden */
    constructor(entry: LeaderboardEntryData) {
        this._current.player = entry.player;
        this._current.rank = entry.rank;
        this._current.score = entry.score;
        this._current.formattedScore = entry.formattedScore;
        this._current.timestamp = entry.timestamp;
        this._current.details = entry.details;
    }

    /**
     * Player that made this entry.
     */
    get player(): LeaderboardPlayer {
        return new LeaderboardPlayer(this._current.player!);
    }

    /**
     * Rank of this entry in the leaderboard.
     */
    get rank(): number {
        return this._current.rank;
    }

    /**
     * Score achieved in this entry.
     */
    get score(): number {
        return this._current.score;
    }

    /**
     * Score of this entry with optional formatting. Ex: '100 points'
     */
    get formattedScore(): string {
        return this._current.formattedScore;
    }

    /**
     * Timestamp of when this entry was made.
     */
    get timestamp(): number {
        return this._current.timestamp;
    }

    /**
     * Optional details about this entry.
     */
    get details(): string {
        return this._current.details!;
    }
}
