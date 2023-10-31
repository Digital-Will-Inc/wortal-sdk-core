import { Leaderboard } from "./classes/leaderboard";
import { LeaderboardEntry } from "./classes/leaderboard-entry";
import { LeaderboardBase } from "./leaderboard-base";

/**
 * Leaderboard API allows you to manage leaderboards for your game. Leaderboards are a great way to encourage competition
 * between players and to show off your players' skills. You can create multiple leaderboards for your game, each with
 * its own set of scores. You can also associate leaderboards with specific contexts, allowing you to have different
 * leaderboards for different parts of your game. For example, you could have a leaderboard for each level in your game.
 * @module Leaderboard
 */
export class LeaderboardAPI {
    private _leaderboard: LeaderboardBase;

    constructor(impl: LeaderboardBase) {
        this._leaderboard = impl;
    }

    /**
     * Retrieves the leaderboard score entries of the current player's connected players (including the current player),
     * ordered by local rank within the set of connected players.
     * @example
     * Wortal.leaderboard.getConnectedPlayersEntriesAsync('global')
     *  .then(entries => console.log(entries));
     * @param name The name of the leaderboard.
     * @param count The number of entries to attempt to fetch from the leaderboard. Defaults to 10 if not specified.
     * Currently, up to a maximum of 100 entries may be fetched per query.
     * @param offset The offset from the set of ordered connected player score entries to fetch from.
     * @returns {Promise<LeaderboardEntry[]>} Promise that resolves with the leaderboard entries that match the query.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>RATE_LIMITED</li>
     * </ul>
     */
    public getConnectedPlayersEntriesAsync(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        return this._leaderboard.getConnectedPlayersEntriesAsync(name, count, offset);
    }

    /**
     * Retrieves a set of leaderboard entries, ordered by score ranking in the leaderboard.
     * @example
     * Wortal.leaderboard.getEntriesAsync('global', 10)
     *  .then(entries => console.log(entries));
     * @param name The name of the leaderboard.
     * @param count The number of entries to attempt to fetch from the leaderboard. Defaults to 10 if not specified.
     * Currently, up to a maximum of 100 entries may be fetched per query.
     * @param offset The offset from the top of the leaderboard that entries will be fetched from. Default is 0.
     * @returns {Promise<LeaderboardEntry[]>} Promise that resolves with the leaderboard entries that match the query.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>RATE_LIMITED</li>
     * </ul>
     */
    public getEntriesAsync(name: string, count: number, offset: number = 0): Promise<LeaderboardEntry[]> {
        return this._leaderboard.getEntriesAsync(name, count, offset);
    }

    /**
     * Gets the total number of entries in the leaderboard.
     * @example
     * Wortal.leaderboard.getEntryCountAsync('global')
     *  .then(entries => console.log(entries));
     * @param name The name of the leaderboard.
     * @returns {Promise<number>} Promise that resolves with the number of entries.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>RATE_LIMITED</li>
     * </ul>
     */
    public getEntryCountAsync(name: string): Promise<number> {
        return this._leaderboard.getEntryCountAsync(name);
    }

    /**
     * Fetch a specific leaderboard belonging to this game.
     * @example
     * Wortal.leaderboard.getLeaderboardAsync('global')
     *  .then(leaderboard => console.log(leaderboard.name()));
     * @param name The name of the leaderboard. Each leaderboard for a game must have its own distinct name.
     * @returns {Promise<Leaderboard>} Promise that resolves with the matching leaderboard, rejecting if one is not found.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>LEADERBOARD_NOT_FOUND</li>
     * <li>NETWORK_FAILURE</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>INVALID_OPERATION</li>
     * <li>INVALID_PARAM</li>
     * </ul>
     */
    public getLeaderboardAsync(name: string): Promise<Leaderboard> {
        return this._leaderboard.getLeaderboardAsync(name);
    }

    /**
     * Retrieves the leaderboard's entry for the current player, or null if the player has not set one yet.
     * @example
     * Wortal.leaderboard.getPlayerEntryAsync('global')
     *  .then(entry => console.log(entry.rank()));
     * @param name The name of the leaderboard.
     * @returns {Promise<LeaderboardEntry>} Promise that resolves with the current leaderboard entry for the player.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>INVALID_OPERATION</li>
     * <li>NETWORK_FAILURE</li>
     * <li>RATE_LIMITED</li>
     * </ul>
     */
    public getPlayerEntryAsync(name: string): Promise<LeaderboardEntry> {
        return this._leaderboard.getPlayerEntryAsync(name);
    }

    /**
     * Updates the player's score. If the player has an existing score, the old score will only be replaced if the new
     * score is better than it. NOTE: If the leaderboard is associated with a specific context, the game must be in that
     * context to set a score for the player.
     * @example
     * Wortal.leaderboard.sendEntryAsync('global', 100);
     * @param name The name of the leaderboard.
     * @param score Score for the entry. Must be a 64-bit integer number.
     * @param details Optional metadata to associate with the stored score. Must be less than 2KB in size.
     * @returns {Promise<LeaderboardEntry>} Promise that resolves with the current leaderboard entry for the player after the update.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>LEADERBOARD_WRONG_CONTEXT</li>
     * <li>NETWORK_FAILURE</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>INVALID_PARAM</li>
     * <li>INVALID_OPERATION</li>
     * <li>RATE_LIMITED</li>
     * </ul>
     */
    public sendEntryAsync(name: string, score: number, details: string = ""): Promise<LeaderboardEntry> {
        return this._leaderboard.sendEntryAsync(name, score, details);
    }

}
