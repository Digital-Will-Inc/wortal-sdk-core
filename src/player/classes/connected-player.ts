import Wortal from "../../index";
import { PlayerData } from "../interfaces/player-data";
import { Player } from "./player";

/**
 * Represents a player that is connected to the current player. This could be a friend or player in a chat thread.
 * @hidden
 */
export class ConnectedPlayer extends Player {
    constructor(player: PlayerData) {
        super();
        this._data.id = player.id;
        this._data.name = player.name;
        this._data.photo = player.photo;
        this._data.isFirstPlay = player.isFirstPlay;
        this._data.daysSinceFirstPlay = player.daysSinceFirstPlay;
        Wortal._log.debug("Created ConnectedPlayer:", player);
    }

    public override async initialize(): Promise<void> {
        return Promise.resolve();
    }

    static mock(): ConnectedPlayer {
        const data = {
            id: "1234567890",
            name: "Mock Player",
            photo: "https://storage.googleapis.com/html5gameportal.com/images/08ac22fd-6e4b-4a33-9ea5-89bb412f6099-Trash_Factory_Facebook_Small_App_Icon_1024x1024.png",
            isFirstPlay: false,
            daysSinceFirstPlay: 0,
        };

        Wortal._log.debug("Mocking ConnectedPlayer...", data);
        return new ConnectedPlayer(data);
    }

}
