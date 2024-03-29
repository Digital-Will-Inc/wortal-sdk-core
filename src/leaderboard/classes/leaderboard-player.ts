import Wortal from "../../index";
import { Player } from "../../player/classes/player";
import { LeaderboardPlayerData } from "../types/leaderboard-types";

/**
 * Player that exists on a leaderboard. This player may or may not be a ConnectedPlayer, and may be the current player.
 * @hidden
 */
export class LeaderboardPlayer extends Player {
    constructor(player: LeaderboardPlayerData) {
        Wortal._log.debug("Creating LeaderboardPlayer...", player);
        super();
        this._data.id = player.id;
        this._data.name = player.name;
        this._data.photo = player.photo;
        this._data.isFirstPlay = player.isFirstPlay;
        this._data.daysSinceFirstPlay = player.daysSinceFirstPlay;
    }

    public override async initialize(): Promise<void> {
        return Promise.resolve();
    }
}
