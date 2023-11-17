/**
 * Types of achievements.
 * - Single: The achievement is unlocked when the user reaches a certain value.
 * - Incremental: The achievement is unlocked when the user reaches a certain value, but the value can be increased. Ex: Win 5 games, Win 10 games, etc.
 */
export type AchievementType = "single" | "incremental";
