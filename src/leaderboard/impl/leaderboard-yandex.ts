import { YandexLeaderboardObject } from "../../core/interfaces/yandex-sdk";
import { API_URL, WORTAL_API } from "../../data/core-data";
import { invalidOperation, notSupported, rethrowError_Yandex } from "../../errors/error-handler";
import Wortal from "../../index";
import { clampNumber } from "../../utils/wortal-utils";
import { Leaderboard } from "../classes/leaderboard";
import { LeaderboardEntry } from "../classes/leaderboard-entry";
import { LeaderboardPlayer } from "../classes/leaderboard-player";
import {
    Leaderboard_Yandex,
    LeaderboardEntry_Yandex, LeaderboardGetEntriesResult_Yandex,
    LeaderboardPlayer_Yandex
} from "../interfaces/yandex-leaderboard";
import { LeaderboardBase } from "../leaderboard-base";

/**
 * Yandex implementation of the Leaderboard API.
 * @hidden
 */
export class LeaderboardYandex extends LeaderboardBase {
    // Yandex works a little differently in that we need to get the leaderboard object from the platform SDK,
    // then call the API methods on that object.
    private _leaderboardObject!: YandexLeaderboardObject;

    constructor() {
        super();
        this._setLeaderboardObject();
    }

    protected getConnectedPlayersEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC));
    }

    protected getEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        //TODO: test this impl thoroughly as the filters are a little different than the other platforms
        if (typeof this._leaderboardObject === "undefined") {
            return Promise.reject(invalidOperation("Leaderboard object missing or invalid.", WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_ENTRIES_ASYNC));
        }

        // Yandex requires that count be between 1 and 10, and offset be between 1 and 20.
        count = clampNumber(count, 1, 10);
        offset = clampNumber(offset, 1, 20);

        return this._leaderboardObject.getLeaderboardEntries(name, {
            includeUser: true, // Default is false, but we want to include the player's entry.
            quantityAround: count,
            quantityTop: offset,
        })
            .then((response: LeaderboardGetEntriesResult_Yandex) => {
                return response.entries.map((entry: LeaderboardEntry_Yandex) => {
                    return this._convertToWortalLeaderboardEntry(entry);
                });
            })
            .catch((error: any) => {
                throw rethrowError_Yandex(error, WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_ENTRIES_ASYNC);
            });
    }

    protected getEntryCountAsyncImpl(name: string): Promise<number> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC, API_URL.LEADERBOARD_GET_ENTRY_COUNT_ASYNC));
    }

    protected getLeaderboardAsyncImpl(name: string): Promise<Leaderboard> {
        if (typeof this._leaderboardObject === "undefined") {
            return Promise.reject(invalidOperation("Leaderboard object missing or invalid.", WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC, API_URL.LEADERBOARD_GET_LEADERBOARD_ASYNC));
        }

        return this._leaderboardObject.getLeaderboardDescription(name)
            .then((leaderboard: Leaderboard_Yandex) => {
                return this._convertToWortalLeaderboard(leaderboard);
            })
            .catch((error: any) => {
                throw rethrowError_Yandex(error, WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC, API_URL.LEADERBOARD_GET_LEADERBOARD_ASYNC);
            });
    }

    protected getPlayerEntryAsyncImpl(name: string): Promise<LeaderboardEntry> {
        if (typeof this._leaderboardObject === "undefined") {
            return Promise.reject(invalidOperation("Leaderboard object missing or invalid.", WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC, API_URL.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC));
        }

        return this._leaderboardObject.getLeaderboardPlayerEntry(name)
            .then((entry: LeaderboardEntry_Yandex) => {
                return this._convertToWortalLeaderboardEntry(entry);
            })
            .catch((error: any) => {
                throw rethrowError_Yandex(error, WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC, API_URL.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC);
            });
    }

    protected sendEntryAsyncImpl(name: string, score: number, details: string): Promise<LeaderboardEntry> {
        if (typeof this._leaderboardObject === "undefined") {
            return Promise.reject(invalidOperation("Leaderboard object missing or invalid.", WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC, API_URL.LEADERBOARD_SEND_ENTRY_ASYNC));
        }

        return this._leaderboardObject.setLeaderboardScore(name, score, details)
            .then(() => {
                // This should be the newly created entry we return here, but Yandex doesn't give that to us when we
                // send an entry. Instead, we'll just get the player's entry and return that so there's some data to work with.
                // This may cause some inconsistencies if the game is expecting the entry to be the one that was just sent,
                // such as displaying the wrong score to a player, although that should be a rare case as most games
                // would use their own data to display the score.
                return this.getPlayerEntryAsyncImpl(name);
            })
            .catch((error: any) => {
                throw rethrowError_Yandex(error, WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC, API_URL.LEADERBOARD_SEND_ENTRY_ASYNC);
            });
    }

    private _setLeaderboardObject(): void {
        if (typeof this._leaderboardObject !== "undefined") {
            return;
        }

        // This is called in the constructor before the platform initialization begins, so we need to wait for the
        // initialization to complete before getting the leaderboard object.
        window.addEventListener("wortal-sdk-initialized", () => {
            Wortal._internalPlatformSDK.getLeaderboards()
                .then((leaderboardObject: YandexLeaderboardObject) => {
                    this._leaderboardObject = leaderboardObject;
                })
                .catch((error: any) => {
                    throw rethrowError_Yandex(error, "_setLeaderboardObject");
                });
        });
    }

    private _convertToWortalLeaderboard(leaderboard: Leaderboard_Yandex): Leaderboard {
        // We don't have access to the leaderboard's ID, so we generate a random one.
        const id: number = Math.floor(Math.random() * 9000) + 1000;
        //TODO: use localized title here instead of name
        return new Leaderboard(
            id, leaderboard.name, leaderboard.appID // Yandex doesn't have context, so we just use the app ID.
        );
    }

    private _convertToWortalLeaderboardEntry(entry: LeaderboardEntry_Yandex): LeaderboardEntry {
        return new LeaderboardEntry({
            rank: entry?.rank || -1,
            score: entry?.score || -1,
            formattedScore: entry?.formattedScore || "",
            timestamp: -1, // No timestamp available on Yandex.
            details: entry?.extraData || "",
            player: this._convertToWortalLeaderboardPlayer(entry?.player) || undefined,
        });
    }

    private _convertToWortalLeaderboardPlayer(player: LeaderboardPlayer_Yandex): LeaderboardPlayer {
        return new LeaderboardPlayer({
            id: player?.uniqueID || "",
            name: player?.publicName || "",
            photo: player?.getAvatarSrc("medium") || "", //TODO: check the sizes here and return whatever is appropriate
            isFirstPlay: false,
            daysSinceFirstPlay: 0,
        });
    }

}
