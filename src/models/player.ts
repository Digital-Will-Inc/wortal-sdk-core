import {PlayerData} from "../types/player";
import {sdk} from "../sdk";

/**
 * Details about the current player.
 */
export default class Player {
    protected _current: PlayerData = {
        id: "",
        name: "",
        photo: "",
        isFirstPlay: false,
        daysSinceFirstPlay: 0,
    };

    /** @hidden */
    init(): Player {
        this._current.id = this.setId();
        this._current.name = this.setName();
        this._current.photo = this.setPhoto();
        this._current.isFirstPlay = this.setIsFirstPlay();
        return this;
    }

    /**
     * Player's ID.
     * @returns String ID.
     */
    get id(): string {
        return this._current.id;
    }

    /**
     * Player's name.
     * @returns String name.
     */
    get name(): string {
        return this._current.name;
    }

    /**
     * Player's photo.
     * @returns URL to the player's photo.
     */
    get photo(): string {
        return this._current.photo;
    }

    /**
     * Is this the first time the player is playing this game or not.
     * @returns True if it is the first time.
     */
    get isFirstPlay(): boolean {
        return this._current.isFirstPlay;
    }

    /**
     * The number of days that have passed since the player's first time playing this game.
     * @returns Number of days since first play.
     */
    get daysSinceFirstPlay(): number {
        return this._current.daysSinceFirstPlay;
    }

    protected setId(): string {
        switch (sdk.session.platform) {
            case "viber":
            case "link":
                return (window as any).wortalGame.player.getID();
            case "wortal":
            case "debug":
            default:
                return "wortal-player";
        }
    }

    protected setName(): string {
        switch (sdk.session.platform) {
            case "viber":
            case "link":
                return (window as any).wortalGame.player.getName();
            case "wortal":
            case "debug":
            default:
                return "WortalPlayer";
        }
    }

    protected setPhoto(): string {
        switch (sdk.session.platform) {
            case "viber":
            case "link":
                return (window as any).wortalGame.player.getPhoto();
            case "wortal":
            case "debug":
            default:
                return "wortal-player-photo";
        }
    }

    protected setIsFirstPlay(): boolean {
        switch (sdk.session.platform) {
            case "viber":
            case "link":
                return (window as any).wortalGame.player.hasPlayed();
            case "wortal":
                return this.isWortalFirstPlay();
            case "debug":
            default:
                return false;
        }
    }

    protected isWortalFirstPlay(): boolean {
        const cookieDate = this.getCookie(sdk.session.gameId);
        if (cookieDate !== "") {
            this._current.daysSinceFirstPlay = this.getTimeFromCookieCreation(cookieDate);
            return false;
        } else {
            this.setCookie(sdk.session.gameId);
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
