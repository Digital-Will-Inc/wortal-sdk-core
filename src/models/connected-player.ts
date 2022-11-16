import { PlayerData } from "../types/player";
import Player from "./player";

/** @hidden */
export default class ConnectedPlayer extends Player {
    constructor(player: PlayerData) {
        super();
        this._current.id = player.id;
        this._current.name = player.name;
        this._current.photo = player.photo;
        this._current.isFirstPlay = player.isFirstPlay;
        this._current.daysSinceFirstPlay = player.daysSinceFirstPlay;
    }
}
