import { API_URL, WORTAL_API } from "../../data/core-data";
import { rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Link } from "../../errors/interfaces/link-error";
import Wortal from "../../index";
import { Leaderboard } from "../classes/leaderboard";
import { LeaderboardEntry } from "../classes/leaderboard-entry";
import { Leaderboard_Link, LeaderboardEntry_Link } from "../interfaces/link-leaderboard";
import { LeaderboardBase } from "../leaderboard-base";

/**
 * Link implementation of the Leaderboard API.
 * @hidden
 */
export class LeaderboardLink extends LeaderboardBase {
    protected getConnectedPlayersEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Link) => leaderboard.getConnectedPlayerEntriesAsync(count, offset))
            .then((entries: LeaderboardEntry_Link[]) => {
                return entries.map((entry: LeaderboardEntry_Link) => {
                    return this._convertLinkLeaderboardEntryToWortal(entry);
                })
            })
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC);
            });
    }

    protected getEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Link) => leaderboard.getEntriesAsync(count, offset))
            .then((entries: LeaderboardEntry_Link[]) => {
                return entries.map((entry: LeaderboardEntry_Link) => {
                    return this._convertLinkLeaderboardEntryToWortal(entry);
                })
            })
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_ENTRIES_ASYNC);
            });
    }

    protected getEntryCountAsyncImpl(name: string): Promise<number> {
        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Link) => leaderboard.getEntryCountAsync())
            .then((count: number) => {
                return count;
            })
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC, API_URL.LEADERBOARD_GET_ENTRY_COUNT_ASYNC);
            });
    }

    protected getLeaderboardAsyncImpl(name: string): Promise<Leaderboard> {
        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Link) => {
                return this._convertLinkLeaderboardToWortal(leaderboard);
            })
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC, API_URL.LEADERBOARD_GET_LEADERBOARD_ASYNC);
            });
    }

    protected getPlayerEntryAsyncImpl(name: string): Promise<LeaderboardEntry> {
        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Link) => leaderboard.getPlayerEntryAsync())
            .then((entry: LeaderboardEntry_Link) => {
                return this._convertLinkLeaderboardEntryToWortal(entry);
            })
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC, API_URL.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC);
            });
    }

    protected sendEntryAsyncImpl(name: string, score: number, details: string): Promise<LeaderboardEntry> {
        return Wortal._internalPlatformSDK.getLeaderboardAsync(name)
            .then((leaderboard: Leaderboard_Link) => leaderboard.setScoreAsync(score, details))
            .then((entry: LeaderboardEntry_Link) => {
                return this._convertLinkLeaderboardEntryToWortal(entry);
            })
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC, API_URL.LEADERBOARD_SEND_ENTRY_ASYNC);
            });
    }

    private _convertLinkLeaderboardToWortal(leaderboard: Leaderboard_Link): Leaderboard {
        // We don't have access to the leaderboard's ID, so we generate a random one.
        const id: number = Math.floor(Math.random() * 9000) + 1000;
        return new Leaderboard(
            id, leaderboard.getName(), ""
        );
    }

    private _convertLinkLeaderboardEntryToWortal(entry: LeaderboardEntry_Link): LeaderboardEntry {
        return new LeaderboardEntry({
            formattedScore: entry.getFormattedScore(),
            player: {
                id: entry.getPlayer().getID(),
                name: entry.getPlayer().getName(),
                photo: entry.getPlayer().getPhoto(),
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
