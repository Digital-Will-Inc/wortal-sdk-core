import { debug } from "../../utils/logger";
import { Player } from "./player";

/**
 * Represents a Viber player.
 * @hidden
 */
export class ViberPlayer extends Player {
    constructor() {
        super();
    }

    protected initializeImpl(): Promise<void> {
        this._data.id = window.Wortal._internalPlatformSDK.player.getID();
        this._data.name = window.Wortal._internalPlatformSDK.player.getName();
        this._data.photo = window.Wortal._internalPlatformSDK.player.getPhoto();
        this._data.isFirstPlay = !window.Wortal._internalPlatformSDK.player.hasPlayed();

        debug("Player initialized: ", this._data);
        return Promise.resolve();
    }

}
