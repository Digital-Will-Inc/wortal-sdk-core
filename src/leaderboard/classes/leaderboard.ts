import { debug } from "../../utils/logger";
import { LeaderboardData } from "../interfaces/leaderboard-data";

/**
 * Represents a leaderboard for the game.
 */
export class Leaderboard {
    private _data: LeaderboardData = {
        id: 0,
        name: "",
        contextId: ""
    }

    /** @hidden */
    constructor(id: number, name: string, contextId: string = "") {
        debug(`Creating leaderboard: ${name} / ${id} / ${contextId}`);
        this._data.id = id;
        this._data.name = name;
        this._data.contextId = contextId;
    }

    /**
     * Name of the leaderboard.
     */
    get name(): string {
        return this._data.name;
    }

    /**
     * Context ID of the leaderboard, if one exits.
     */
    get contextId(): string {
        return this._data.contextId;
    }

    /**
     * Creates a mock leaderboard for debugging and testing purposes.
     * @hidden
     */
    static mock(): Leaderboard {
        return new Leaderboard(1234567890, "Mock Leaderboard", "1234567890");
    }
}
