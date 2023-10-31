import { GameData } from "../interfaces/game-data";

/**
 * Contains data about the state of the game such as timers and analytics data.
 * @hidden
 */
export class GameState {
    private _data: GameData = {
        gameTimer: 0,
        levelName: "",
        levelTimer: 0,
        levelTimerHandle: 0,
        gameLoadTimer: 0,
    };

    get gameTimer(): number {
        return this._data.gameTimer;
    }

    get gameLoadTimer(): number {
        return this._data.gameLoadTimer;
    }

    startGameTimer(): void {
        window.setInterval(() => {
            if (document.visibilityState !== "hidden") {
                this._data.gameTimer += 1
            }
        }, 1000);
    }

    startGameLoadTimer(): void {
        this._data.gameLoadTimer = performance.now();
    }

    stopGameLoadTimer(): void {
        this._data.gameLoadTimer = performance.now() - this._data.gameLoadTimer;
    }

    get levelName(): string {
        return this._data.levelName;
    }

    setLevelName(name: string): void {
        this._data.levelName = name;
    }

    get levelTimer(): number {
        return this._data.levelTimer;
    }

    resetLevelTimer(): void {
        this._data.levelTimer = 0;
    }

    startLevelTimer(): void {
        this._data.levelTimerHandle = window.setInterval(() => this._data.levelTimer += 1, 1000);
    }

    clearLevelTimerHandle(): void {
        if (this._data.levelTimerHandle !== null) {
            clearInterval(this._data.levelTimerHandle);
        }
        this._data.levelTimerHandle = 0;
    }
}
