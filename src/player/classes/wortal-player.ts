import Wortal from "../../index";
import { Player } from "./player";

/**
 * Represents a Wortal player.
 * @hidden
 */
export class WortalPlayer extends Player {
    public override async initialize(): Promise<void> {
        this._data.id = window.wortalSessionId;
        this._data.name = "Player";
        this._data.photo = "https://storage.googleapis.com/html5gameportal.com/images/avatar.jpg";
        this._data.isFirstPlay = this._isWortalFirstPlay();

        Wortal._log.debug("Player initialized: ", this._data);
        return Promise.resolve(undefined);
    }

    private _isWortalFirstPlay(): boolean {
        const cookieDate = this._getCookie(Wortal.session._internalSession.gameID);
        if (cookieDate !== "") {
            this._data.daysSinceFirstPlay = this._getTimeFromCookieCreation(cookieDate);
            return false;
        } else {
            this._setCookie(Wortal.session._internalSession.gameID);
            return true;
        }
    }

    private _getCookie(gameId: string): string {
        const value = "; " + document.cookie;
        const parts = value.split("; wortal-" + gameId + "=");
        return ((parts.length === 2 && parts.pop()?.split(";").shift()) || "");
    }

    private _setCookie(gameId: string): void {
        const key = "wortal-" + gameId;
        const value = new Date().toISOString().slice(0, 10);
        const date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = key + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
    }

    // We store the creation date in the wortal-gameID cookie in this format: yyyy/mm/dd.
    // We'll parse that here and then calculate approximately how many days have elapsed
    // since then. We use that to track retention.
    private _getTimeFromCookieCreation(date: string): number {
        const year: number = +date.substring(0, 4);
        const month: number = +date.substring(5, 7) - 1; // Month range is 0 - 11.
        const day: number = +date.substring(8, 10);
        const lastPlay = Date.UTC(year, month, day);
        const timeDelta = Date.now() - lastPlay;
        return Math.round(timeDelta / 1000 / 60 / 60 / 24);
    }

}
