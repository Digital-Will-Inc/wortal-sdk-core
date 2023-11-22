import Wortal from "../../index";
import { Player } from "./player";

/**
 * Represents a Link player.
 * @hidden
 */
export class LinkPlayer extends Player {
    public override async initialize(): Promise<void> {
        this._data.id = Wortal._internalPlatformSDK.player.getID();
        this._data.name = Wortal._internalPlatformSDK.player.getName();
        this._data.photo = Wortal._internalPlatformSDK.player.getPhoto();
        this._data.isFirstPlay = !Wortal._internalPlatformSDK.player.hasPlayed();

        Wortal._log.debug("Player initialized: ", this._data);
        return Promise.resolve();
    }

}
