import LeaderboardEntry from "./leaderboard-entry";
import {sdk} from "../sdk";

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

    /**
     * Gets a list of leaderboard entries in the leaderboard.
     * @param count Number of entries to get.
     * @param offset Offset from the first entry (top rank) to start the count from. Default is 0.
     * @returns Array of LeaderboardEntry.
     */
    getEntriesAsync(count: number, offset: number = 0): Promise<LeaderboardEntry[]> {
        if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
            return (window as any).wortalGame
                .getEntriesAsync(count, offset)
                .then((results: any[]) => results.map(result => new LeaderboardEntry(result)))
                .catch((error: any) => console.error(error));
        } else {
            return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + sdk.session.platform);
        }
    }

    /**
     * Gets the player's entry in the leaderboard.
     * @returns LeaderboardEntry for the player.
     */
    getPlayerEntryAsync(): Promise<LeaderboardEntry> {
        if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
            return (window as any).wortalGame
                .getPlayerEntryAsync()
                .then((result: any) => new LeaderboardEntry(result))
                .catch((error: any) => console.error(error));
        } else {
            return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + sdk.session.platform);
        }
    }

    /**
     * Gets the total number of entries in the leaderboard.
     * @returns Number of entries.
     */
    getEntryCountAsync(): Promise<number> {
        if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
            return (window as any).wortalGame
                .getEntryCountAsync()
                .then((result: any) => result)
                .catch((error: any) => console.error(error));
        } else {
            return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + sdk.session.platform);
        }
    }

    /**
     * Gets a list of leaderboard entries of connected players in the leaderboard.
     * @param count Number of entries to get.
     * @param offset Offset from the first entry (top rank) to start the count from. Default is 0.
     * @returns Array of LeaderboardEntry.
     */
    getConnectedPlayersEntriesAsync(count: number, offset: number): Promise<LeaderboardEntry[]> {
        if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
            return (window as any).wortalGame
                .getConnectedPlayerEntriesAsync(count, offset)
                .then((results: any[]) => results.map(result => new LeaderboardEntry(result)))
                .catch((error: any) => console.error(error));
        } else {
            return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + sdk.session.platform);
        }
    }

    /**
     * Sends an entry to be added to the leaderboard, or updated if already existing. Will only update if the score
     * is a higher than the player's previous entry.
     * @param score Score for the entry.
     * @param details Optional additional details about the entry.
     * @returns The new entry if one was created, updated entry if the score is higher, or the old entry if no new
     * high score was achieved.
     */
    sendEntryAsync(score: number, details: string = ""): Promise<LeaderboardEntry> {
        if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
            return (window as any).wortalGame
                .setScoreAsync()
                .then((result: any) => new LeaderboardEntry(result))
                .catch((error: any) => console.error(error));
        } else {
            return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + sdk.session.platform);
        }
    }
}
