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
}
