import {CurrentGroup} from "../types/social-group";
import SocialPlayer from "./social-player";

export default class SocialGroup {
    private _current: CurrentGroup = {
        id: "",
        type: "SOLO",
        size: 1,
        players: [],
    }

    /**
     * Gets the ID of the current group.
     * @returns ID of the group or an empty string if no group exists.
     */
    get id(): string {
        return this._current.id;
    }

    /**
     * Gets the type of the group.
     * @returns "SOLO" or "GROUP"
     */
    get type(): string {
        return this._current.type;
    }

    /**
     * Gets the number of players in the group.
     * @returns Number of players.
     */
    get size(): number {
        return this._current.size;
    }

    /**
     * Gets the players currently in the group.
     * @returns Array of SocialPlayer objects.
     */
    get players(): SocialPlayer[] {
        return this._current.players;
    }
}
