import { GameData } from "../interfaces/session";
import { Platform, SessionData } from "../types/session";
import { PLATFORM_DOMAINS } from "../types/wortal";
import { debug } from "../utils/logger";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        debug("Initializing session...");
        this._current.country = this._setCountry();
        this._current.platform = this._setPlatform();
        this._current.gameId = window.wortalGameID;
        this._current.browser = navigator.userAgent;
        debug("Session initialized: ", this._current);
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

    private _setPlatform(): Platform {
        const location = window.location;
        const host = location.host;

        if (PLATFORM_DOMAINS["viber"].some(domain => host.includes(domain))) {
            return "viber";
        } else if (PLATFORM_DOMAINS["link"].some(domain => host.includes(domain))) {
            return "link";
        } else if (PLATFORM_DOMAINS["gd"].some(domain => host.includes(domain))) {
            return "gd";
        } else if (PLATFORM_DOMAINS["facebook"].some(domain => host.includes(domain))) {
            return "facebook";
        } else if (PLATFORM_DOMAINS["wortal"].some(domain => host.includes(domain))) {
            return "wortal";
        } else if (PLATFORM_DOMAINS["crazygames"].some(domain => host.includes(domain))) {
            return "crazygames";
        } else if (PLATFORM_DOMAINS["gamepix"].some(domain => host.includes(domain))) {
            return "gamepix";
        } else {
            return "debug";
        }
    }

    private _setCountry(): string {
        // This isn't very reliable as the time zone can be easily changed, but we want a way to get the country
        // without using any personal information or geolocation to avoid GDPR/privacy law issues.
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const arr = zone.split("/");
        const city = arr[arr.length - 1];
        return country[city];
    }
}

/** @hidden */
export class GameState {
    private _current: GameData = {
        gameTimer: 0,
        levelName: "",
        levelTimer: 0,
        levelTimerHandle: 0,
        gameLoadTimer: 0,
    };

    get gameTimer(): number {
        return this._current.gameTimer;
    }

    get gameLoadTimer(): number {
        return this._current.gameLoadTimer;
    }

    startGameTimer(): void {
        window.setInterval(() => {
            if (document.visibilityState !== "hidden") {
                this._current.gameTimer += 1
            }
        }, 1000);
    }

    startGameLoadTimer(): void {
        this._current.gameLoadTimer = performance.now();
    }

    stopGameLoadTimer(): void {
        this._current.gameLoadTimer = performance.now() - this._current.gameLoadTimer;
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
