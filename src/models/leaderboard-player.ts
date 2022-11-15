import { LeaderboardPlayerData } from "../types/leaderboard";
import Player from "./player";

/** @hidden */
export default class LeaderboardPlayer extends Player {
    constructor(player: LeaderboardPlayerData) {
        super();
        this._current.id = player.id;
        this._current.name = player.name;
        this._current.photo = player.photo;
        this._current.isFirstPlay = player.isFirstPlay;
        this._current.daysSinceFirstPlay = player.daysSinceFirstPlay;
    }
}
