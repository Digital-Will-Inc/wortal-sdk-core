import { GameData } from "../interfaces/session";
import { Platform, SessionData } from "../types/session";
// @ts-ignore
import country from "../utils/intl-data.json";

/** @hidden */
export class Session {
    private _current: SessionData = {
        country: "",
        platform: "debug",
        gameId: "",
        browser: "",
    };

    constructor() {
        this._current.country = this._setCountry();
        this._current.platform = (window as any).getWortalPlatform();
        if (this._current.platform === "wortal") {
            if (!this._isValidWortal()) {
                this._current.platform = "debug";
            }
        }
        this._current.gameId = (window as any).wortalGameID;
        this._current.browser = navigator.userAgent;
        console.log("[Wortal] Session initialized: ", this._current);
    }

    get gameId(): string {
        return this._current.gameId;
    }

    get browser(): string {
        return this._current.browser;
    }

    get platform(): Platform {
        return this._current.platform;
    }

    get country(): string {
        return this._current.country;
    }

    private _setCountry(): string {
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const arr = zone.split("/");
        const city = arr[arr.length - 1];
        return country[city];
    }

    // Calling getWortalPlatform() from the backend will default to returning "wortal" if no other platform
    // match is found. We want to set the platform to "debug" if we're not on an actual wortal domain.
    private _isValidWortal(): boolean {
        const domains: string[] = ["html5gameportal.com", "html5gameportal.dev"]
        const location = window.location;
        const host = location.host
        for (let i = 0; i < domains.length; i++) {
            if (host.indexOf(domains[i]) !== -1) {
                return true;
            }
        }
        return false;
    }
}

/** @hidden */
export class GameState {
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
