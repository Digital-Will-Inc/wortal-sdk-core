import { PlacementType } from "../ads/types/ad-sense-types";
import { AdType } from "../ads/types/ad-type";
import { API_URL, WORTAL_API } from "../data/core-data";
import { implementationError, invalidParams, notInitialized } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { isValidNumber, isValidString } from "../utils/validators";

/**
 * Base class for analytics implementations. Extend this class to implement analytics for a specific platform.
 * @hidden
 */
export class AnalyticsBase {
//#region Public API

    public logGameChoice(decision: string, choice: string): void {
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_GAME_CHOICE);

        const validation = this.validateLogGameChoice(decision, choice);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logGameChoiceImpl(decision, choice);
    }

    public logLevelEnd(level: string | number, score: string | number, wasCompleted: boolean): void {
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_LEVEL_END);

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
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_LEVEL_START);

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
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_LEVEL_UP);

        const validation = this.validateLogLevelUp(level);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logLevelUpImpl(level);
    }

    public logPurchase(productID: string, details?: string): void {
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_PURCHASE);

        const validation = this.validateLogPurchase(productID, details);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logPurchaseImpl(productID, details);
    }

    public logPurchaseSubscription(productID: string, details?: string): void {
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_PURCHASE_SUBSCRIPTION);

        const validation = this.validateLogPurchaseSubscription(productID, details);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logPurchaseSubscriptionImpl(productID, details);
    }

    public logScore(score: string | number): void {
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_SCORE);

        const validation = this.validateLogScore(score);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logScoreImpl(score);
    }

    public logSocialInvite(placement: string): void {
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_SOCIAL_INVITE);

        const validation = this.validateLogSocialInvite(placement);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logSocialInviteImpl(placement);
    }

    public logSocialShare(placement: string): void {
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_SOCIAL_SHARE);

        const validation = this.validateLogSocialShare(placement);
        if (!validation.valid) {
            throw validation.error;
        }

        this.logSocialShareImpl(placement);
    }

    public logTutorialEnd(tutorial: string = "Tutorial", wasCompleted: boolean = true): void {
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_TUTORIAL_END);

        const validation = this.validateLogTutorialEnd(tutorial, wasCompleted);
        if (!validation.valid) {
            throw validation.error;
        }

        Wortal.session._internalGameState.clearLevelTimerHandle();

        // We need a matching tutorial name to track the time taken to pass the tutorial.
        if (Wortal.session._internalGameState.levelName !== tutorial) {
            Wortal.session._internalGameState.resetLevelTimer();
        }

        this.logTutorialEndImpl(tutorial, wasCompleted);
    }

    public logTutorialStart(tutorial: string = "Tutorial"): void {
        Wortal._log.apiCall(WORTAL_API.ANALYTICS_LOG_TUTORIAL_START);

        const validation = this.validateLogTutorialStart(tutorial);
        if (!validation.valid) {
            throw validation.error;
        }

        Wortal.session._internalGameState.setLevelName(tutorial);
        Wortal.session._internalGameState.clearLevelTimerHandle();
        Wortal.session._internalGameState.resetLevelTimer();
        Wortal.session._internalGameState.startLevelTimer();

        this.logTutorialStartImpl(tutorial);
    }

//#endregion
//#region Internal API

    // No need to validate these, they are internal and may be called before the SDK is initialized.

    _logGameEnd(): void {
        Wortal._log.internalCall("analytics._logGameEnd");

        this._logGameEndImpl();
    }

    _logGameStart(): void {
        Wortal._log.internalCall("analytics._logGameStart");

        Wortal.session._internalGameState.startGameTimer();

        this._logGameStartImpl();
    }

    _logTrafficSource(): void {
        Wortal._log.internalCall("analytics._logTrafficSource");

        this._logTrafficSourceImpl();
    }

    // This is used by all platforms other than Wortal/Debug to log ad call events.
    // We log different events for Wortal platform which are handled within the ad show function itself.
    _logAdCall(format: AdType, placement: PlacementType, success: boolean, viewedReward?: boolean): void {
        Wortal._log.internalCall("analytics._logAdCall");

        this._logAdCallImpl(format, placement, success, viewedReward);
    }

//#endregion
//#region Implementation interface

    protected logGameChoiceImpl(decision: string, choice: string): void { throw implementationError(); }
    protected logLevelEndImpl(level: string | number, score: string | number, wasCompleted: boolean): void { throw implementationError(); }
    protected logLevelStartImpl(level: string | number): void { throw implementationError(); }
    protected logLevelUpImpl(level: string | number): void { throw implementationError(); }
    protected logPurchaseImpl(productID: string, details?: string): void { throw implementationError(); }
    protected logPurchaseSubscriptionImpl(productID: string, details?: string): void { throw implementationError(); }
    protected logScoreImpl(score: string | number): void { throw implementationError(); }
    protected logSocialInviteImpl(placement: string): void { throw implementationError(); }
    protected logSocialShareImpl(placement: string): void { throw implementationError(); }
    protected logTutorialEndImpl(tutorial: string, wasCompleted: boolean): void { throw implementationError(); }
    protected logTutorialStartImpl(tutorial: string): void { throw implementationError(); }

    protected _logGameEndImpl(): void { throw implementationError(); }
    protected _logGameStartImpl(): void { throw implementationError(); }
    protected _logTrafficSourceImpl(): void { throw implementationError(); }
    protected _logAdCallImpl(format: AdType, placement: PlacementType, success: boolean, viewedReward?: boolean): void { throw implementationError(); }

//#endregion
//#region Validation

    protected validateLogGameChoice(decision: string, choice: string): ValidationResult {
        if (!isValidString(decision)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.ANALYTICS_LOG_GAME_CHOICE,
                    API_URL.ANALYTICS_LOG_GAME_CHOICE),
            };
        }

        if (!isValidString(choice)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.ANALYTICS_LOG_GAME_CHOICE,
                    API_URL.ANALYTICS_LOG_GAME_CHOICE),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_GAME_CHOICE,
                    API_URL.ANALYTICS_LOG_GAME_CHOICE),
            };
        }

        return { valid: true };
    }

    protected validateLogLevelEnd(level: string | number, score: string | number, wasCompleted: boolean): ValidationResult {
        if (!isValidString(level) && !isValidNumber(level)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.ANALYTICS_LOG_LEVEL_END,
                    API_URL.ANALYTICS_LOG_LEVEL_END),
            };
        }

        if (!isValidString(score) && !isValidNumber(score)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.ANALYTICS_LOG_LEVEL_END,
                    API_URL.ANALYTICS_LOG_LEVEL_END),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_LEVEL_END,
                    API_URL.ANALYTICS_LOG_LEVEL_END),
            };
        }

        return { valid: true };
    }

    protected validateLogLevelStart(level: string | number): ValidationResult {
        if (!isValidString(level) && !isValidNumber(level)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.ANALYTICS_LOG_LEVEL_START,
                    API_URL.ANALYTICS_LOG_LEVEL_START),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_LEVEL_START,
                    API_URL.ANALYTICS_LOG_LEVEL_START),
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

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_LEVEL_UP,
                    API_URL.ANALYTICS_LOG_LEVEL_UP),
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

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_PURCHASE,
                    API_URL.ANALYTICS_LOG_PURCHASE),
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

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_PURCHASE_SUBSCRIPTION,
                    API_URL.ANALYTICS_LOG_PURCHASE_SUBSCRIPTION),
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

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_SCORE,
                    API_URL.ANALYTICS_LOG_SCORE),
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

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_SOCIAL_INVITE,
                    API_URL.ANALYTICS_LOG_SOCIAL_INVITE),
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

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_SOCIAL_SHARE,
                    API_URL.ANALYTICS_LOG_SOCIAL_SHARE),
            };
        }

        return { valid: true };
    }

    protected validateLogTutorialEnd(tutorial: string, wasCompleted: boolean): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_TUTORIAL_END,
                    API_URL.ANALYTICS_LOG_TUTORIAL_END),
            };
        }

        return { valid: true };
    }

    protected validateLogTutorialStart(tutorial: string): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.ANALYTICS_LOG_TUTORIAL_START,
                    API_URL.ANALYTICS_LOG_TUTORIAL_START),
            };
        }

        return { valid: true };
    }

//#endregion
}
