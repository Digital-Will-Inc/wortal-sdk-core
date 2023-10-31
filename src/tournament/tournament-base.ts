import { API_URL, WORTAL_API } from "../data/core-data";
import { invalidParams } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import { apiCall } from "../utils/logger";
import { isValidNumber, isValidString } from "../utils/validators";
import { Tournament } from "./classes/tournament";
import { CreateTournamentPayload } from "./interfaces/create-tournament-payload";
import { ShareTournamentPayload } from "./interfaces/share-tournament-payload";

/**
 * Base class for the Tournament API. Extend this class to implement the Tournament API for a specific platform.
 * @hidden
 */
export abstract class TournamentBase {
    constructor() {
    }

//#region Public API

    public createAsync(payload: CreateTournamentPayload): Promise<Tournament> {
        apiCall(WORTAL_API.TOURNAMENT_CREATE_ASYNC);

        const validationResult = this.validateCreatePayload(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.createAsyncImpl(payload);
    }

    public getAllAsync(): Promise<Tournament[]> {
        apiCall(WORTAL_API.TOURNAMENT_GET_ALL_ASYNC);

        return this.getAllAsyncImpl();
    }

    public getCurrentAsync(): Promise<Tournament> {
        apiCall(WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC);

        return this.getCurrentAsyncImpl();
    }

    public joinAsync(tournamentID: string): Promise<void> {
        apiCall(WORTAL_API.TOURNAMENT_JOIN_ASYNC);

        const validationResult = this.validateJoinPayload(tournamentID);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.joinAsyncImpl(tournamentID);
    }

    public postScoreAsync(score: number): Promise<void> {
        apiCall(WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC);

        const validationResult = this.validatePostScore(score);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.postScoreAsyncImpl(score);
    }

    public shareAsync(payload: ShareTournamentPayload): Promise<void> {
        apiCall(WORTAL_API.TOURNAMENT_SHARE_ASYNC);

        const validationResult = this.validateSharePayload(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.shareAsyncImpl(payload);
    }

//#endregion
//#region Implementation interface

    protected abstract createAsyncImpl(payload: CreateTournamentPayload): Promise<Tournament>;
    protected abstract getAllAsyncImpl(): Promise<Tournament[]>;
    protected abstract getCurrentAsyncImpl(): Promise<Tournament>;
    protected abstract joinAsyncImpl(tournamentID: string): Promise<void>;
    protected abstract postScoreAsyncImpl(score: number): Promise<void>;
    protected abstract shareAsyncImpl(payload: ShareTournamentPayload): Promise<void>;

//#endregion
//#region Validation

    protected validateCreatePayload(payload: CreateTournamentPayload): ValidationResult {
        if (!isValidNumber(payload.initialScore)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.TOURNAMENT_CREATE_ASYNC, API_URL.TOURNAMENT_CREATE_ASYNC),
            }
        }

        return { valid: true }
    }

    protected validateJoinPayload(tournamentID: string): ValidationResult {
        if (!isValidString(tournamentID)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.TOURNAMENT_JOIN_ASYNC, API_URL.TOURNAMENT_JOIN_ASYNC),
            }
        }

        return { valid: true }
    }

    protected validatePostScore(score: number): ValidationResult {
        if (!isValidNumber(score)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC, API_URL.TOURNAMENT_POST_SCORE_ASYNC),
            }
        }

        return { valid: true }
    }

    protected validateSharePayload(payload: ShareTournamentPayload): ValidationResult {
        if (!isValidNumber(payload.score)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.TOURNAMENT_SHARE_ASYNC, API_URL.TOURNAMENT_SHARE_ASYNC),
            }
        }

        return { valid: true }
    }

//#endregion
}
