import AnalyticsEvent from "../models/analytics-event";
import {AnalyticsEventData, AnalyticsEventType} from "../types/analytics-event";
import {sdk} from "./index";

/**
 * Logs the start of the game. This is called automatically when the SDK is initialized so there is no need
 * to call this in the game.
 */
export function logGameStart(): void {
    sdk.game.startGameTimer();

    let data: AnalyticsEventData = {
        name: AnalyticsEventType.GAME_START,
        features: {
            game: sdk.session.gameId,
            browser: sdk.session.browser,
            platform: sdk.session.platform,
            country: sdk.session.country,
            player: sdk.player.id,
            isFirstPlay: sdk.player.isFirstPlay,
            daysSinceFirstPlay: sdk.player.daysSinceFirstPlay,
            isAdBlocked: sdk.adConfig.isAdBlocked,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs the end of the game. This is called automatically when the document state changes to hidden so there is no
 * need to call this in the game.
 */
export function logGameEnd(): void {
    let data: AnalyticsEventData = {
        name: AnalyticsEventType.GAME_END,
        features: {
            game: sdk.session.gameId,
            timePlayed: sdk.game.gameTimer,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs the start of a level.
 * @param level Name of the level.
 */
export function logLevelStart(level: string): void {
    sdk.game.setLevelName(level);
    sdk.game.clearLevelTimerHandle();
    sdk.game.resetLevelTimer();
    sdk.game.startLevelTimer();

    let data: AnalyticsEventData = {
        name: AnalyticsEventType.LEVEL_START,
        features: {
            game: sdk.session.gameId,
            level: level,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs the end of a level.
 * To ensure the level timer is recorded the level name must match the name passed into the
 * previous logLevelStart call. If it does not match then the timer will be logged at 0.
 * @param level Name of the level.
 * @param score Score the player achieved.
 * @param wasCompleted Was the level completed or not.
 */
export function logLevelEnd(level: string, score: string, wasCompleted: boolean): void {
    sdk.game.clearLevelTimerHandle();

    // We need a matching level name to track the time taken to pass the level.
    if (sdk.game.levelName !== level) {
        sdk.game.resetLevelTimer();
    }

    let data: AnalyticsEventData = {
        name: AnalyticsEventType.LEVEL_END,
        features: {
            game: sdk.session.gameId,
            level: level,
            score: score,
            wasCompleted: wasCompleted,
            time: sdk.game.levelTimer,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs the start of a tutorial.
 * @param tutorial Name of the tutorial.
 */
export function logTutorialStart(tutorial: string): void {
    sdk.game.setLevelName(tutorial);
    sdk.game.clearLevelTimerHandle();
    sdk.game.resetLevelTimer();
    sdk.game.startLevelTimer();

    let data: AnalyticsEventData = {
        name: AnalyticsEventType.TUTORIAL_START,
        features: {
            game: sdk.session.gameId,
            tutorial: tutorial,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs the end of a tutorial.
 * To ensure the level timer is recorded the tutorial name must match the name passed into the
 * previous logTutorialStart call. If it does not match then the timer will be logged at 0.
 * @param tutorial Name of the tutorial.
 * @param wasCompleted Was the tutorial completed.
 */
export function logTutorialEnd(tutorial: string, wasCompleted: boolean): void {
    sdk.game.clearLevelTimerHandle();

    // We need a matching tutorial name to track the time taken to pass the tutorial.
    if (sdk.game.levelName !== tutorial) {
        sdk.game.resetLevelTimer();
    }

    let data: AnalyticsEventData = {
        name: AnalyticsEventType.TUTORIAL_END,
        features: {
            game: sdk.session.gameId,
            tutorial: tutorial,
            wasCompleted: wasCompleted,
            time: sdk.game.levelTimer,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs the player achieving a new level.
 * @param level Level the player achieved.
 */
export function logLevelUp(level: string): void {
    let data: AnalyticsEventData = {
        name: AnalyticsEventType.LEVEL_UP,
        features: {
            game: sdk.session.gameId,
            level: level,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs the player's score.
 * @param score Score the player achieved.
 */
export function logScore(score: string): void {
    let data: AnalyticsEventData = {
        name: AnalyticsEventType.POST_SCORE,
        features: {
            game: sdk.session.gameId,
            score: score,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs a choice the player made in the game.
 * @param decision Decision the player was faced with.
 * @param choice Choice the player made.
 *
 * @example logGameChoice("Character", "Blue");
 */
export function logGameChoice(decision: string, choice: string): void {
    let data: AnalyticsEventData = {
        name: AnalyticsEventType.GAME_CHOICE,
        features: {
            game: sdk.session.gameId,
            decision: decision,
            choice: choice,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}
