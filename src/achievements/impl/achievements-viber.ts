import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { AchievementsBase } from "../achievements-base";
import { Achievement } from "../interfaces/achievement";

/**
 * Viber implementation of the Achievements API.
 * @hidden
 */
export class AchievementsViber extends AchievementsBase {
    protected getAchievementsAsyncImpl(): Promise<Achievement[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.ACHIEVEMENTS_GET_ACHIEVEMENTS, API_URL.ACHIEVEMENTS_GET_ACHIEVEMENTS));
    }

    protected unlockAchievementAsyncImpl(achievementName: string): Promise<boolean> {
        return Promise.reject(notSupported(undefined, WORTAL_API.ACHIEVEMENTS_UNLOCK_ACHIEVEMENT, API_URL.ACHIEVEMENTS_UNLOCK_ACHIEVEMENT));
    }

}
