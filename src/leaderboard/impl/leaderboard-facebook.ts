import { API_URL, WORTAL_API } from "../../data/core-data";
import { invalidOperation, rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Facebook } from "../../errors/interfaces/facebook-error";
import Wortal from "../../index";
import { isValidString } from "../../utils/validators";
import { Leaderboard } from "../classes/leaderboard";
import { LeaderboardEntry } from "../classes/leaderboard-entry";
import { Leaderboard_Facebook, LeaderboardEntry_Facebook } from "../interfaces/facebook-leaderboard";
import { LeaderboardBase } from "../leaderboard-base";

/**
 * Facebook implementation of the Leaderboard API.
 * @hidden
 */
export class LeaderboardFacebook extends LeaderboardBase {
    // PLATFORM NOTE: Facebook does not support global leaderboards. We use the context ID to create a leaderboard name
    // from what the developer passes into the API. If the player is not currently in a context, we throw an error
    // because no leaderboard can exist in that case.

    constructor() {
        super();
    }

    protected getConnectedPlayersEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        const contextID = Wortal.context.getId();
        if (!isValidString(contextID)) {
            return Promise.reject(invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
                "https://sdk.html5gameportal.com/api/leaderboard/"));
        }
        name += `.${contextID}`;

        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Facebook) => leaderboard.getConnectedPlayerEntriesAsync(count, offset))
            .then((entries: LeaderboardEntry_Facebook[]) => {
                return entries.map((entry: LeaderboardEntry_Facebook) => {
                    return this._convertFacebookLeaderboardEntryToWortal(entry);
                })
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC);
            });
    }

    protected getEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        const contextID = Wortal.context.getId();
        if (!isValidString(contextID)) {
            return Promise.reject(invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
                "https://sdk.html5gameportal.com/api/leaderboard/"));
        }
        name += `.${contextID}`;

        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Facebook) => leaderboard.getEntriesAsync(count, offset))
            .then((entries: LeaderboardEntry_Facebook[]) => {
                return entries.map((entry: LeaderboardEntry_Facebook) => {
                    return this._convertFacebookLeaderboardEntryToWortal(entry);
                })
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_ENTRIES_ASYNC);
            });
    }

    protected getEntryCountAsyncImpl(name: string): Promise<number> {
        const contextID = Wortal.context.getId();
        if (!isValidString(contextID)) {
            return Promise.reject(invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
                "https://sdk.html5gameportal.com/api/leaderboard/"));
        }
        name += `.${contextID}`;

        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Facebook) => leaderboard.getEntryCountAsync())
            .then((count: number) => {
                return count;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC, API_URL.LEADERBOARD_GET_ENTRY_COUNT_ASYNC);
            });
    }

    protected getLeaderboardAsyncImpl(name: string): Promise<Leaderboard> {
        const contextID = Wortal.context.getId();
        if (!isValidString(contextID)) {
            return Promise.reject(invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
                "https://sdk.html5gameportal.com/api/leaderboard/"));
        }
        name += `.${contextID}`;

        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Facebook) => {
                return this._convertFacebookLeaderboardToWortal(leaderboard);
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC, API_URL.LEADERBOARD_GET_LEADERBOARD_ASYNC);
            });
    }

    protected getPlayerEntryAsyncImpl(name: string): Promise<LeaderboardEntry> {
        const contextID = Wortal.context.getId();
        if (!isValidString(contextID)) {
            return Promise.reject(invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
                "https://sdk.html5gameportal.com/api/leaderboard/"));
        }
        name += `.${contextID}`;

        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Facebook) => leaderboard.getPlayerEntryAsync())
            .then((entry: LeaderboardEntry_Facebook) => {
                return this._convertFacebookLeaderboardEntryToWortal(entry);
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC, API_URL.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC);
            });
    }

    protected sendEntryAsyncImpl(name: string, score: number, details: string): Promise<LeaderboardEntry> {
        const contextID = Wortal.context.getId();
        if (!isValidString(contextID)) {
            return Promise.reject(invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
                "https://sdk.html5gameportal.com/api/leaderboard/"));
        }
        name += `.${contextID}`;

        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Facebook) => leaderboard.setScoreAsync(score, details))
            .then((entry: LeaderboardEntry_Facebook) => {
                return this._convertFacebookLeaderboardEntryToWortal(entry);
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC, API_URL.LEADERBOARD_SEND_ENTRY_ASYNC);
            });
    }

    private _convertFacebookLeaderboardToWortal(leaderboard: Leaderboard_Facebook): Leaderboard {
        // We don't have access to the leaderboard's ID, so we generate a random one.
        const id: number = Math.floor(Math.random() * 9000) + 1000;
        return new Leaderboard(
            id, leaderboard.getName(), leaderboard.getContextID()
        );
    }

    private _convertFacebookLeaderboardEntryToWortal(entry: LeaderboardEntry_Facebook): LeaderboardEntry {
        return new LeaderboardEntry({
            formattedScore: entry.getFormattedScore(),
            player: {
                id: entry.getPlayer().getID(),
                name: entry.getPlayer().getName(),
                photo: entry.getPlayer().getPhoto() || "https://storage.googleapis.com/html5gameportal.com/images/avatar.jpg",
                isFirstPlay: false,
                daysSinceFirstPlay: 0,
            },
            rank: entry.getRank(),
            score: entry.getScore(),
            timestamp: entry.getTimestamp(),
            details: entry.getExtraData(),
        });
    }

}
