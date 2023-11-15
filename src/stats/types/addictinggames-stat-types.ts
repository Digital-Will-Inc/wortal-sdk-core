/**
 * Type of stat.
 * @hidden
 */
export type StatType_AddictingGames = "standard" | "weekly";

/**
 * Types of formats the stat value can be returned in.
 * - `default` - 00:01:05.5
 * - `shortDuration` - 1m 5.5s
 * - `longDuration` - 1 minute, 5.5 seconds
 * - `seconds` - 65.5s
 * - `ms` - 65500
 * @hidden
 */
export type StatFormat_AddictingGames = "default" | "shortDuration" | "longDuration" | "seconds" | "ms";

/**
 * The mode of the stat.
 * - `default` - The stat is displayed normally.
 * - `first` - Stat with mode of first will only display the first stat for a day in the leaderboards.
 * @hidden
 */
export type StatMode_AddictingGames = "default" | "first";
