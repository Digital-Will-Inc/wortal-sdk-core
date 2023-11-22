import Wortal from "../../index";
import { generateRandomID } from "../../utils/wortal-utils";
import { PlayerData } from "../interfaces/player-data";

/**
 * Represents a player in the game. To access info about the current player, use the Wortal.player API.
 * This is used to access info about other players such as friends or leaderboard entries.
 */
export class Player {
    protected _data: PlayerData = {
        id: "",
        name: "",
        photo: "",
        isFirstPlay: false,
        daysSinceFirstPlay: 0,
    };

    public async initialize(): Promise<void> {
        this._data.id = generateRandomID();
        this._data.name = "Player";
        this._data.photo = "https://storage.googleapis.com/html5gameportal.com/images/avatar.jpg";
        this._data.isFirstPlay = false;

        Wortal._log.debug("Player initialized: ", this._data);
        return Promise.resolve();
    }

    /**
     * ID of the player. This is platform-dependent.
     */
    get id(): string {
        return this._data.id;
    }

    /**
     * Name of the player.
     */
    get name(): string {
        return this._data.name;
    }

    /**
     * URL for the player's photo.
     */
    get photo(): string {
        return this._data.photo;
    }

    /**
     * Is this the first time the player has played this game or not.
     */
    get isFirstPlay(): boolean {
        return this._data.isFirstPlay;
    }

    /**
     * Days since the first time the player has played this game.
     */
    get daysSinceFirstPlay(): number {
        return this._data.daysSinceFirstPlay;
    }

    /**
     * Facebook app-scoped ID of the player. This is only available if the player is playing on Facebook.
     * @hidden
     */
    get asid(): string | undefined {
        return this._data.asid;
    }
}
