import { API_URL, WORTAL_API } from "../data/core-data";
import { implementationError, invalidParams, notInitialized } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { isValidString } from "../utils/validators";
import { Leaderboard } from "./classes/leaderboard";
import { LeaderboardEntry } from "./classes/leaderboard-entry";

/**
 * Base class for the Leaderboard API. Extend this class to implement the Leaderboard API for a specific platform.
 * @hidden
 */
export class LeaderboardBase {
//#region Public API

    public getConnectedPlayersEntriesAsync(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
        Wortal._log.apiCall(WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC);

        const validationResult = this.validateGetConnectedPlayersEntriesAsync(name, count, offset);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getConnectedPlayersEntriesAsyncImpl(name, count, offset);
    }

    public getEntriesAsync(name: string, count: number, offset: number = 0): Promise<LeaderboardEntry[]> {
        Wortal._log.apiCall(WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC);

        const validationResult = this.validateGetEntriesAsync(name, count, offset);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getEntriesAsyncImpl(name, count, offset);
    }

    public getEntryCountAsync(name: string): Promise<number> {
        Wortal._log.apiCall(WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC);

        const validationResult = this.validateGetEntryCountAsync(name);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getEntryCountAsyncImpl(name);
    }

    public getLeaderboardAsync(name: string): Promise<Leaderboard> {
        Wortal._log.apiCall(WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC);

        const validationResult = this.validateGetLeaderboardAsync(name);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getLeaderboardAsyncImpl(name);
    }

    public getPlayerEntryAsync(name: string): Promise<LeaderboardEntry> {
        Wortal._log.apiCall(WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC);

        const validationResult = this.validateGetPlayerEntryAsync(name);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getPlayerEntryAsyncImpl(name);
    }

    public sendEntryAsync(name: string, score: number, details: string = ""): Promise<LeaderboardEntry> {
        Wortal._log.apiCall(WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC);

        const validationResult = this.validateSendEntryAsync(name, score, details);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.sendEntryAsyncImpl(name, score, details);
    }

//#endregion
//#region Implementation interface

    protected getConnectedPlayersEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> { throw implementationError(); }
    protected getEntriesAsyncImpl(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> { throw implementationError(); }
    protected getEntryCountAsyncImpl(name: string): Promise<number> { throw implementationError(); }
    protected getLeaderboardAsyncImpl(name: string): Promise<Leaderboard> { throw implementationError(); }
    protected getPlayerEntryAsyncImpl(name: string): Promise<LeaderboardEntry> { throw implementationError(); }
    protected sendEntryAsyncImpl(name: string, score: number, details: string): Promise<LeaderboardEntry> { throw implementationError(); }

//#endregion
//#region Validation

    protected validateGetConnectedPlayersEntriesAsync(name: string, count: number, offset: number): ValidationResult {
        if (!isValidString(name)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC,
                    API_URL.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC)
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC,
                    API_URL.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC)
            }
        }

        return { valid: true };
    }

    protected validateGetEntriesAsync(name: string, count: number, offset: number): ValidationResult {
        if (!isValidString(name)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC,
                    API_URL.LEADERBOARD_GET_ENTRIES_ASYNC)
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC,
                    API_URL.LEADERBOARD_GET_ENTRIES_ASYNC)
            }
        }

        return { valid: true };
    }

    protected validateGetEntryCountAsync(name: string): ValidationResult {
        if (!isValidString(name)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC,
                    API_URL.LEADERBOARD_GET_ENTRY_COUNT_ASYNC)
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC,
                    API_URL.LEADERBOARD_GET_ENTRY_COUNT_ASYNC)
            }
        }

        return { valid: true };
    }

    protected validateGetLeaderboardAsync(name: string): ValidationResult {
        if (!isValidString(name)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC,
                    API_URL.LEADERBOARD_GET_LEADERBOARD_ASYNC)
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC,
                    API_URL.LEADERBOARD_GET_LEADERBOARD_ASYNC)
            }
        }

        return { valid: true };
    }

    protected validateGetPlayerEntryAsync(name: string): ValidationResult {
        if (!isValidString(name)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC,
                    API_URL.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC)
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC,
                    API_URL.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC)
            }
        }

        return { valid: true };
    }

    protected validateSendEntryAsync(name: string, score: number, details: string): ValidationResult {
        if (!isValidString(name)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
                    API_URL.LEADERBOARD_SEND_ENTRY_ASYNC)
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
                    API_URL.LEADERBOARD_SEND_ENTRY_ASYNC)
            }
        }

        return { valid: true };
    }

//#endregion
}
