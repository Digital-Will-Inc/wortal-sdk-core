import { AchievementsBase } from "../achievements-base";
import { Achievement } from "../interfaces/achievement";

/**
 * Debug implementation of the Achievements API.
 * @hidden
 */
export class AchievementsDebug extends AchievementsBase {
    protected getAchievementsAsyncImpl(): Promise<Achievement[]> {
        return Promise.resolve(this._getMockAchievements());
    }

    protected unlockAchievementAsyncImpl(achievementName: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    private _getMockAchievements(): Achievement[] {
        return [
            {
                id: "first_win",
                name: "First Win",
                description: "Win your first game",
                isUnlocked: true,
            },
            {
                id: "first_loss",
                name: "First Loss",
                description: "Lose your first game",
                isUnlocked: false,
            },
            {
                id: "first_draw",
                name: "First Draw",
                description: "Draw your first game",
                isUnlocked: false,
            },
        ];
    }

}
