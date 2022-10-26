import {GameData} from "../types/game-data";

/**
 * Data about the current game state.
 */
export default class GameState {
    private _current: GameData = {
        gameTimer: 0,
        levelName: "",
        levelTimer: 0,
        levelTimerHandle: 0
    };

    /**
     * Timer for the current game session.
     * @returns Time played thus far.
     */
    get gameTimer(): number {
        return this._current.gameTimer;
    }

    /**
     * Starts the game session timer.
     */
    startGameTimer(): void {
        window.setInterval(() => {
            if (document.visibilityState !== "hidden") {
                this._current.gameTimer += 1
            }
        }, 1000);
    }

    /**
     * Name of the level currently being played.
     * @returns Name of the level.
     */
    get levelName(): string {
        return this._current.levelName;
    }

    /**
     * Sets the name of the current level.
     * @param name Name of the level.
     */
    setLevelName(name: string): void {
        this._current.levelName = name;
    }

    /**
     * Timer for the level currently being played.
     * @returns Time played thus far.
     */
    get levelTimer(): number {
        return this._current.levelTimer;
    }

    /**
     * Resets the current level timer to 0.
     */
    resetLevelTimer(): void {
        this._current.levelTimer = 0;
    }

    /**
     * Starts the timer for the current level.
     */
    startLevelTimer(): void {
        this._current.levelTimerHandle = window.setInterval(() => this._current.levelTimer += 1, 1000);
    }

    /**
     * Clears the current level timer handle after stopping the timer.
     */
    clearLevelTimerHandle(): void {
        if (this._current.levelTimerHandle !== null) {
            clearInterval(this._current.levelTimerHandle);
        }
        this._current.levelTimerHandle = 0;
    }
}
