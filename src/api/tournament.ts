import { Tournament } from "../classes/tournament";
import { CreateTournamentPayload, ShareTournamentPayload } from "../interfaces/tournament";
import { Error_Facebook_Rakuten } from "../interfaces/wortal";
import { API_URL, WORTAL_API } from "../utils/config";
import { facebookTournamentToWortal } from "../utils/converters";
import {
    invalidOperation,
    invalidParams,
    notSupported,
    operationFailed,
    rethrowError_Facebook_Rakuten
} from "../utils/error-handler";
import { isValidNumber, isValidString } from "../utils/validators";
import { config } from "./index";
import Wortal from "../index";

/**
 * Fetch the tournament out of the current context the user is playing. This will reject if there is no
 * tournament linked to the current context. The tournament returned can be either active or expired
 * (A tournament is expired if its end time is in the past). For each tournament, there is only one unique context
 * ID linked to it, and that ID doesn't change.
 * @example
 * Wortal.tournament.getCurrentAsync()
 * .then(tournament => {
 *     console.log(tournament.id);
 *     console.log(tournament.endTime);
 * });
 * @returns {Promise<Tournament>} Promise that resolves with the current tournament.
 * Rejects if there is no tournament linked to the current context.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>PENDING_REQUEST</li>
 * <li>NETWORK_FAILURE</li>
 * <li>INVALID_OPERATION</li>
 * <li>TOURNAMENT_NOT_FOUND</li>
 * <li>NOT_SUPPORTED</li>
 */
export function getCurrentAsync(): Promise<Tournament> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "facebook") {
            const id = Wortal.context.getId();
            if (!isValidString(id)) {
                throw invalidOperation("No context ID found. Please ensure you are calling this API from within a context linked to a tournament.",
                    WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC,
                    API_URL.TOURNAMENT_GET_CURRENT_ASYNC);
            }

            // This should be a simple implementation for FBInstant.getTournamentAsync, but the FB SDK is returning a
            // TOURNAMENT_NOT_FOUND error even when we confirm we're in the context of an active tournament.
            //
            // During testing, I found that the FB SDK is returning numbers instead of strings as documented for
            // tournament.getID and tournament.getContextID, so it's possible that type mismatch is causing the issue.
            // For now we'll just fetch all tournaments and find the one that matches the current contextID. -Tim
            //
            // https://developers.facebook.com/docs/games/acquire/instant-tournaments/instant-games
            //TODO: clean this up when we get FBInstant.getTournamentAsync to work as expected
            return getAllAsync()
                .then((tournaments: Tournament[]) => {
                    const tournament = tournaments.find((tournament: Tournament) => {
                        return tournament.contextID === id;
                    });

                    if (!tournament) {
                        throw operationFailed("No tournament found for the current context. Please ensure you are calling this API from within a context linked to a tournament.",
                            WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC,
                            API_URL.TOURNAMENT_GET_CURRENT_ASYNC);
                    }

                    return tournament;
                }).catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC, API_URL.TOURNAMENT_GET_CURRENT_ASYNC);
                });
        } else if (platform === "debug") {
            return Tournament.mock();
        } else {
            throw notSupported(undefined, WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC);
        }
    });
}

/**
 * Returns a list of eligible tournaments that can be surfaced in-game, including tournaments:
 *
 * - The player has created
 * - The player is participating in
 * - The player's friends (who granted permission) are participating in
 *
 * The tournaments returned are active. A tournament is expired if its end time is in the past.
 * For each tournament, there is only one unique context ID linked to it, and that ID doesn't change.
 * @example
 * Wortal.tournament.getAllAsync()
 *  .then(tournaments => console.log(tournaments.length));
 * @returns {Promise<Tournament[]>} Promise that resolves with an array of active tournaments.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NETWORK_FAILURE</li>
 * <li>INVALID_OPERATION</li>
 * <li>NOT_SUPPORTED</li>
 */
export function getAllAsync(): Promise<Tournament[]> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (platform === "facebook") {
            return config.platformSDK.tournament.getTournamentsAsync()
                .then((tournaments: any) => {
                    return tournaments.map((tournament: any) => {
                        return facebookTournamentToWortal(tournament);
                    });
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_GET_ALL_ASYNC, API_URL.TOURNAMENT_GET_ALL_ASYNC);
                });
        } else if (platform === "debug") {
            return [Tournament.mock(), Tournament.mock(), Tournament.mock()];
        }
        else {
            throw notSupported(undefined, WORTAL_API.TOURNAMENT_GET_ALL_ASYNC);
        }
    });
}

/**
 * Posts a player's score. This API should only be called within a tournament context at the end of an
 * activity (example: when the player doesn't have "lives" to continue the game). This API will be rate-limited when
 * called too frequently. Scores posted using this API should be consistent and comparable across game sessions.
 * For example, if Player A achieves 200 points in a session, and Player B achieves 320 points in a session, those
 * two scores should be generated from activities where the scores are fair to be compared and ranked against each other.
 * @example
 * Wortal.tournament.postScoreAsync(200)
 *  .then(() => console.log("Score posted!"));
 * @param score An integer value representing the player's score at the end of an activity.
 * @returns {Promise<void>} Promise that resolves when the score is posted.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>TOURNAMENT_NOT_FOUND</li>
 * <li>NETWORK_FAILURE</li>
 * <li>NOT_SUPPORTED</li>
 * </ul>
 */
export function postScoreAsync(score: number): Promise<void> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidNumber(score)) {
            throw invalidParams(undefined, WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC, API_URL.TOURNAMENT_POST_SCORE_ASYNC);
        }

        if (platform === "facebook") {
            return config.platformSDK.tournament.postScoreAsync(score)
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC, API_URL.TOURNAMENT_POST_SCORE_ASYNC);
                });
        } else if (platform === "debug") {
            return;
        } else {
            throw notSupported(undefined, WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC);
        }
    });
}

/**
 * Opens the tournament creation dialog if the player is not currently in a tournament session.
 * @example
 * // Create a tournament for a specific level.
 * const payload = {
 *     initialScore: 100,
 *     config: {
 *      title: "Level 1 Tournament",
 *     },
 *     data: {
 *      level: 1,
 *     },
 * };
 *
 * Wortal.tournament.createAsync(payload)
 *  .then(tournament => console.log(tournament.payload["level"]));
 * @param payload Payload that defines the tournament configuration.
 * @returns {Promise<Tournament>} Promise that resolves with the created tournament.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>INVALID_OPERATION</li>
 * <li>NETWORK_FAILURE</li>
 * <li>DUPLICATE_POST</li>
 * <li>NOT_SUPPORTED</li>
 * </ul>
 */
export function createAsync(payload: CreateTournamentPayload): Promise<Tournament> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidNumber(payload.initialScore)) {
            throw invalidParams(undefined, WORTAL_API.TOURNAMENT_CREATE_ASYNC, API_URL.TOURNAMENT_CREATE_ASYNC);
        }

        if (platform === "facebook") {
            return config.platformSDK.tournament.createAsync(payload)
                .then((tournament: any) => {
                    return facebookTournamentToWortal(tournament);
                })
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_CREATE_ASYNC, API_URL.TOURNAMENT_CREATE_ASYNC);
                });
        } else if (platform === "debug") {
            return Tournament.mock();
        } else {
            throw notSupported(undefined, WORTAL_API.TOURNAMENT_CREATE_ASYNC);
        }
    });
}

/**
 * Opens the share tournament dialog if the player is currently in a tournament session.
 * @example
 * Wortal.tournament.shareAsync({
 *   score: 3,
 *   data: { myReplayData: '...' }
 * });
 * @param payload Specifies share content.
 * @returns {Promise<void>} Promise that resolves if the tournament is shared, or rejects otherwise.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_OPERATION</li>
 * <li>TOURNAMENT_NOT_FOUND</li>
 * <li>NETWORK_FAILURE</li>
 * <li>NOT_SUPPORTED</li>
 */
export function shareAsync(payload: ShareTournamentPayload): Promise<void> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidNumber(payload.score)) {
            throw invalidParams(undefined, WORTAL_API.TOURNAMENT_SHARE_ASYNC, API_URL.TOURNAMENT_SHARE_ASYNC);
        }

        if (platform === "facebook") {
            return config.platformSDK.tournament.shareAsync(payload)
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_SHARE_ASYNC, API_URL.TOURNAMENT_SHARE_ASYNC);
                });
        } else if (platform === "debug") {
            return;
        } else {
            throw notSupported(undefined, WORTAL_API.TOURNAMENT_SHARE_ASYNC);
        }
    });
}

/**
 * Request a switch into a specific tournament context. If the player is not a participant of the tournament, or there
 * are not any connected players participating in the tournament, this will reject. Otherwise, the promise will resolve
 * when the game has switched into the specified context.
 * @example
 * Wortal.tournament.joinAsync("1234567890")
 *  .then(() => console.log("Switched into tournament!"));
 * @param tournamentID ID of the desired tournament context to switch into.
 * @returns {Promise<void>} Promise that resolves when the game has switched into the specified tournament context, or rejects otherwise.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>INVALID_PARAM</li>
 * <li>INVALID_OPERATION</li>
 * <li>TOURNAMENT_NOT_FOUND</li>
 * <li>SAME_CONTEXT</li>
 * <li>NETWORK_FAILURE</li>
 * <li>USER_INPUT</li>
 * <li>NOT_SUPPORTED</li>
 */
export function joinAsync(tournamentID: string): Promise<void> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(tournamentID)) {
            throw invalidParams(undefined, WORTAL_API.TOURNAMENT_JOIN_ASYNC, API_URL.TOURNAMENT_JOIN_ASYNC);
        }

        if (platform === "facebook") {
            return config.platformSDK.tournament.joinAsync(tournamentID)
                .catch((error: Error_Facebook_Rakuten) => {
                    throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_JOIN_ASYNC, API_URL.TOURNAMENT_JOIN_ASYNC);
                });
        } else if (platform === "debug") {
            return;
        } else {
            throw notSupported(undefined, WORTAL_API.TOURNAMENT_JOIN_ASYNC);
        }
    });
}
