import AnalyticsEvent from "../models/analytics-event";
import { AnalyticsEventData } from "../types/analytics-event";
import { sdk } from "./index";

/**
 * Logs the start of the game. This is called automatically when the SDK is initialized so there is no need
 * to call this in the game.
 */
export function logGameStart(): void {
    sdk.game.startGameTimer();

    let data: AnalyticsEventData = {
        name: 'GameStart',
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
        name: 'GameEnd',
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
 * @example
 * Wortal.analytics.logLevelStart('Level 3');
 * @param level Name of the level.
 */
export function logLevelStart(level: string): void {
    sdk.game.setLevelName(level);
    sdk.game.clearLevelTimerHandle();
    sdk.game.resetLevelTimer();
    sdk.game.startLevelTimer();

    let data: AnalyticsEventData = {
        name: 'LevelStart',
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
 * @example
 * Wortal.analytics.logLevelEnd('Level 3', '100', true);
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
        name: 'LevelEnd',
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
 * @example
 * Wortal.analytics.logTutorialStart('First Play');
 * @param tutorial Name of the tutorial.
 */
export function logTutorialStart(tutorial: string): void {
    sdk.game.setLevelName(tutorial);
    sdk.game.clearLevelTimerHandle();
    sdk.game.resetLevelTimer();
    sdk.game.startLevelTimer();

    let data: AnalyticsEventData = {
        name: 'TutorialStart',
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
 * @example
 * Wortal.analytics.logTutorialEnd('First Play', true);
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
        name: 'TutorialEnd',
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
 * @example
 * Wortal.analytics.logLevelUp('Level 7');
 * @param level Level the player achieved.
 */
export function logLevelUp(level: string): void {
    let data: AnalyticsEventData = {
        name: 'LevelUp',
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
 * @example
 * Wortal.analytics.logScore('100');
 * @param score Score the player achieved.
 */
export function logScore(score: string): void {
    let data: AnalyticsEventData = {
        name: 'PostScore',
        features: {
            game: sdk.session.gameId,
            score: score,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs a choice the player made in the game. This can be a powerful tool for balancing the game and understanding
 * what content the players are interacting with the most.
 * @example
 * Wortal.analytics.logGameChoice('Character', 'Blue');
 * @param decision Decision the player was faced with.
 * @param choice Choice the player made.
 */
export function logGameChoice(decision: string, choice: string): void {
    let data: AnalyticsEventData = {
        name: 'GameChoice',
        features: {
            game: sdk.session.gameId,
            decision: decision,
            choice: choice,
        }
    };
    const event = new AnalyticsEvent(data);
    event.send();
}
