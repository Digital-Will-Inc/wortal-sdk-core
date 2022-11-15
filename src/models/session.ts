import { SessionData } from "../types/session";
// Murphy's Laws of Combat: If it’s stupid and it works, it ain’t stupid.
// @ts-ignore
import country from "../utils/intl-data.json";

/** @hidden */
export default class Session {
    private _current: SessionData = {
        country: "",
        platform: "debug",
        gameId: "",
        browser: "",
    };

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

    get gameId(): string {
        return this._current.gameId;
    }

    get browser(): string {
        return this._current.browser;
    }

    get platform(): string {
        return this._current.platform;
    }

    get country(): string {
        return this._current.country;
    }

    private setGameId(): string {
        // We sync the different IDs on the backend, we'll just parse the URL here and yeet it into Wombat as is.
        let url: string[] = [];
        let subdomain: string[] = [];
        let id: string;
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
                // Example URL: "https://r83ysr3u613lxyh8u93piwf0h0jbxbhk.g.vbrplsbx.io/44/index.html"
                // ID: r83ysr3u613lxyh8u93piwf0h0jbxbhk
                url = document.URL.split("/");
                subdomain = url[2].split(".");
                id = subdomain[0];
                break;
            case "debug":
            default:
                id = "debug";
                break;
        }
        console.log("[Wortal] Game ID: " + id);
        return id;
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
