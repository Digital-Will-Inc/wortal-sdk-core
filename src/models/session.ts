import {SessionData} from "../types/session";
// Murphy's Laws of Combat: If it’s stupid and it works, it ain’t stupid.
// @ts-ignore
import country from "../utils/intl-data.json";

/**
 * Details about the current game session.
 */
export default class Session {
    private _current: SessionData = {
        country: "",
        platform: "debug",
        gameId: "",
        browser: "",
    };

    /** @hidden */
    constructor() {
        this._current.country = this.setCountry();
        this._current.platform = (window as any).getWortalPlatform();
        if (this._current.platform === "wortal") {
            if (!this.isValidWortal()) {
                this._current.platform = "debug";
            }
        }
        this._current.gameId = this.setGameId();
        this._current.browser = navigator.userAgent;
    }

    /**
     * ID of the current game.
     * @returns String ID. This will vary per platform.
     */
    get gameId(): string {
        return this._current.gameId;
    }

    /**
     * Browser the game is currently being played in.
     * @returns User agent data.
     */
    get browser(): string {
        return this._current.browser;
    }

    /**
     * Platform the game is currently being played on.
     * @returns Current platform.
     */
    get platform(): string {
        return this._current.platform;
    }

    /**
     * Country the current session is being played from.
     * @returns Current country determined by the player's timezone setting.
     */
    get country(): string {
        return this._current.country;
    }

    private setGameId(): string {
        // We sync the different IDs on the backend, we'll just parse the URL here and yeet it into Wombat as is.
        let url: string[] = [];
        switch (this.platform) {
            case "wortal":
                // Example URL: https://gameportal.digitalwill.co.jp/games/cactus-bowling/19/
                // ID: 19
                url = document.URL.split("/");
                return url[5];
            case "link":
                // Example URL: https://one.rakuten.co.jp/miniapp/games/0ffb7f71-3bc9-47da-9071-f88f0cb36718
                // ID: 0ffb7f71-3bc9-47da-9071-f88f0cb36718
                url = document.URL.split("/");
                return url[5];
            case "viber":
                // Example URL: https://vbrpl.io/games/mmaj1mxbmfhvw4uahd9hgyifr6cwjsd0
                // ID: mmaj1mxbmfhvw4uahd9hgyifr6cwjsd0
                url = document.URL.split("/");
                return url[4];
            case "debug":
            default:
                return "debug";
        }
    }

    private setCountry(): string {
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const arr = zone.split("/");
        const city = arr[arr.length - 1];
        return country[city];
    }

    // Calling getWortalPlatform() from the backend will default to returning "wortal" if no other platform
    // match is found. We want to set the platform to "debug" if we're not on an actual wortal domain.
    private isValidWortal(): boolean {
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
