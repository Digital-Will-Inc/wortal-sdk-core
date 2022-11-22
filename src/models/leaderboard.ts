/** @hidden */
interface LeaderboardData {
    id: number;
    name: string;
    contextId: string;
}

/**
 * Represents a leaderboard for the game.
 */
export default class Leaderboard {
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
