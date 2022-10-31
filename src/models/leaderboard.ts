/** @hidden */
interface LeaderboardData {
    id: number;
    name: string;
    contextId: string;
}

/**
 * Details about a leaderboard.
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
     * Gets the name of the leaderboard.
     * @returns Name of the leaderboard.
     */
    get name(): string {
        return this._current.name;
    }

    /**
     * Gets the context ID, if any, of the leaderboard.
     * @returns Context ID or empty string.
     */
    get contextId(): string {
        return this._current.contextId;
    }
}
