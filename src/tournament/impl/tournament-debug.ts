import { Tournament } from "../classes/tournament";
import { CreateTournamentPayload } from "../interfaces/create-tournament-payload";
import { ShareTournamentPayload } from "../interfaces/share-tournament-payload";
import { TournamentBase } from "../tournament-base";

/**
 * Debug implementation of the Tournament API. This is used for testing purposes.
 * @hidden
 */
export class TournamentDebug extends TournamentBase {
    constructor() {
        super();
    }

    protected createAsyncImpl(payload: CreateTournamentPayload): Promise<Tournament> {
        return Promise.resolve(Tournament.mock());
    }

    protected getAllAsyncImpl(): Promise<Tournament[]> {
        return Promise.resolve([Tournament.mock(), Tournament.mock(), Tournament.mock()]);
    }

    protected getCurrentAsyncImpl(): Promise<Tournament> {
        return Promise.resolve(Tournament.mock());
    }

    protected joinAsyncImpl(tournamentID: string): Promise<void> {
        return Promise.resolve();
    }

    protected postScoreAsyncImpl(score: number): Promise<void> {
        return Promise.resolve();
    }

    protected shareAsyncImpl(payload: ShareTournamentPayload): Promise<void> {
        return Promise.resolve();
    }

}
