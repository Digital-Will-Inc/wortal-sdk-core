import { GameData } from "../interfaces/session";
import { Platform, SessionData } from "../types/session";
import { PLATFORM_DOMAINS } from "../types/wortal";
import { debug } from "../utils/logger";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import country from "../utils/intl-data.json";
import { getParameterByName } from "../utils/wortal-utils";

/** @hidden */
export class Session {
    private _current: SessionData = {
        country: "",
        platform: "debug",
        gameId: "",
        browser: "",
    };

    private _locale: string = "";

    constructor() {
        debug("Initializing session...");
        this._current.country = this._setCountry();
        this._current.platform = this._setPlatform();
        this._current.gameId = this._setGameID();
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

    get locale(): string {
        return this._locale;
    }

    set locale(locale: string) {
        this._locale = locale;
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
            // We may be embedding the game in a different app/page, so we need to check the URL for a query param
            // that flags the platform.
            if (getParameterByName("telegram")) {
                return "telegram";
            } else {
                return "wortal";
            }
        } else if (PLATFORM_DOMAINS["crazygames"].some(domain => host.includes(domain))) {
            return "crazygames";
        } else if (PLATFORM_DOMAINS["gamepix"].some(domain => host.includes(domain))) {
            return "gamepix";
        } else {
            return "debug";
        }
    }

    private _setGameID(): string {
        let id: string = window.wortalGameID;
        if (id === undefined) {
            debug("Game ID not found in window.wortalGameID, trying to get it from the URL...");
            // We keep this in for backwards compatibility. As of v1.6.13 Wortal will automatically add the game ID to
            // wortal-data.js when uploaded a revision, but some games have not (and may never) be updated so we
            // need a fallback for getting the gameID.
            let url: string[] = [];
            let subdomain: string[] = [];

            switch (this.platform) {
                case "wortal":
                    // Example URL: https://gameportal.digitalwill.co.jp/games/cactus-bowling/19/
                    // ID: 19
                    url = document.URL.split("/");
                    id = url[5];
                    break;
                case "link":
                    // Example URL: https://05cabb33-07f4-4074-8ebd-69b78815697a.g.rgsbx.net/11/index.html
                    // ID: 05cabb33-07f4-4074-8ebd-69b78815697a
                    url = document.URL.split("/");
                    subdomain = url[2].split(".");
                    id = subdomain[0];
                    break;
                case "viber":
                    // Example URL: https://r83ysr3u613lxyh8u93piwf0h0jbxbhk.g.vbrplsbx.io/44/index.html
                    // ID: r83ysr3u613lxyh8u93piwf0h0jbxbhk
                    url = document.URL.split("/");
                    subdomain = url[2].split(".");
                    id = subdomain[0];
                    break;
                case "gd":
                    // Example URL: https://revision.gamedistribution.com/b712105e1fff4bceb87667522d798f97
                    // ID: b712105e1fff4bceb87667522d798f97
                    url = document.URL.split("/");
                    id = url[3];
                    break;
                case "facebook":
                    // wortal-data.js was always added to FB revisions, so we shouldn't reach this case.
                    id = window.wortalGameID;
                    break;
                case "crazygames":
                    // Example URL: https://www.crazygames.com/game/sushi-supply-co
                    // ID: sushi-supply-co
                    url = document.URL.split("/");
                    id = url[4];
                    break;
                case "gamepix":
                    // Example URL: https://www.gamepix.com/play/sushi-supply-co
                    // ID: sushi-supply-co
                    url = document.URL.split("/");
                    id = url[4];
                    break;
                case "telegram":
                    // Example URL: https://wrapper.playdeck.io/?url=https://cdn.html5gameportal.com/telegram/trash-factory/index.html
                    // ID: trash-factory
                    url = document.URL.split("/");
                    id = url[7];
                    break;
                case "debug":
                default:
                    id = "debug";
                    break;
            }
        }

        debug("Game ID: " + id);
        return id;
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
