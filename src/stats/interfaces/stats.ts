import { StatPeriod, StatValueType } from "../types/stat-types";

/**
 * Represents the stats of a player.
 */
export interface Stats {
    /**
     * Name of the level the stats are for.
     */
    level: string;
    /**
     * The value of the stat.
     */
    value: number;
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
