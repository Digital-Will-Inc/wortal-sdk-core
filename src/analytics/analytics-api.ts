import { PlacementType } from "../ads/types/ad-sense-types";
import { AdType } from "../ads/types/ad-type";
import { AnalyticsBase } from "./analytics-base";

/**
 * The Analytics API provides a way to log events in your game. This can be used to track player progress, balance
 * the game, and understand what content the players are interacting with the most.
 * @module Analytics
 */
export class AnalyticsAPI {
    private _analytics: AnalyticsBase;

    constructor(impl: AnalyticsBase) {
        this._analytics = impl;
    }

//#region Public API

    /**
     * Logs a choice the player made in the game. This can be a powerful tool for balancing the game and understanding
     * what content the players are interacting with the most.
     * @example
     * Wortal.analytics.logGameChoice('Character', 'Blue');
     * @param decision Decision the player was faced with.
     * @param choice Choice the player made.
     * @throws {ErrorMessage} See error.message for more details.
     * <ul>
     * <li>INVALID_PARAM</li>
     * </ul>
     */
    public logGameChoice(decision: string, choice: string): void {
        this._analytics.logGameChoice(decision, choice);
    }

    /**
     * Logs the end of a level.
     * To ensure the level timer is recorded the level name must match the name passed into the
     * previous logLevelStart call. If it does not match then the timer will be logged at 0.
     * @example
     * Wortal.analytics.logLevelEnd('Level 3', '100', true);
     * @param level Name of the level.
     * @param score Score the player achieved.
     * @param wasCompleted Was the level completed or not.
     * @throws {ErrorMessage} See error.message for more details.
     * <ul>
     * <li>INVALID_PARAM</li>
     * </ul>
     */
    public logLevelEnd(level: string | number, score: string | number, wasCompleted: boolean): void {
        this._analytics.logLevelEnd(level, score, wasCompleted);
    }

    /**
     * Logs the start of a level.
     * @example
     * Wortal.analytics.logLevelStart('Level 3');
     * @param level Name of the level.
     * @throws {ErrorMessage} See error.message for more details.
     * <ul>
     * <li>INVALID_PARAM</li>
     * </ul>
     */
    public logLevelStart(level: string | number): void {
        this._analytics.logLevelStart(level);
    }

    /**
     * Logs the player achieving a new level.
     * @example
     * Wortal.analytics.logLevelUp('Level 7');
     * @param level Level the player achieved.
     * @throws {ErrorMessage} See error.message for more details.
     * <ul>
     * <li>INVALID_PARAM</li>
     * </ul>
     */
    public logLevelUp(level: string | number): void {
        this._analytics.logLevelUp(level);
    }

    /**
     * Logs the player's purchase of an in-app product.
     * @example
     * Wortal.analytics.logPurchase('com.wortal.game.gems.100', '100 gems from shop sale');
     * @param productID ID of the product the player purchased.
     * @param details Additional details about the purchase.
     * @throws {ErrorMessage} See error.message for more details.
     * <ul>
     * <li>INVALID_PARAM</li>
     * </ul>
     */
    public logPurchase(productID: string, details?: string): void {
        this._analytics.logPurchase(productID, details);
    }

    /**
     * Logs the player's purchase of an in-app subscription.
     * @example
     * Wortal.analytics.logPurchaseSubscription('com.wortal.game.seasonpass', 'Season pass from level up reward UI');
     * @param productID ID of the subscription product the player purchased.
     * @param details Additional details about the purchase.
     * @throws {ErrorMessage} See error.message for more details.
     * <ul>
     * <li>INVALID_PARAM</li>
     * </ul>
     */
    public logPurchaseSubscription(productID: string, details?: string): void {
        this._analytics.logPurchaseSubscription(productID, details);
    }

    /**
     * Logs the player's score.
     * @example
     * Wortal.analytics.logScore('100');
     * @param score Score the player achieved.
     * @throws {ErrorMessage} See error.message for more details.
     * <ul>
     * <li>INVALID_PARAM</li>
     * </ul>
     */
    public logScore(score: string | number): void {
        this._analytics.logScore(score);
    }

    /**
     * Logs the player's social invite.
     * @example
     * Wortal.analytics.logSocialInvite('Leaderboard View');
     * @param placement Placement of the invite.
     */
    public logSocialInvite(placement: string): void {
        this._analytics.logSocialInvite(placement);
    }

    /**
     * Logs the player's social share.
     * @example
     * Wortal.analytics.logSocialShare('Game Over UI');
     * @param placement Placement of the share.
     */
    public logSocialShare(placement: string): void {
        this._analytics.logSocialShare(placement);
    }

    /**
     * Logs the end of a tutorial.
     * To ensure the level timer is recorded the tutorial name must match the name passed into the
     * previous logTutorialStart call. If it does not match then the timer will be logged at 0.
     * @example
     * Wortal.analytics.logTutorialEnd('First Play', true);
     * @param tutorial Name of the tutorial.
     * @param wasCompleted Was the tutorial completed.
     */
    public logTutorialEnd(tutorial: string = "Tutorial", wasCompleted: boolean = true): void {
        this._analytics.logTutorialEnd(tutorial, wasCompleted);
    }

    /**
     * Logs the start of a tutorial.
     * @example
     * Wortal.analytics.logTutorialStart('First Play');
     * @param tutorial Name of the tutorial.
     */
    public logTutorialStart(tutorial: string = "Tutorial"): void {
        this._analytics.logTutorialStart(tutorial);
    }

//#endregion
//#region Internal API

    /** @internal */
    _logGameEnd(): void {
        this._analytics._logGameEnd();
    }

    /** @internal */
    _logGameStart(): void {
        this._analytics._logGameStart();
    }

    /** @internal */
    _logTrafficSource(): void {
        this._analytics._logTrafficSource();
    }

    /** @internal */
    _logAdCall(format: AdType, placement: PlacementType, success: boolean, viewedReward?: boolean): void {
        this._analytics._logAdCall(format, placement, success, viewedReward);
    }

//#endregion
}
