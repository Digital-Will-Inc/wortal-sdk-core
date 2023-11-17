import { GetStatsPayload } from "./interfaces/get-stats-payload";
import { PostStatsPayload } from "./interfaces/post-stats-payload";
import { Stats } from "./interfaces/stats";
import { StatsBase } from "./stats-base";

/**
 * The Stats API is used to record and retrieve statistics about the player's progress in the game. This can be used
 * to record high scores, timed challenges, or simply to track how many times a user has performed a particular action.
 * @module Stats
 */
export class StatsAPI {
    private _stats: StatsBase;

    constructor(impl: StatsBase) {
        this._stats = impl;
    }

    /**
     * Gets a player's stats.
     * @param level The name of the level to get stats for.
     * @param payload Payload with additional details about the stats.
     * @example
     * Wortal.stats.getStatsAsync("Level 1")
     *    .then((stats) => {
     *      console.log(stats);
     *    });
     * @returns {Promise<Stats[]>} Promise that resolves to an array of stats.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAMS</li>
     * </ul>
     */
    public getStatsAsync(level: string | number, payload?: GetStatsPayload): Promise<Stats[]> {
        return this._stats.getStatsAsync(level, payload);
    }

    /**
     * Posts a player's stats.
     * @param level The name of the level the stats are for.
     * @param value The value of the stat.
     * @param payload Payload with additional details about the stats.
     * @example
     * Wortal.stats.postStatsAsync("Level 1", "100")
     *   .then(() => {
     *      console.log("Stats posted successfully");
     *   });
     * @returns {Promise<void>} Promise that resolves when the stats have been posted.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAMS</li>
     * </ul>
     */
    public postStatsAsync(level: string | number, value: number, payload?: PostStatsPayload): Promise<void> {
        return this._stats.postStatsAsync(level, value, payload);
    }
}
