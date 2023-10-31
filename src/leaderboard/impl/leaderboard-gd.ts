import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { Leaderboard } from "../classes/leaderboard";
import { LeaderboardEntry } from "../classes/leaderboard-entry";
import { LeaderboardBase } from "../leaderboard-base";

/**
 * Game Distribution (GD) implementation of the Leaderboard API.
 * @hidden
 */
export class LeaderboardGD extends LeaderboardBase {
    constructor() {
        super();
    }

    protected getConnectedPlayersEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC));
    }

    protected getEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC, API_URL.LEADERBOARD_GET_ENTRIES_ASYNC));
    }

    protected getEntryCountAsyncImpl(name: string): Promise<number> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC, API_URL.LEADERBOARD_GET_ENTRY_COUNT_ASYNC));
    }

    protected getLeaderboardAsyncImpl(name: string): Promise<Leaderboard> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC, API_URL.LEADERBOARD_GET_LEADERBOARD_ASYNC));
    }

    protected getPlayerEntryAsyncImpl(name: string): Promise<LeaderboardEntry> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC, API_URL.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC));
    }

    protected sendEntryAsyncImpl(name: string, score: number, details: string): Promise<LeaderboardEntry> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC, API_URL.LEADERBOARD_SEND_ENTRY_ASYNC));
    }

}
