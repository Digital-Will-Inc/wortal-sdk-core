import {LeaderboardEntryData} from "../types/leaderboard";
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
     * Gets the info of the player for this entry.
     * @returns LeaderboardPlayer instance with player info.
     */
    get player(): LeaderboardPlayer {
        return new LeaderboardPlayer(this._current.player!);
    }

    /**
     * Gets the rank of this entry in the leaderboard.
     * @returns Rank of this entry.
     */
    get rank(): number {
        return this._current.rank;
    }

    /**
     * Gets the score for this entry.
     * @returns Score for this entry.
     */
    get score(): number {
        return this._current.score;
    }

    /**
     * Gets the formatted score for this entry.
     * @returns Formatted string with the score for this entry.
     */
    get formattedScore(): string {
        return this._current.formattedScore;
    }

    /**
     * Gets the timestamp for when this entry was created or updated.
     * @returns Timestamp for this entry.
     */
    get timestamp(): number {
        return this._current.timestamp;
    }

    /**
     * Gets the details for this entry, if any exist.
     * @returns Details if they exist, otherwise an empty string.
     */
    get details(): string {
        return this._current.details!;
    }
}
