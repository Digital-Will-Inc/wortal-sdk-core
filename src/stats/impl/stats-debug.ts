import { GetStatsPayload } from "../interfaces/get-stats-payload";
import { PostStatsPayload } from "../interfaces/post-stats-payload";
import { Stats } from "../interfaces/stats";
import { StatsBase } from "../stats-base";

/**
 * Debug implementation of the Stats API.
 * @hidden
 */
export class StatsDebug extends StatsBase {
    protected getStatsAsyncImpl(level: string | number, payload?: GetStatsPayload): Promise<Stats[]> {
        return Promise.resolve(this._getMockStats());
    }

    protected postStatsAsyncImpl(level: string | number, value: number, payload?: PostStatsPayload): Promise<void> {
        return Promise.resolve();
    }

    private _getMockStats(): Stats[] {
        return [
            {
                level: "Level 1",
                value: 100,
                period: "alltime",
            },
            {
                level: "Level 2",
                value: 200,
                period: "daily",
            },
            {
                level: "Level 3",
                value: 300,
                period: "weekly",
                valueType: "time",
                lowerIsBetter: true,
            },
        ];
    }

}
