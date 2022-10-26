import {PlayerData} from "../types/player";
import {sdk} from "../sdk";

/**
 * Details about the current player.
 */
export default class Player {
    private _current: PlayerData = {
        id: "",
        name: "",
        photo: "",
        firstPlay: false,
    };

    /** @hidden */
    constructor() {
        this._current.id = this.setId();
        this._current.name = this.setName();
        this._current.photo = this.setPhoto();
        this._current.firstPlay = this.isFirstPlay();
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
    isFirstPlay(): boolean {
        switch (sdk.session.platform) {
            case "viber":
            case "link":
                return (window as any).wortalGame.player.hasPlayed();
            case "wortal":
            //TODO: implement first play check for Wortal
            case "debug":
            default:
                return true;
        }
    }

    private setId(): string {
        switch (sdk.session.platform) {
            case "viber":
            case "link":
                return (window as any).wortalGame.player.getID();
            case "wortal":
            case "debug":
            default:
                return "wortal-player-1";
        }
    }

    private setName(): string {
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

    private setPhoto(): string {
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
}
