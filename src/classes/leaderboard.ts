import { LeaderboardData, LeaderboardEntryData } from "../interfaces/leaderboard";
import { debug } from "../utils/logger";
import { ConnectedPlayer, LeaderboardPlayer } from "./player";

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
        debug(`Creating leaderboard: ${name} / ${id} / ${contextId}`);
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

    /**
     * Creates a mock leaderboard for debugging and testing purposes.
     * @hidden
     */
    static mock(): Leaderboard {
        return new Leaderboard(1234567890, "Mock Leaderboard", "1234567890");
    }
}

/**
 * Represents an entry in a leaderboard.
 */
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
        debug("Creating leaderboard entry", entry);
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
    get formattedScore(): string | undefined {
        return this._current.formattedScore;
    }

    /**
     * Timestamp of when this entry was made.
     */
    get timestamp(): number | undefined {
        return this._current.timestamp;
    }

    /**
     * Optional details about this entry.
     */
    get details(): string {
        return this._current.details!;
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
