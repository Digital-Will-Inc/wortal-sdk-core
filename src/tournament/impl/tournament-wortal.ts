import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { Tournament } from "../classes/tournament";
import { CreateTournamentPayload } from "../interfaces/create-tournament-payload";
import { ShareTournamentPayload } from "../interfaces/share-tournament-payload";
import { TournamentBase } from "../tournament-base";

/**
 * Wortal implementation of the Tournament API.
 * @hidden
 */
export class TournamentWortal extends TournamentBase {
    constructor() {
        super();
    }

    protected createAsyncImpl(payload: CreateTournamentPayload): Promise<Tournament> {
        throw notSupported(undefined, WORTAL_API.TOURNAMENT_CREATE_ASYNC, API_URL.TOURNAMENT_CREATE_ASYNC);
    }

    protected getAllAsyncImpl(): Promise<Tournament[]> {
        throw notSupported(undefined, WORTAL_API.TOURNAMENT_GET_ALL_ASYNC, API_URL.TOURNAMENT_GET_ALL_ASYNC);
    }

    protected getCurrentAsyncImpl(): Promise<Tournament> {
        throw notSupported(undefined, WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC, API_URL.TOURNAMENT_GET_CURRENT_ASYNC);
    }

    protected joinAsyncImpl(tournamentID: string): Promise<void> {
        throw notSupported(undefined, WORTAL_API.TOURNAMENT_JOIN_ASYNC, API_URL.TOURNAMENT_JOIN_ASYNC);
    }

    protected postScoreAsyncImpl(score: number): Promise<void> {
        throw notSupported(undefined, WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC, API_URL.TOURNAMENT_POST_SCORE_ASYNC);
    }

    protected shareAsyncImpl(payload: ShareTournamentPayload): Promise<void> {
        throw notSupported(undefined, WORTAL_API.TOURNAMENT_SHARE_ASYNC, API_URL.TOURNAMENT_SHARE_ASYNC);
    }

}
