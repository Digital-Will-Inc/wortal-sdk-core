import { config } from "../api";
import Wortal from "../index";
import { PlayerData } from "../interfaces/player";
import { LeaderboardPlayerData } from "../types/leaderboard";

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

    /** @hidden */
    init(): Player {
        const platform = config.session.platform;
        this._current.id = this.setId();
        this._current.name = this.setName();
        this._current.photo = this.setPhoto();
        this._current.isFirstPlay = this.setIsFirstPlay();
        if (platform === "facebook") {
            Wortal.player.getASIDAsync().then((asid) => {
                this._current.asid = asid;
            }).catch((error) => {
                console.error("[Wortal] Error getting ASID: ", error);
            });
        }
        console.log("[Wortal] Player initialized: ", this._current);
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
     * Data URL for the player's photo.
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

    protected setId(): string {
        switch (config.session.platform) {
            case "viber":
            case "link":
            case "facebook":
                return (window as any).wortalGame.player.getID();
            case "wortal":
            case "gd":
            case "debug":
            default:
                return "wortal-player";
        }
    }

    protected setName(): string {
        switch (config.session.platform) {
            case "viber":
            case "link":
            case "facebook":
                return (window as any).wortalGame.player.getName();
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
                return (window as any).wortalGame.player.getPhoto();
            case "wortal":
            case "gd":
            case "debug":
            default:
                return "wortal-player-photo";
        }
    }

    protected setIsFirstPlay(): boolean {
        switch (config.session.platform) {
            case "viber":
            case "link":
                return (window as any).wortalGame.player.hasPlayed();
            case "wortal":
                return this.isWortalFirstPlay();
            case "facebook":
            case "gd":
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
        let timeDelta = Date.now() - lastPlay;
        return Math.round(timeDelta / 1000 / 60 / 60 / 24);
    }
}

/** @hidden */
export class ConnectedPlayer extends Player {
    constructor(player: PlayerData) {
        super();
        this._current.id = player.id;
        this._current.name = player.name;
        this._current.photo = player.photo;
        this._current.isFirstPlay = player.isFirstPlay;
        this._current.daysSinceFirstPlay = player.daysSinceFirstPlay;
    }
}

/** @hidden */
export class LeaderboardPlayer extends Player {
    constructor(player: LeaderboardPlayerData) {
        super();
        this._current.id = player.id;
        this._current.name = player.name;
        this._current.photo = player.photo;
        this._current.isFirstPlay = player.isFirstPlay;
        this._current.daysSinceFirstPlay = player.daysSinceFirstPlay;
    }
}
