import { GameData } from "../types/game-data";

/** @hidden */
export default class GameState {
    private _current: GameData = {
        gameTimer: 0,
        levelName: "",
        levelTimer: 0,
        levelTimerHandle: 0
    };

    get gameTimer(): number {
        return this._current.gameTimer;
    }

    startGameTimer(): void {
        window.setInterval(() => {
            if (document.visibilityState !== "hidden") {
                this._current.gameTimer += 1
            }
        }, 1000);
    }

    get levelName(): string {
        return this._current.levelName;
    }

    setLevelName(name: string): void {
        this._current.levelName = name;
    }

    get levelTimer(): number {
        return this._current.levelTimer;
    }

    resetLevelTimer(): void {
        this._current.levelTimer = 0;
    }

    startLevelTimer(): void {
        this._current.levelTimerHandle = window.setInterval(() => this._current.levelTimer += 1, 1000);
    }

    clearLevelTimerHandle(): void {
        if (this._current.levelTimerHandle !== null) {
            clearInterval(this._current.levelTimerHandle);
        }
        this._current.levelTimerHandle = 0;
    }
}
