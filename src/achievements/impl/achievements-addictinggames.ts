import { API_URL, WORTAL_API } from "../../data/core-data";
import { rethrowError_AddictingGames } from "../../errors/error-handler";
import { ErrorMessage_AddictingGames } from "../../errors/interfaces/addictinggames-error";
import Wortal from "../../index";
import { AchievementsBase } from "../achievements-base";
import { Achievement } from "../interfaces/achievement";
import { Achievement_AddictingGames } from "../interfaces/achievement-addictinggames";

/**
 * AddictingGames implementation of the Achievements API.
 * @hidden
 */
export class AchievementsAddictingGames extends AchievementsBase {
    protected getAchievementsAsyncImpl(): Promise<Achievement[]> {
        return Wortal._internalPlatformSDK.getUserAchievements()
            .then((achievements: Achievement_AddictingGames[]) => {
                return achievements.map((achievement: Achievement_AddictingGames) => {
                    return this._convertToWortalAchievement(achievement);
                });
            })
            .catch((error: ErrorMessage_AddictingGames) => {
                return rethrowError_AddictingGames(error, WORTAL_API.ACHIEVEMENTS_GET_ACHIEVEMENTS_ASYNC, API_URL.ACHIEVEMENTS_GET_ACHIEVEMENTS_ASYNC);
            });
    }

    protected unlockAchievementAsyncImpl(achievementName: string): Promise<boolean> {
        return Wortal._internalPlatformSDK.postAchievement(achievementName)
            .then(() => true)
            .catch((error: ErrorMessage_AddictingGames) => {
                return rethrowError_AddictingGames(error, WORTAL_API.ACHIEVEMENTS_UNLOCK_ACHIEVEMENT_ASYNC, API_URL.ACHIEVEMENTS_UNLOCK_ACHIEVEMENT_ASYNC);
            });
    }

    private _convertToWortalAchievement(achievement: Achievement_AddictingGames): Achievement {
        return {
            id: achievement.achievement_key, // There is an _id, but achievement_key is more useful as it's human-readable.
            name: achievement.name,
            isUnlocked: achievement.user_achieved,
            description: achievement.description,
            type: "single", // AddictingGames doesn't differentiate between single and incremental achievements
        };
    }

}
