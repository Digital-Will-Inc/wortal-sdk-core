import { LeaderboardData, LeaderboardEntryData } from "../interfaces/leaderboard";
import { LeaderboardPlayer } from "./player";

/**
 * Represents a leaderboard for the game.
 */
export class Leaderboard {
    private _current: LeaderboardData = {
        id: 0,
        name: "",
        contextId: ""
    }

    /** @hidden */
    constructor(id: number, name: string, contextId: string = "") {
        this._current.id = id;
        this._current.name = name;
        this._current.contextId = contextId;
    }

    /**
     * Name of the leaderboard.
     */
    get name(): string {
        return this._current.name;
    }

    /**
     * Context ID of the leaderboard, if one exits.
     */
    get contextId(): string {
        return this._current.contextId;
    }
}

export class LeaderboardEntry {
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
