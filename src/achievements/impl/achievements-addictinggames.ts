import Wortal from "../../index";
import { exception } from "../../utils/logger";
import { AchievementsBase } from "../achievements-base";
import { Achievement } from "../interfaces/achievement";

/**
 * AddictingGames implementation of the Achievements API.
 * @hidden
 */
export class AchievementsAddictingGames extends AchievementsBase {
    protected getAchievementsAsyncImpl(): Promise<Achievement[]> {
        return Wortal._internalPlatformSDK.getAchievementCategories()
            .then((categories: any) => {
                console.log(categories);
                Wortal._internalPlatformSDK.getUserAchievements()
                    .then((achievements: any) => {
                        console.log(achievements);
                        return [];
                    })
                    .catch((error: any) => {
                        exception(error);
                        return [];
                    });
            })
            .catch((error: any) => {
                exception(error);
                return [];
            });
    }

    protected unlockAchievementAsyncImpl(achievementName: string): Promise<boolean> {
        return Wortal._internalPlatformSDK.postAchievement(achievementName)
            .then(() => true)
            .catch((error: any) => {
                exception(error);
                return false;
            });
    }

}
