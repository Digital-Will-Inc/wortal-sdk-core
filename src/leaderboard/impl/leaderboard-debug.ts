import { Leaderboard } from "../classes/leaderboard";
import { LeaderboardEntry } from "../classes/leaderboard-entry";
import { LeaderboardBase } from "../leaderboard-base";

/**
 * Debug implementation of the Leaderboard API.
 * @hidden
 */
export class LeaderboardDebug extends LeaderboardBase {
    constructor() {
        super();
    }

    protected getConnectedPlayersEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        const entries: LeaderboardEntry[] = [];
        for (let i = 0; i < count; i++) {
            entries[i] = LeaderboardEntry.mock(offset + i + 1, 10000 - i);
        }

        return Promise.resolve(entries);
    }

    protected getEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        const entries: LeaderboardEntry[] = [];
        for (let i = 0; i < count; i++) {
            entries[i] = LeaderboardEntry.mock(offset + i + 1, 10000 - i);
        }

        return Promise.resolve(entries);
    }

    protected getEntryCountAsyncImpl(name: string): Promise<number> {
        return Promise.resolve(100);
    }

    protected getLeaderboardAsyncImpl(name: string): Promise<Leaderboard> {
        return Promise.resolve(Leaderboard.mock());
    }

    protected getPlayerEntryAsyncImpl(name: string): Promise<LeaderboardEntry> {
        return Promise.resolve(LeaderboardEntry.mock(1, 10000));
    }

    protected sendEntryAsyncImpl(name: string, score: number, details: string): Promise<LeaderboardEntry> {
        return Promise.resolve(LeaderboardEntry.mock(1, 10000));
    }

}
