import { StatPeriod } from "../types/stat-types";

/**
 * Payload for getting player stats.
 */
export interface GetStatsPayload {
    /**
     * The period of time over which the stat is tracked.
     */
    period?: StatPeriod;
}
