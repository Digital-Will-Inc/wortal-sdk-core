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
        // FB API docs say these are strings, but we're getting numbers returned.
        this._current.id = id.toString();
        this._current.contextID = contextID.toString();
        this._current.endTime = endTime;
        this._current.title = title;
        if (typeof payload === "string") {
            this._current.payload = JSON.parse(payload);
        }
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

    get payload(): object | undefined {
        return this._current.payload;
    }
}
