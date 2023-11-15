import { AchievementType } from "../types/achievement-types";

/**
 * Represents an achievement in-game.
 */
export interface Achievement {
    /**
     * The id of the achievement.
     */
    id: string;
    /**
     * The display name of the achievement.
     */
    name: string;
    /**
     * Whether the achievement is unlocked.
     */
    isUnlocked: boolean;
    /**
     * The description of the achievement.
     */
    description?: string;
    /**
     * The type of the achievement.
     */
    type?: AchievementType;
}
