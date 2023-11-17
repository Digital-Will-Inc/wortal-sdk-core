import { API_URL, WORTAL_API } from "../../data/core-data";
import { rethrowError_AddictingGames } from "../../errors/error-handler";
import { ErrorMessage_AddictingGames } from "../../errors/interfaces/addictinggames-error";
import Wortal from "../../index";
import { GetStatsPayload_AddictingGames } from "../interfaces/addictinggames-get-stats-payload";
import { StatConfig_AddictingGames } from "../interfaces/addictinggames-stat-config";
import { GetStatsPayload } from "../interfaces/get-stats-payload";
import { PostStatsPayload } from "../interfaces/post-stats-payload";
import { Stats } from "../interfaces/stats";
import { StatsBase } from "../stats-base";

/**
 * AddictingGames implementation of the Stats API.
 * @hidden
 */
export class StatsAddictingGames extends StatsBase {
    protected getStatsAsyncImpl(level: string | number, payload?: GetStatsPayload): Promise<Stats[]> {
        Wortal._internalPlatformSDK.getScoreCategories()
            .then((categories: any) => {
                console.log(categories);
            })
            .catch((error: any) => {
                console.log(error);
            });

        const options: GetStatsPayload_AddictingGames = {
            level_key: level.toString(),
        };

        return Wortal._internalPlatformSDK.getScores(options)
            .then((stats: StatConfig_AddictingGames[]) => {
                console.log(stats);
            })
            .catch((error: ErrorMessage_AddictingGames) => {
                throw rethrowError_AddictingGames(error, WORTAL_API.STATS_GET_STATS_ASYNC, API_URL.STATS_GET_STATS_ASYNC);
            });
    }

    protected postStatsAsyncImpl(level: string | number, value: number, payload?: PostStatsPayload): Promise<void> {
        return Wortal._internalPlatformSDK.postScore(level.toString(), value, payload)
            .catch((error: ErrorMessage_AddictingGames) => {
                throw rethrowError_AddictingGames(error, WORTAL_API.STATS_POST_STATS_ASYNC, API_URL.STATS_POST_STATS_ASYNC);
            });
    }

}
