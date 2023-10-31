import { CreateTournamentConfig } from "./create-tournament-config";

/**
 * Represents settings used for tournament.createAsync.
 */
export interface CreateTournamentPayload {
    /**
     * An integer value representing the player's score which will be the first score in the tournament.
     */
    initialScore: number;
    /**
     * An object holding configurations for the tournament.
     */
    config: CreateTournamentConfig;
    /**
     * A blob of data to attach to the update. All game sessions launched from the update will be able to access this
     * blob from the payload on the tournament. Must be less than or equal to 1000 characters when stringified.
     */
    data?: object;
}
