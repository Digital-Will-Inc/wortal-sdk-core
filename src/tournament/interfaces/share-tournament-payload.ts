/**
 * Represents content used to share a tournament.
 */
export interface ShareTournamentPayload {
    /**
     * An integer value representing the player's latest score.
     */
    score: number;
    /**
     * A blob of data to attach to the update. Must be less than or equal to 1000 characters when stringified.
     */
    data?: object;
}
