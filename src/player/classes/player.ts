import { PlayerData } from "../interfaces/player-data";

/**
 * Represents a player in the game. To access info about the current player, use the Wortal.player API.
 * This is used to access info about other players such as friends or leaderboard entries.
 */
export abstract class Player {
    protected _data: PlayerData = {
        id: "",
        name: "",
        photo: "",
        isFirstPlay: false,
        daysSinceFirstPlay: 0,
    };

    constructor() {
    }

    public async initialize(): Promise<void> {
        await this.initializeImpl();
    }

    protected abstract initializeImpl(): Promise<void>;

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
