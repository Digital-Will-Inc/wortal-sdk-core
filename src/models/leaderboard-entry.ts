import { LeaderboardEntryData } from "../types/leaderboard";
import LeaderboardPlayer from "./leaderboard-player";

/** @hidden */
export default class LeaderboardEntry {
    private _current: LeaderboardEntryData = {
        rank: 0,
        score: 0,
        formattedScore: "",
        timestamp: 0,
        details: "",
    }

    constructor(entry: LeaderboardEntryData) {
        this._current.player = entry.player;
        this._current.rank = entry.rank;
        this._current.score = entry.score;
        this._current.formattedScore = entry.formattedScore;
        this._current.timestamp = entry.timestamp;
        this._current.details = entry.details;
    }

    get player(): LeaderboardPlayer {
        return new LeaderboardPlayer(this._current.player!);
    }

    get rank(): number {
        return this._current.rank;
    }

    get score(): number {
        return this._current.score;
    }

    get formattedScore(): string {
        return this._current.formattedScore;
    }

    get timestamp(): number {
        return this._current.timestamp;
    }

    get details(): string {
        return this._current.details!;
    }
}
