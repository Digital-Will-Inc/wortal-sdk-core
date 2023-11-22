import Wortal from "../../index";
import { generateRandomID } from "../../utils/wortal-utils";
import { Player } from "./player";

/**
 * Represents a player that is used for debugging purposes.
 * @hidden
 */
export class DebugPlayer extends Player {
    constructor() {
        super();
    }

    protected initializeImpl(): Promise<void> {
        this._data.id = generateRandomID();
        this._data.name = "Player";
        this._data.photo = "https://storage.googleapis.com/html5gameportal.com/images/avatar.jpg";
        this._data.isFirstPlay = false;

        Wortal._log.debug("Player initialized: ", this._data);
        return Promise.resolve();
    }

}
