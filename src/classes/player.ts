import { config } from "../api";
import Wortal from "../index";
import { PlayerData } from "../interfaces/player";
import { LeaderboardPlayerData } from "../types/leaderboard";
import { Error_CrazyGames } from "../types/wortal";
import { rethrowError_CrazyGames } from "../utils/error-handler";
import { debug, exception } from "../utils/logger";
import { delayUntilConditionMet } from "../utils/wortal-utils";

/**
 * Represents a player in the game. To access info about the current player, use the Wortal.player API.
 * This is used to access info about other players such as friends or leaderboard entries.
 */
export class Player {
    protected _current: PlayerData = {
        id: "",
        name: "",
        photo: "",
        isFirstPlay: false,
        daysSinceFirstPlay: 0,
    };

    /**
     * Used by CrazyGames platform to determine if the user API is available. CrazyGames allows embedding games into
     * other sites which will cause this to be disabled.
     * @hidden
     * @private
     */
    private _isUserAPIAvailable: boolean = false;
    /**
     * Used to store the CrazyGames player object if the user API is available. CrazyGames SDK doesn't offer
     * individual APIs for getting player info, so we just store the player object.
     * @hidden
     * @private
     */
    private _crazyGamesPlayer: any = null;

    /** @hidden */
    async initialize(): Promise<Player> {
        debug("Initializing player...");
        const platform = config.session.platform;

        if (platform === "crazygames") {
            await this._initializeCrazyGamesPlayer();
        }

        this._current.id = this.setId();
        this._current.name = this.setName();
        this._current.photo = this.setPhoto();
        this._current.isFirstPlay = this.setIsFirstPlay();

        if (platform === "facebook") {
            debug("Fetching ASID...");
            await Wortal.player.getASIDAsync().then((asid) => {
                this._current.asid = asid;
                debug("ASID fetched: ", asid);
            }).catch((error) => {
                exception("Error fetching ASID: ", error);
            });
        }

        debug("Player initialized: ", this._current);
        return this;
    }

    /**
     * ID of the player. This is platform-dependent.
     */
    get id(): string {
        return this._current.id;
    }

    /**
     * Name of the player.
     */
    get name(): string {
        return this._current.name;
    }

    /**
     * URL for the player's photo.
     */
    get photo(): string {
        return this._current.photo;
    }

    /**
     * Is this the first time the player has played this game or not.
     */
    get isFirstPlay(): boolean {
        return this._current.isFirstPlay;
    }

    /**
     * Days since the first time the player has played this game.
     */
    get daysSinceFirstPlay(): number {
        return this._current.daysSinceFirstPlay;
    }

    /** @hidden */
    get asid(): string | undefined {
        return this._current.asid;
    }

    /** @hidden */
    set crazyGamesPlayer(player: any) {
        this._crazyGamesPlayer = player;
        this._current.id = this.setId();
        this._current.name = this.setName();
        this._current.photo = this.setPhoto();
    }

    protected setId(): string {
        switch (config.session.platform) {
            case "viber":
            case "link":
            case "facebook":
                return config.platformSDK.player.getID();
            case "wortal":
                return (window as any).wortalSessionId;
            case "crazygames":
                return this._crazyGamesPlayer?.id || this.generateRandomID();
            case "gd":
            case "debug":
            default:
                return this.generateRandomID();
        }
    }

    protected setName(): string {
        switch (config.session.platform) {
            case "viber":
            case "link":
            case "facebook":
                return config.platformSDK.player.getName();
            case "crazygames":
                return this._crazyGamesPlayer?.username || "CrazyGames Player";
            case "wortal":
            case "gd":
            case "debug":
            default:
                return "WortalPlayer";
        }
    }

    protected setPhoto(): string {
        switch (config.session.platform) {
            case "viber":
            case "link":
            case "facebook":
                return config.platformSDK.player.getPhoto();
            case "crazygames":
                return this._crazyGamesPlayer?.profilePictureUrl || "https://images.crazygames.com/userportal/avatars/4.png";
            case "wortal":
            case "gd":
            case "debug":
            default:
                return "https://storage.googleapis.com/html5gameportal.com/images/08ac22fd-6e4b-4a33-9ea5-89bb412f6099-Trash_Factory_Facebook_Small_App_Icon_1024x1024.png";
        }
    }

    protected setIsFirstPlay(): boolean {
        switch (config.session.platform) {
            case "viber":
            case "link":
                return config.platformSDK.player.hasPlayed();
            case "wortal":
                return this.isWortalFirstPlay();
            case "facebook":
            case "gd":
            case "crazygames":
            case "debug":
            default:
                return false;
        }
    }

    protected isWortalFirstPlay(): boolean {
        const cookieDate = this.getCookie(config.session.gameId);
        if (cookieDate !== "") {
            this._current.daysSinceFirstPlay = this.getTimeFromCookieCreation(cookieDate);
            return false;
        } else {
            this.setCookie(config.session.gameId);
            return true;
        }
    }

    protected getCookie(gameId: string): string {
        const value = "; " + document.cookie;
        const parts = value.split("; wortal-" + gameId + "=");
        return ((parts.length === 2 && parts.pop()?.split(";").shift()) || "");
    }

    protected setCookie(gameId: string): void {
        const key = "wortal-" + gameId;
        const value = new Date().toISOString().slice(0, 10);
        const date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = key + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
    }

    // We store the creation date in the wortal-gameID cookie in this format: yyyy/mm/dd.
    // We'll parse that here and then calculate approximately how many days have elapsed
    // since then. We use that to track retention.
    protected getTimeFromCookieCreation(date: string): number {
        const year: number = +date.substring(0, 4);
        const month: number = +date.substring(5, 7) - 1; // Month range is 0 - 11.
        const day: number = +date.substring(8, 10);
        const lastPlay = Date.UTC(year, month, day);
        const timeDelta = Date.now() - lastPlay;
        return Math.round(timeDelta / 1000 / 60 / 60 / 24);
    }

    protected generateRandomID(): string {
        const generateSegment = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        const segments = [
            generateSegment(),
            generateSegment(),
            generateSegment(),
            generateSegment(),
            generateSegment() + generateSegment() + generateSegment()
        ];

        return segments.join('-');
    }

    /**
     * Initializes the CrazyGames player object if the user API is available. This is used to get the player's
     * info, if it is available.
     * @hidden
     * @private
     */
    async _initializeCrazyGamesPlayer(): Promise<void> {
        // The CrazyGames SDK takes a little longer to initialize than the others, so we have to wait for it here.
        if (typeof config.platformSDK === "undefined") {
            await delayUntilConditionMet(() => {
                return typeof config.platformSDK !== "undefined";
            }, "Waiting for CrazyGames SDK to load...");
        }

        await this.isUserAPIAvailable().then((isAvailable) => {
            this._isUserAPIAvailable = isAvailable;
        }).catch((error: any) => {
            exception("Error checking if user API is available: ", error);
        });

        if (this._isUserAPIAvailable) {
            await this.fetchCrazyGamesPlayer().then((player) => {
                this._crazyGamesPlayer = player;
            }).catch((error: any) => {
                exception("Error fetching CrazyGames player: ", error);
            });
        }
    }

    protected isUserAPIAvailable(): Promise<boolean> {
        return new Promise((resolve) => {
            const callback = (error: Error_CrazyGames, isAvailable: boolean) => {
                if (error) {
                    rethrowError_CrazyGames(error, "isUserAccountAvailable");
                } else {
                    debug("User API available: ", isAvailable);
                    resolve(isAvailable);
                }
            };

            config.platformSDK.user.isUserAccountAvailable(callback);
        });
    }

    protected fetchCrazyGamesPlayer(): Promise<any> {
        return new Promise((resolve) => {
            const callback = (error: Error_CrazyGames, player: any) => {
                if (error) {
                    rethrowError_CrazyGames(error, "getUser");
                } else {
                    debug("CrazyGames player fetched:", player);
                    resolve(player);
                }
            };

            config.platformSDK.user.getUser(callback);
        });
    }
}

/** @hidden */
export class ConnectedPlayer extends Player {
    constructor(player: PlayerData) {
        debug("Creating ConnectedPlayer...", player);
        super();
        this._current.id = player.id;
        this._current.name = player.name;
        this._current.photo = player.photo;
        this._current.isFirstPlay = player.isFirstPlay;
        this._current.daysSinceFirstPlay = player.daysSinceFirstPlay;
    }

    static mock(): ConnectedPlayer {
        const data = {
            id: "1234567890",
            name: "Mock Player",
            photo: "https://storage.googleapis.com/html5gameportal.com/images/08ac22fd-6e4b-4a33-9ea5-89bb412f6099-Trash_Factory_Facebook_Small_App_Icon_1024x1024.png",
            isFirstPlay: false,
            daysSinceFirstPlay: 0,
        };

        debug("Mocking ConnectedPlayer...", data);
        return new ConnectedPlayer(data);
    }
}

/** @hidden */
export class LeaderboardPlayer extends Player {
    constructor(player: LeaderboardPlayerData) {
        debug("Creating LeaderboardPlayer...", player);
        super();
        this._current.id = player.id;
        this._current.name = player.name;
        this._current.photo = player.photo;
        this._current.isFirstPlay = player.isFirstPlay;
        this._current.daysSinceFirstPlay = player.daysSinceFirstPlay;
    }
}
