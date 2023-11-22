import Wortal from "../../index";
import { Player } from "./player";

/**
 * Represents a Viber player.
 * @hidden
 */
export class ViberPlayer extends Player {
    public override async initialize(): Promise<void> {
        this._data.id = Wortal._internalPlatformSDK.player.getID();
        this._data.name = Wortal._internalPlatformSDK.player.getName();
        this._data.photo = Wortal._internalPlatformSDK.player.getPhoto();
        this._data.isFirstPlay = !Wortal._internalPlatformSDK.player.hasPlayed();

        Wortal._log.debug("Player initialized: ", this._data);
        return Promise.resolve();
    }

}
