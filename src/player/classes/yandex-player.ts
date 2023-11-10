import { PlayerData } from "../interfaces/player-data";
import { Player } from "./player";

/**
 * Represents a Yandex player.
 * @hidden
 */
export class YandexPlayer extends Player {
    constructor(data: PlayerData) {
        super();
        this._data = data;
    }

    protected initializeImpl(): Promise<void> {
        // Normally this would be where we would initialize the player via the platform SDK, but this occurs
        // in the constructor for YandexPlayer, so we don't need to do anything here.
        return Promise.resolve();
    }
}
