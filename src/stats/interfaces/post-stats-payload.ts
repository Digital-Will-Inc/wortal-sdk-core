import { StatPeriod, StatValueType } from "../types/stat-types";

/**
 * Payload used to post a player's stats.
 */
export interface PostStatsPayload {
    /**
     * The period of time over which the stat is tracked.
     */
    period?: StatPeriod;
    /**
     * The type of stat this value represents.
     */
    valueType?: StatValueType;
    /**
     * Whether a lower value is a better value for this stat. Ex: time to complete a level.
     */
    lowerIsBetter?: boolean;
}
