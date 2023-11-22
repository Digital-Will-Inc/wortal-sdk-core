import { API_URL, WORTAL_API } from "../data/core-data";
import { implementationError, invalidParams, notInitialized } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { isValidNumber, isValidString } from "../utils/validators";
import { Tournament } from "./classes/tournament";
import { CreateTournamentPayload } from "./interfaces/create-tournament-payload";
import { ShareTournamentPayload } from "./interfaces/share-tournament-payload";

/**
 * Base class for the Tournament API. Extend this class to implement the Tournament API for a specific platform.
 * @hidden
 */
export class TournamentBase {
//#region Public API

    public createAsync(payload: CreateTournamentPayload): Promise<Tournament> {
        Wortal._log.apiCall(WORTAL_API.TOURNAMENT_CREATE_ASYNC);

        const validationResult = this.validateCreateAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.createAsyncImpl(payload);
    }

    public getAllAsync(): Promise<Tournament[]> {
        Wortal._log.apiCall(WORTAL_API.TOURNAMENT_GET_ALL_ASYNC);

        const validationResult = this.validateGetAllAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getAllAsyncImpl();
    }

    public getCurrentAsync(): Promise<Tournament> {
        Wortal._log.apiCall(WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC);

        const validationResult = this.validateGetCurrentAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getCurrentAsyncImpl();
    }

    public joinAsync(tournamentID: string): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.TOURNAMENT_JOIN_ASYNC);

        const validationResult = this.validateJoinAsync(tournamentID);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.joinAsyncImpl(tournamentID);
    }

    public postScoreAsync(score: number): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC);

        const validationResult = this.validatePostScoreAsync(score);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.postScoreAsyncImpl(score);
    }

    public shareAsync(payload: ShareTournamentPayload): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.TOURNAMENT_SHARE_ASYNC);

        const validationResult = this.validateShareAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.shareAsyncImpl(payload);
    }

//#endregion
//#region Implementation interface

    protected createAsyncImpl(payload: CreateTournamentPayload): Promise<Tournament> { throw implementationError(); }
    protected getAllAsyncImpl(): Promise<Tournament[]> { throw implementationError(); }
    protected getCurrentAsyncImpl(): Promise<Tournament> { throw implementationError(); }
    protected joinAsyncImpl(tournamentID: string): Promise<void> { throw implementationError(); }
    protected postScoreAsyncImpl(score: number): Promise<void> { throw implementationError(); }
    protected shareAsyncImpl(payload: ShareTournamentPayload): Promise<void> { throw implementationError(); }

//#endregion
//#region Validation

    protected validateCreateAsync(payload: CreateTournamentPayload): ValidationResult {
        if (!isValidNumber(payload.initialScore)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.TOURNAMENT_CREATE_ASYNC,
                    API_URL.TOURNAMENT_CREATE_ASYNC),
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.TOURNAMENT_CREATE_ASYNC,
                    API_URL.TOURNAMENT_CREATE_ASYNC),
            }
        }

        return { valid: true }
    }

    protected validateGetAllAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.TOURNAMENT_GET_ALL_ASYNC,
                    API_URL.TOURNAMENT_GET_ALL_ASYNC),
            }
        }

        return { valid: true }
    }

    protected validateGetCurrentAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC,
                    API_URL.TOURNAMENT_GET_CURRENT_ASYNC),
            }
        }

        return { valid: true }
    }

    protected validateJoinAsync(tournamentID: string): ValidationResult {
        if (!isValidString(tournamentID)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.TOURNAMENT_JOIN_ASYNC,
                    API_URL.TOURNAMENT_JOIN_ASYNC),
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.TOURNAMENT_JOIN_ASYNC,
                    API_URL.TOURNAMENT_JOIN_ASYNC),
            }
        }

        return { valid: true }
    }

    protected validatePostScoreAsync(score: number): ValidationResult {
        if (!isValidNumber(score)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC,
                    API_URL.TOURNAMENT_POST_SCORE_ASYNC),
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC,
                    API_URL.TOURNAMENT_POST_SCORE_ASYNC),
            }
        }

        return { valid: true }
    }

    protected validateShareAsync(payload: ShareTournamentPayload): ValidationResult {
        if (!isValidNumber(payload.score)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.TOURNAMENT_SHARE_ASYNC,
                    API_URL.TOURNAMENT_SHARE_ASYNC),
            }
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.TOURNAMENT_SHARE_ASYNC,
                    API_URL.TOURNAMENT_SHARE_ASYNC),
            }
        }

        return { valid: true }
    }

//#endregion
}
