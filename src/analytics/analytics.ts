/**
 * Interface for Wortal analytics. Sends analytics events to the Wortal backend for reporting.
 */
export interface Analytics {
    /**
     * Logs the start of the game session.
     */
    logGameStart(): void;

    /**
     * Logs the end of the game session.
     */
    logGameEnd(): void;

    /**
     * Logs the start of a level.
     * @param level Name of the level.
     */
    logLevelStart(level: string): void;

    /**
     * Logs the end of a level.
     * @param level Name of the level. If the same name as the last logLevelStart call
     * this will track the time spent in the level.
     * @param score Score the player achieved.
     * @param wasCompleted Was the level completed.
     */
    logLevelEnd(level: string, score: string, wasCompleted: boolean): void;

    /**
     * Logs the start of a tutorial.
     * @param tutorial Name of the tutorial.
     */
    logTutorialStart(tutorial: string): void;

    /**
     * Logs the end of a tutorial.
     * @param tutorial Name of the tutorial. If the same name as the last logTutorialStart call
     * this will track the time spent in the level.
     */
    logTutorialEnd(tutorial: string): void;

    /**
     * Logs the player leveling up.
     * @param level Level achieved.
     */
    logLevelUp(level: string): void;

    /**
     * Logs the player's score.
     * @param score Score achieved.
     */
    logScore(score: string): void;

    /**
     * Logs a choice the player made in the game. This can be used to analyze how players are interacting with the
     * game and help with game balancing.
     * @param decision Decision the player was faced with.
     * @param choice Choice the player made.
     */
    logGameChoice(decision: string, choice: string): void;
}
