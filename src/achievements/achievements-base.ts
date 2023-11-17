import { API_URL, WORTAL_API } from "../data/core-data";
import { invalidParams } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import { apiCall } from "../utils/logger";
import { isValidString } from "../utils/validators";
import { Achievement } from "./interfaces/achievement";

/**
 * Base implementation for the Achievements API. Extend this class to implement the Achievements API for a specific platform.
 * @hidden
 */
export abstract class AchievementsBase {
    constructor() {
    }

//#region Public API

    public getAchievementsAsync(): Promise<Achievement[]> {
        apiCall(WORTAL_API.ACHIEVEMENTS_GET_ACHIEVEMENTS_ASYNC);

        return this.getAchievementsAsyncImpl();
    }

    public unlockAchievementAsync(achievementName: string): Promise<boolean> {
        apiCall(WORTAL_API.ACHIEVEMENTS_UNLOCK_ACHIEVEMENT_ASYNC);

        const validationResult = this.validateUnlockAchievement(achievementName);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.unlockAchievementAsyncImpl(achievementName);
    }

//#endregion
//#region Implementation interface

    protected abstract getAchievementsAsyncImpl(): Promise<Achievement[]>;
    protected abstract unlockAchievementAsyncImpl(achievementName: string): Promise<boolean>;

//#endregion
//#region Validation

    protected validateUnlockAchievement(achievementName: string): ValidationResult {
        if (!isValidString(achievementName)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ACHIEVEMENTS_UNLOCK_ACHIEVEMENT_ASYNC, API_URL.ACHIEVEMENTS_UNLOCK_ACHIEVEMENT_ASYNC),
            };
        }

        return { valid: true };
    }

//#endregion
}
