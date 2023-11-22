import Wortal from "../../index";
import { Player } from "./player";

/**
 * Represents a Facebook player.
 * @hidden
 */
export class FacebookPlayer extends Player {
    public override async initialize(): Promise<void> {
        Wortal._log.debug("Fetching ASID...");
        await Wortal.player.getASIDAsync()
            .then((asid: string) => {
                this._data.asid = asid;
                Wortal._log.debug("ASID fetched: ", asid);
            })
            .catch((error: any) => {
                Wortal._log.exception("Error fetching ASID: ", error);
            });

        this._data.id = Wortal._internalPlatformSDK.player.getID();
        this._data.name = Wortal._internalPlatformSDK.player.getName();
        this._data.photo = Wortal._internalPlatformSDK.player.getPhoto();
        this._data.isFirstPlay = false;

        Wortal._log.debug("Player initialized: ", this._data);
        return Promise.resolve();
    }
}
