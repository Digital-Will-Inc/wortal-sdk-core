import Wortal from "../index";
import AnalyticsEvent from "../models/analytics-event";
import { AnalyticsEventData } from "../types/analytics-event";
import { invalidParams } from "../utils/error-handler";
import { isValidNumber, isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Logs the start of the game. This is called automatically when the SDK is initialized so there is no need
 * to call this in the game.
 */
export function logGameStart(): void {
    config.game.startGameTimer();

    let data: AnalyticsEventData = {
        name: 'GameStart',
        features: {
            game: config.session.gameId,
            browser: config.session.browser,
            platform: config.session.platform,
            country: config.session.country,
            player: config.player.id,
            isFirstPlay: config.player.isFirstPlay,
            daysSinceFirstPlay: config.player.daysSinceFirstPlay,
            isAdBlocked: config.adConfig.isAdBlocked,
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
            game: config.session.gameId,
            timePlayed: config.game.gameTimer,
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
 * @throws {ErrorMessage} See error.message for more details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * </ul>
 */
export function logLevelStart(level: string | number): void {
    if (!isValidString(level) && !isValidNumber(level)) {
        throw invalidParams("level cannot be null or empty", "analytics.logLevelStart");
    }

    if (typeof level === "number") {
        level = level.toString();
    }

    config.game.setLevelName(level);
    config.game.clearLevelTimerHandle();
    config.game.resetLevelTimer();
    config.game.startLevelTimer();

    let data: AnalyticsEventData = {
        name: 'LevelStart',
        features: {
            game: config.session.gameId,
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
 * @throws {ErrorMessage} See error.message for more details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * </ul>
 */
export function logLevelEnd(level: string | number, score: string | number, wasCompleted: boolean): void {
    if (!isValidString(level) && !isValidNumber(level)) {
        throw invalidParams("level cannot be null or empty", "analytics.logLevelEnd");
    }

    if (typeof level === "number") {
        level = level.toString();
    }

    config.game.clearLevelTimerHandle();

    // We need a matching level name to track the time taken to pass the level.
    if (config.game.levelName !== level) {
        config.game.resetLevelTimer();
    }

    let data: AnalyticsEventData = {
        name: 'LevelEnd',
        features: {
            game: config.session.gameId,
            level: level,
            score: score,
            wasCompleted: wasCompleted,
            time: config.game.levelTimer,
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
    config.game.setLevelName(tutorial);
    config.game.clearLevelTimerHandle();
    config.game.resetLevelTimer();
    config.game.startLevelTimer();

    let data: AnalyticsEventData = {
        name: 'TutorialStart',
        features: {
            game: config.session.gameId,
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
    config.game.clearLevelTimerHandle();

    // We need a matching tutorial name to track the time taken to pass the tutorial.
    if (config.game.levelName !== tutorial) {
        config.game.resetLevelTimer();
    }

    let data: AnalyticsEventData = {
        name: 'TutorialEnd',
        features: {
            game: config.session.gameId,
            tutorial: tutorial,
            wasCompleted: wasCompleted,
            time: config.game.levelTimer,
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
 * @throws {ErrorMessage} See error.message for more details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * </ul>
 */
export function logLevelUp(level: string | number): void {
    if (!isValidString(level) && !isValidNumber(level)) {
        throw invalidParams("level cannot be null or empty", "analytics.logLevelUp");
    }

    let data: AnalyticsEventData = {
        name: 'LevelUp',
        features: {
            game: config.session.gameId,
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
 * @throws {ErrorMessage} See error.message for more details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * </ul>
 */
export function logScore(score: string | number): void {
    if (!isValidString(score) && !isValidNumber(score)) {
        throw invalidParams("score cannot be null or empty", "analytics.logScore");
    }

    let data: AnalyticsEventData = {
        name: 'PostScore',
        features: {
            game: config.session.gameId,
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
 * @throws {ErrorMessage} See error.message for more details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * </ul>
 */
export function logGameChoice(decision: string, choice: string): void {
    if (!isValidString(decision)) {
        throw invalidParams("decision cannot be null or empty", "analytics.logGameChoice");
    } else if (!isValidString(choice)) {
        throw invalidParams("choice cannot be null or empty", "analytics.logGameChoice");
    }

    let data: AnalyticsEventData = {
        name: 'GameChoice',
        features: {
            game: config.session.gameId,
            decision: decision,
            choice: choice,
        }
    };

    const event = new AnalyticsEvent(data);
    event.send();
}

/**
 * Logs the player's entry point and traffic source data. This is called automatically when the SDK is initialized
 * so there is no need to call this in the game.
 */
export function logTrafficSource(): void {
    if (config.session.platform == "viber" || config.session.platform == "link") {
        Wortal.session.getEntryPointAsync()
            .then((entryPoint) => {
                let data: AnalyticsEventData = {
                    name: "TrafficSource",
                    features: {
                        entryPoint: entryPoint,
                        data: JSON.stringify(Wortal.session.getTrafficSource()),
                    }
                };
                const event = new AnalyticsEvent(data);
                event.send();
            })
            .catch((err) => {
                // Even if we get an error we should still try and send the traffic source.
                // We don't need to rethrow the error because the SDK plugins should not be calling this API.
                console.log(err);
                let data: AnalyticsEventData = {
                    name: "TrafficSource",
                    features: {
                        entryPoint: "unknown/error",
                        data: JSON.stringify(Wortal.session.getTrafficSource()),
                    }
                };
                const event = new AnalyticsEvent(data);
                event.send();
            });
    }
}
