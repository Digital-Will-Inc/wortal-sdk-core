import { ExternalCallbacks } from "../../core/interfaces/external-callbacks";
import Wortal from "../../index";
import { debug } from "../../utils/logger";
import { SessionData } from "../interfaces/session-data";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import country from "../../data/intl-data.json";

/**
 * Contains data about the current game session such as the platform, country, and game ID.
 * @hidden
 */
export class Session {
    private _data: SessionData = {
        country: "",
        gameID: "",
        browser: "",
    };

    private _locale: string = "";

    // Some SDKs such as GD and GameMonetize use a window object with a global event handler. We store the callbacks
    // here so that we can call them from the event handler for these SDKs.
    private readonly _externalCallbacks: ExternalCallbacks | undefined;

    constructor() {
        debug("Initializing session...");
        this._data.country = this._setCountry();
        this._data.gameID = this._setGameID();
        this._data.browser = navigator.userAgent;
        if (Wortal._internalPlatform === "gd" || Wortal._internalPlatform === "gamemonetize") {
            this._externalCallbacks = {};
        }
        debug("Session initialized: ", this._data);
    }

    get gameID(): string {
        return this._data.gameID;
    }

    get browser(): string {
        return this._data.browser;
    }

    get country(): string {
        return this._data.country;
    }

    get locale(): string {
        return this._locale;
    }

    set locale(locale: string) {
        this._locale = locale;
    }

    get externalCallbacks(): ExternalCallbacks | undefined {
        return this._externalCallbacks;
    }

    private _setGameID(): string {
        const platform = Wortal._internalPlatform;
        let id: string = window.wortalGameID;
        // Always use the URL parsing method for GD and Gamemonetize as we need their IDs to initialize the SDK.
        if (id === undefined || (platform === "gd" || platform === "gamemonetize")) {
            debug("Game ID not found in window.wortalGameID, trying to get it from the URL...");
            // We keep this in for backwards compatibility. As of v1.6.13 Wortal will automatically add the game ID to
            // wortal-data.js when uploading a revision, but some games have not (and may never) be updated, so we
            // need a fallback for getting the gameID.
            let url: string[] = [];
            let subdomain: string[] = [];

            switch (platform) {
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
                case "gamemonetize":
                    // Example URL: https://gamemonetize.com/trash-factory
                    // ID: trash-factory
                    // If this is embedded into another site then the ID will be different but the URL structure will be the same.
                    // Ex: https://html5.gamemonetize.co/5lmq5m1n60ijd3xm2pnkgfzm0mtz10to/
                    // ID: 5lmq5m1n60ijd3xm2pnkgfzm0mtz10to
                    // Ex: https://html5.gamemonetize.games/5lmq5m1n60ijd3xm2pnkgfzm0mtz10to/
                    // ID: 5lmq5m1n60ijd3xm2pnkgfzm0mtz10to
                    url = document.URL.split("/");
                    id = url[3];
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
        // without using geolocation.
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (typeof zone === "undefined") {
            debug("Could not get time zone, defaulting to unknown.");
            return "unknown";
        }
        const arr = zone.split("/");
        const city = arr[arr.length - 1];
        return country[city];
    }
}
