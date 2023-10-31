import { ConnectedPlayer } from "../../player/classes/connected-player";
import { debug } from "../../utils/logger";
import { LeaderboardEntryData } from "../interfaces/leaderboard-data";
import { LeaderboardPlayer } from "./leaderboard-player";

/**
 * Represents an entry in a leaderboard.
 */
export class LeaderboardEntry {
    private _data: LeaderboardEntryData = {
        rank: 0,
        score: 0,
        formattedScore: "",
        timestamp: 0,
        details: "",
    }

    /** @hidden */
    constructor(entry: LeaderboardEntryData) {
        debug("Creating leaderboard entry", entry);
        this._data.player = entry.player;
        this._data.rank = entry.rank;
        this._data.score = entry.score;
        this._data.formattedScore = entry.formattedScore;
        this._data.timestamp = entry.timestamp;
        this._data.details = entry.details;
    }

    /**
     * Player that made this entry.
     */
    get player(): LeaderboardPlayer {
        return new LeaderboardPlayer(this._data.player!);
    }

    /**
     * Rank of this entry in the leaderboard.
     */
    get rank(): number {
        return this._data.rank;
    }

    /**
     * Score achieved in this entry.
     */
    get score(): number {
        return this._data.score;
    }

    /**
     * Score of this entry with optional formatting. Ex: '100 points'
     */
    get formattedScore(): string | undefined {
        return this._data.formattedScore;
    }

    /**
     * Timestamp of when this entry was made.
     */
    get timestamp(): number | undefined {
        return this._data.timestamp;
    }

    /**
     * Optional details about this entry.
     */
    get details(): string {
        return this._data.details!;
    }

    /**
     * Creates a mock leaderboard entry for debugging and testing purposes. Pass in optional rank and score if creating
     * multiple entries to test sorting.
     * @param rank Rank of the entry.
     * @param score Score of the entry.
     * @hidden
     */
    static mock(rank: number = 1, score: number = 100): LeaderboardEntry {
        return new LeaderboardEntry({
            player: ConnectedPlayer.mock(),
            rank: rank || 1,
            score: score || 100,
            formattedScore: `${score} points`,
            timestamp: Date.now() - (60000 * rank), // For testing sorting by timestamp
            details: "Mock entry"
        });
    }
}
