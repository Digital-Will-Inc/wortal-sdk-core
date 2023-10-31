import { API_URL, WORTAL_API } from "../data/core-data";
import { invalidParams } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { apiCall, internalCall, warn } from "../utils/logger";
import { isValidNumber, isValidString } from "../utils/validators";

/**
 * Base class for analytics implementations. Extend this class to implement analytics for a specific platform.
 * @hidden
 */
export abstract class AnalyticsBase {
    constructor() {
    }

//#region Public API

    public logGameChoice(decision: string, choice: string): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_GAME_CHOICE);

        const validation = this.validateLogGameChoice(decision, choice);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logGameChoiceImpl(decision, choice);
    }

    public logLevelEnd(level: string | number, score: string | number, wasCompleted: boolean): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_LEVEL_END);

        const validation = this.validateLogLevelEnd(level, score, wasCompleted);
        if (!validation.valid) {
            throw validation.error;
        }

        if (typeof level === "number") {
            level = level.toString();
        }

        Wortal.session._internalGameState.clearLevelTimerHandle();

        // We need a matching level name to track the time taken to pass the level.
        if (Wortal.session._internalGameState.levelName !== level) {
            Wortal.session._internalGameState.resetLevelTimer();
        }

        this.logLevelEndImpl(level, score, wasCompleted);
    }

    public logLevelStart(level: string | number): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_LEVEL_START);

        const validation = this.validateLogLevelStart(level);
        if (!validation.valid) {
            throw validation.error;
        }

        if (typeof level === "number") {
            level = level.toString();
        }

        Wortal.session._internalGameState.setLevelName(level);
        Wortal.session._internalGameState.clearLevelTimerHandle();
        Wortal.session._internalGameState.resetLevelTimer();
        Wortal.session._internalGameState.startLevelTimer();

        this.logLevelStartImpl(level);
    }

    public logLevelUp(level: string | number): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_LEVEL_UP);

        const validation = this.validateLogLevelUp(level);
        if (!validation.valid) {
            throw validation.error;
        }

        // We report levels to GamePix via this analytics call because it's the closest API we have to
        // match theirs. This is done so that we don't have to ask game devs to change their code.
        //TODO: move this elsewhere (Stats API?)
        if (Wortal._internalPlatform === "gamepix") {
            if (!isValidNumber(level)) {
                const levelNumber = this._convertStringToNumber(level);
                if (levelNumber) {
                    Wortal._internalPlatformSDK.updateLevel(levelNumber);
                } else {
                    throw invalidParams(`GamePix requires a number for the level param, but one could not be extracted from the arg: ${level}`,
                        WORTAL_API.ANALYTICS_LOG_SCORE, API_URL.ANALYTICS_LOG_SCORE);
                }
            }
        }

        this.logLevelUpImpl(level);
    }

    public logPurchase(productID: string, details?: string): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_PURCHASE);

        const validation = this.validateLogPurchase(productID, details);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logPurchaseImpl(productID, details);
    }

    public logPurchaseSubscription(productID: string, details?: string): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_PURCHASE_SUBSCRIPTION);

        const validation = this.validateLogPurchaseSubscription(productID, details);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logPurchaseSubscriptionImpl(productID, details);
    }

    public logScore(score: string | number): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_SCORE);

        const validation = this.validateLogScore(score);
        if (!validation.valid) {
            throw validation.error;
        }

        // We report scores to GamePix via this analytics call because it's the closest API we have to
        // match theirs. This is done so that we don't have to ask game devs to change their code.
        //TODO: move this elsewhere (Stats API?)
        if (Wortal._internalPlatform === "gamepix") {
            if (!isValidNumber(score)) {
                const scoreNumber = this._convertStringToNumber(score);
                if (scoreNumber) {
                    Wortal._internalPlatformSDK.updateScore(scoreNumber);
                } else {
                    throw invalidParams(`GamePix requires a number for the score param, but one could not be extracted from the arg: ${score}`,
                        WORTAL_API.ANALYTICS_LOG_SCORE, API_URL.ANALYTICS_LOG_SCORE);
                }
            }
        }

        this.logScoreImpl(score);
    }

    public logSocialInvite(placement: string): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_SOCIAL_INVITE);

        const validation = this.validateLogSocialInvite(placement);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logSocialInviteImpl(placement);
    }

    public logSocialShare(placement: string): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_SOCIAL_SHARE);

        const validation = this.validateLogSocialShare(placement);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logSocialShareImpl(placement);
    }

    public logTutorialEnd(tutorial: string = "Tutorial", wasCompleted: boolean = true): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_TUTORIAL_END);

        Wortal.session._internalGameState.clearLevelTimerHandle();

        // We need a matching tutorial name to track the time taken to pass the tutorial.
        if (Wortal.session._internalGameState.levelName !== tutorial) {
            Wortal.session._internalGameState.resetLevelTimer();
        }

        this.logTutorialEndImpl(tutorial, wasCompleted);
    }

    public logTutorialStart(tutorial: string = "Tutorial"): void {
        apiCall(WORTAL_API.ANALYTICS_LOG_TUTORIAL_START);

        Wortal.session._internalGameState.setLevelName(tutorial);
        Wortal.session._internalGameState.clearLevelTimerHandle();
        Wortal.session._internalGameState.resetLevelTimer();
        Wortal.session._internalGameState.startLevelTimer();

        this.logTutorialStartImpl(tutorial);
    }

//#endregion
//#region Internal API

    _logGameEnd(): void {
        internalCall("analytics._logGameEnd");

        this._logGameEndImpl();
    }

    _logGameStart(): void {
        internalCall("analytics._logGameStart");

        Wortal.session._internalGameState.startGameTimer();

        this._logGameStartImpl();
    }

    _logTrafficSource(): void {
        internalCall("analytics._logTrafficSource");

        this._logTrafficSourceImpl();
    }

//#endregion
//#region Implementation interface

    protected abstract logGameChoiceImpl(decision: string, choice: string): void;
    protected abstract logLevelEndImpl(level: string | number, score: string | number, wasCompleted: boolean): void;
    protected abstract logLevelStartImpl(level: string | number): void;
    protected abstract logLevelUpImpl(level: string | number): void;
    protected abstract logPurchaseImpl(productID: string, details?: string): void;
    protected abstract logPurchaseSubscriptionImpl(productID: string, details?: string): void;
    protected abstract logScoreImpl(score: string | number): void;
    protected abstract logSocialInviteImpl(placement: string): void;
    protected abstract logSocialShareImpl(placement: string): void;
    protected abstract logTutorialEndImpl(tutorial: string, wasCompleted: boolean): void;
    protected abstract logTutorialStartImpl(tutorial: string): void;

    protected abstract _logGameEndImpl(): void;
    protected abstract _logGameStartImpl(): void;
    protected abstract _logTrafficSourceImpl(): void;

//#endregion
//#region Validation

    protected validateLogGameChoice(decision: string, choice: string): ValidationResult {
        if (!isValidString(decision)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_GAME_CHOICE, API_URL.ANALYTICS_LOG_GAME_CHOICE),
            };
        }

        if (!isValidString(choice)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_GAME_CHOICE, API_URL.ANALYTICS_LOG_GAME_CHOICE),
            };
        }

        return { valid: true };
    }

    protected validateLogLevelEnd(level: string | number, score: string | number, wasCompleted: boolean): ValidationResult {
        if (!isValidString(level) && !isValidNumber(level)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_LEVEL_END, API_URL.ANALYTICS_LOG_LEVEL_END),
            };
        }

        if (!isValidString(score) && !isValidNumber(score)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_LEVEL_END, API_URL.ANALYTICS_LOG_LEVEL_END),
            };
        }

        return { valid: true };
    }

    protected validateLogLevelStart(level: string | number): ValidationResult {
        if (!isValidString(level) && !isValidNumber(level)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_LEVEL_START, API_URL.ANALYTICS_LOG_LEVEL_START),
            };
        }

        return { valid: true };
    }

    protected validateLogLevelUp(level: string | number): ValidationResult {
        if (!isValidString(level) && !isValidNumber(level)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_LEVEL_UP, API_URL.ANALYTICS_LOG_LEVEL_UP),
            };
        }

        return { valid: true };
    }

    protected validateLogPurchase(productID: string, details?: string): ValidationResult {
        if (!isValidString(productID)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_PURCHASE, API_URL.ANALYTICS_LOG_PURCHASE),
            };
        }

        return { valid: true };
    }

    protected validateLogPurchaseSubscription(productID: string, details?: string): ValidationResult {
        if (!isValidString(productID)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_PURCHASE_SUBSCRIPTION, API_URL.ANALYTICS_LOG_PURCHASE_SUBSCRIPTION),
            };
        }

        return { valid: true };
    }

    protected validateLogScore(score: string | number): ValidationResult {
        if (!isValidString(score) && !isValidNumber(score)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_SCORE, API_URL.ANALYTICS_LOG_SCORE),
            };
        }

        return { valid: true };
    }

    protected validateLogSocialInvite(placement: string): ValidationResult {
        if (!isValidString(placement)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_SOCIAL_INVITE, API_URL.ANALYTICS_LOG_SOCIAL_INVITE),
            };
        }

        return { valid: true };
    }

    protected validateLogSocialShare(placement: string): ValidationResult {
        if (!isValidString(placement)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.ANALYTICS_LOG_SOCIAL_SHARE, API_URL.ANALYTICS_LOG_SOCIAL_SHARE),
            };
        }

        return { valid: true };
    }

//#endregion
//#region Utils

    /**
     * Attempts to convert a string to a number. This will extract the first number from the string.
     * @example
     * convertStringToNumber("Level 1") // 1
     * convertStringToNumber("100 points") // 100
     * @param value String to convert. Passing a non-string will result in a warning and null being returned.
     * @returns {number|null} The first number extracted from the string, or null if no number was found.
     * @hidden
     */
    private _convertStringToNumber(value: any): number | null {
        if (typeof value !== "string") {
            warn(`convertStringToNumber: value is not a string. (value: ${value})`, typeof value);
            return null;
        }

        const match = value.match(/\d+/);
        if (match) {
            const result = parseInt(match[0], 10);
            if (isNaN(result)) {
                return null;
            } else {
                return result;
            }
        } else {
            return null;
        }
    }

//#endregion
}
