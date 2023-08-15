import { TournamentData } from "../interfaces/tournament";
import { debug } from "../utils/logger";

/**
 * Represents a tournament in the game.
 */
export class Tournament {
    private _current: TournamentData = {
        id: "",
        contextID: "",
        endTime: 0,
    }

    /** @hidden */
    constructor(id: string, contextID: string, endTime: number, title?: string, payload?: string) {
        debug(`Creating tournament: ${id} / ${contextID} / ${endTime} / ${title} / ${payload}`);
        this._current.id = id;
        this._current.contextID = contextID;
        this._current.endTime = endTime;
        this._current.title = title;
        this._current.payload = payload;
    }

    get id(): string {
        return this._current.id;
    }

    get contextID(): string {
        return this._current.contextID;
    }

    get endTime(): number {
        return this._current.endTime;
    }

    get title(): string | undefined {
        return this._current.title;
    }

    get payload(): string | undefined {
        return this._current.payload;
    }
}
