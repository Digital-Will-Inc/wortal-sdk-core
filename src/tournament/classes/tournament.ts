import { debug } from "../../utils/logger";
import { TournamentData } from "../interfaces/tournament-data";

/**
 * Represents a tournament in the game.
 */
export class Tournament {
    private _data: TournamentData = {
        id: "",
        contextID: "",
        endTime: 0,
    }

    /** @hidden */
    constructor(id: string, contextID: string, endTime: number, title?: string, payload?: string) {
        debug(`Creating tournament: ${id} / ${contextID} / ${endTime} / ${title} / ${payload}`);
        // FB API docs say these are strings, but we're getting numbers returned.
        this._data.id = id.toString();
        this._data.contextID = contextID.toString();
        this._data.endTime = endTime;
        this._data.title = title;
        if (typeof payload === "string") {
            this._data.payload = JSON.parse(payload);
        }
    }

    /**
     * The ID of the tournament.
     */
    get id(): string {
        return this._data.id;
    }

    /**
     * The ID of the context in which the tournament is running.
     */
    get contextID(): string {
        return this._data.contextID;
    }

    /**
     * Unix timestamp of when the tournament ends.
     */
    get endTime(): number {
        return this._data.endTime;
    }

    /**
     * The title of the tournament.
     */
    get title(): string | undefined {
        return this._data.title;
    }

    /**
     * Payload attached to the tournament.
     */
    get payload(): object | undefined {
        return this._data.payload;
    }

    /**
     * Creates a mock tournament for debugging and testing purposes.
     * @hidden
     */
    static mock(): Tournament {
        return new Tournament("123456789", "987654321", 1234567890, "Test Tournament", '{"foo": "bar"}');
    }
}
