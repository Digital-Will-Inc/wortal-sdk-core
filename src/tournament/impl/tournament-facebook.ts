import { API_URL, WORTAL_API } from "../../data/core-data";
import { invalidOperation, operationFailed, rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Facebook } from "../../errors/interfaces/facebook-error";
import Wortal from "../../index";
import { isValidString } from "../../utils/validators";
import { Tournament } from "../classes/tournament";
import { CreateTournamentPayload } from "../interfaces/create-tournament-payload";
import { FacebookTournament } from "../interfaces/facebook-tournament";
import { ShareTournamentPayload } from "../interfaces/share-tournament-payload";
import { TournamentBase } from "../tournament-base";

/**
 * Facebook implementation of the Tournament API.
 * @hidden
 */
export class TournamentFacebook extends TournamentBase {
    constructor() {
        super();
    }

    protected createAsyncImpl(payload: CreateTournamentPayload): Promise<Tournament> {
        return Wortal._internalPlatformSDK.tournament.createAsync(payload)
            .then((tournament: FacebookTournament) => {
                return this._convertFacebookTournamentToWortal(tournament);
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_CREATE_ASYNC, API_URL.TOURNAMENT_CREATE_ASYNC);
            });
    }

    protected getAllAsyncImpl(): Promise<Tournament[]> {
        return Wortal._internalPlatformSDK.tournament.getTournamentsAsync()
            .then((tournaments: FacebookTournament[]) => {
                return tournaments.map((tournament: FacebookTournament) => {
                    return this._convertFacebookTournamentToWortal(tournament);
                });
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_GET_ALL_ASYNC, API_URL.TOURNAMENT_GET_ALL_ASYNC);
            });
    }

    protected getCurrentAsyncImpl(): Promise<Tournament> {
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
        return this.getAllAsyncImpl()
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
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC, API_URL.TOURNAMENT_GET_CURRENT_ASYNC);
            });
    }

    protected joinAsyncImpl(tournamentID: string): Promise<void> {
        return Wortal._internalPlatformSDK.tournament.joinAsync(tournamentID)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_JOIN_ASYNC, API_URL.TOURNAMENT_JOIN_ASYNC);
            });
    }

    protected postScoreAsyncImpl(score: number): Promise<void> {
        return Wortal._internalPlatformSDK.tournament.postScoreAsync(score)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC, API_URL.TOURNAMENT_POST_SCORE_ASYNC);
            });
    }

    protected shareAsyncImpl(payload: ShareTournamentPayload): Promise<void> {
        return Wortal._internalPlatformSDK.tournament.shareAsync(payload)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.TOURNAMENT_SHARE_ASYNC, API_URL.TOURNAMENT_SHARE_ASYNC);
            });
    }

    private _convertFacebookTournamentToWortal(tournament: FacebookTournament): Tournament {
        return new Tournament(
            tournament.getID(), tournament.getContextID(), tournament.getEndTime(), tournament.getTitle() || "", tournament.getPayload() || ""
        );
    }

}
