import { API_URL, WORTAL_API } from "../data/core-data";
import { invalidParams } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import { apiCall } from "../utils/logger";
import { isValidNumber, isValidString } from "../utils/validators";
import { GetStatsPayload } from "./interfaces/get-stats-payload";
import { PostStatsPayload } from "./interfaces/post-stats-payload";
import { Stats } from "./interfaces/stats";

/**
 * Base implementation for the Stats API. Extend this class to implement the Stats API for a specific platform.
 * @hidden
 */
export abstract class StatsBase {
    constructor() {
    }

//#region Public API

    public getStatsAsync(level: string | number, payload?: GetStatsPayload): Promise<Stats[]> {
        apiCall(WORTAL_API.STATS_GET_STATS_ASYNC);

        const validationResult = this.validateGetStats(level, payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getStatsAsyncImpl(level, payload);
    }

    public postStatsAsync(level: string | number, value: number, payload?: PostStatsPayload): Promise<void> {
        apiCall(WORTAL_API.STATS_POST_STATS_ASYNC);

        const validationResult = this.validatePostStats(level, value, payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.postStatsAsyncImpl(level, value, payload);
    }

//#endregion
//#region Implementation interface

    protected abstract getStatsAsyncImpl(level: string | number, payload?: GetStatsPayload): Promise<any>;
    protected abstract postStatsAsyncImpl(level: string | number, value: number, payload?: PostStatsPayload): Promise<any>;

//#endregion
//#region Validation

    protected validateGetStats(level: string | number, payload?: GetStatsPayload): ValidationResult {
        if (!isValidString(level) && !isValidNumber(level)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.STATS_GET_STATS_ASYNC, API_URL.STATS_GET_STATS_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validatePostStats(level: string | number, value: number, payload?: PostStatsPayload): ValidationResult {
        if ((!isValidString(level) && !isValidNumber(level)) || (!isValidNumber(value))) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.STATS_POST_STATS_ASYNC, API_URL.STATS_POST_STATS_ASYNC),
            };
        }

        return { valid: true };
    }

//#endregion
}
