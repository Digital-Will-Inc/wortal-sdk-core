import { API_URL, TELEGRAM_API, WORTAL_API } from "../../data/core-data";
import { notSupported, operationFailed } from "../../errors/error-handler";
import { generateRandomID, waitForTelegramCallback } from "../../utils/wortal-utils";
import { Leaderboard } from "../classes/leaderboard";
import { LeaderboardEntry } from "../classes/leaderboard-entry";
import { LeaderboardEntry_Telegram } from "../interfaces/telegram-leaderboard";
import { LeaderboardBase } from "../leaderboard-base";

/**
 * Telegram implementation of the Leaderboard API.
 * @hidden
 */
export class LeaderboardTelegram extends LeaderboardBase {
    constructor() {
        super();
    }

    protected getConnectedPlayersEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC));
    }

    protected getEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        return new Promise((resolve, reject) => {
            window.parent.postMessage({playdeck: {method: TELEGRAM_API.GET_GLOBAL_SCORE}}, "*");

            waitForTelegramCallback(TELEGRAM_API.GET_GLOBAL_SCORE)
                .then((entries: LeaderboardEntry_Telegram[]) => {
                    resolve(entries.map((entry: LeaderboardEntry_Telegram) => {
                        return this._convertTelegramLeaderboardEntryToWortal(entry);
                    }));
                })
                .catch((error: Error) => {
                    reject(operationFailed(error.message, WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_ENTRIES_ASYNC));
                });
        });
    }

    protected getEntryCountAsyncImpl(name: string): Promise<number> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC, API_URL.LEADERBOARD_GET_ENTRY_COUNT_ASYNC));
    }

    protected getLeaderboardAsyncImpl(name: string): Promise<Leaderboard> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC, API_URL.LEADERBOARD_GET_LEADERBOARD_ASYNC));
    }

    protected getPlayerEntryAsyncImpl(name: string): Promise<LeaderboardEntry> {
        return new Promise((resolve, reject) => {
            window.parent.postMessage({playdeck: {method: TELEGRAM_API.GET_SCORE}}, "*");

            waitForTelegramCallback(TELEGRAM_API.GET_SCORE).then((entry: LeaderboardEntry_Telegram) => {
                resolve(this._convertTelegramLeaderboardEntryToWortal(entry));
            }).catch((error: Error) => {
                reject(operationFailed(error.message, WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC, API_URL.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC));
            });
        });
    }

    protected sendEntryAsyncImpl(name: string, score: number, details: string): Promise<LeaderboardEntry> {
        return new Promise((resolve, reject) => {
            // First we submit the score.
            window.parent.postMessage({playdeck: {method: TELEGRAM_API.SET_SCORE, value: score, isForce: false,}}, "*");
            // Then we fetch the updated leaderboard entry to return.
            window.parent.postMessage({playdeck: {method: TELEGRAM_API.GET_SCORE}}, "*");

            waitForTelegramCallback(TELEGRAM_API.GET_SCORE).then((entry: LeaderboardEntry_Telegram) => {
                resolve(this._convertTelegramLeaderboardEntryToWortal(entry));
            }).catch((error: Error) => {
                reject(operationFailed(error.message, WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC, API_URL.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC));
            });
        });
    }

    private _convertTelegramLeaderboardEntryToWortal(entry: LeaderboardEntry_Telegram): LeaderboardEntry {
        return new LeaderboardEntry({
            rank: entry.position,
            score: entry.score,
            player: {
                id: generateRandomID(),
                name: entry.username || "Telegram Player",
                photo: "https://storage.googleapis.com/html5gameportal.com/images/avatar.jpg",
                isFirstPlay: false,
                daysSinceFirstPlay: 0,
            }
        });
    }

}
