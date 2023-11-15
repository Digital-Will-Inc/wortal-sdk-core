import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { GetStatsPayload } from "../interfaces/get-stats-payload";
import { PostStatsPayload } from "../interfaces/post-stats-payload";
import { Stats } from "../interfaces/stats";
import { StatsBase } from "../stats-base";

/**
 * Link implementation of the Stats API.
 * @hidden
 */
export class StatsLink extends StatsBase {
    protected getStatsAsyncImpl(level: string | number, payload?: GetStatsPayload): Promise<Stats[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.STATS_GET_STATS, API_URL.STATS_GET_STATS));
    }

    protected postStatsAsyncImpl(level: string | number, value: string | number, payload?: PostStatsPayload): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.STATS_POST_STATS, API_URL.STATS_POST_STATS));
    }

}
