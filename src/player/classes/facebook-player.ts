import { debug, exception } from "../../utils/logger";
import { Player } from "./player";

/**
 * Represents a Facebook player.
 * @hidden
 */
export class FacebookPlayer extends Player {
    constructor() {
        super();
    }

    protected async initializeImpl(): Promise<void> {
        debug("Fetching ASID...");
        await window.Wortal.player.getASIDAsync()
            .then((asid: string) => {
                this._data.asid = asid;
                debug("ASID fetched: ", asid);
            })
            .catch((error: any) => {
                exception("Error fetching ASID: ", error);
            });

        this._data.id = window.Wortal._internalPlatformSDK.player.getID();
        this._data.name = window.Wortal._internalPlatformSDK.player.getName();
        this._data.photo = window.Wortal._internalPlatformSDK.player.getPhoto();
        this._data.isFirstPlay = false;

        debug("Player initialized: ", this._data);
        return Promise.resolve();
    }
}
