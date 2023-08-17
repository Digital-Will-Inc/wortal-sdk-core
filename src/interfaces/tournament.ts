import { ScoreFormat, SortOrder } from "../types/tournament";

/**
 * Represents settings used for tournament.createAsync.
 */
export interface CreateTournamentPayload {
    /**
     * An integer value representing the player's score which will be the first score in the tournament.
     */
    initialScore: number;
    /**
     * An object holding optional configurations for the tournament.
     */
    config: CreateTournamentConfig;
    /**
     * A blob of data to attach to the update. All game sessions launched from the update will be able to access this
     * blob from the payload on the tournament. Must be less than or equal to 1000 characters when stringified.
     */
    data?: object;
}

/**
 * Represents the configurations used in creating a tournament.
 */
export interface CreateTournamentConfig {
    /**
     * Optional text title for the tournament.
     */
    title?: string;
    /**
     * Optional base64 encoded image that will be associated with the tournament and included in posts sharing the tournament.
     */
    image?: string;
    /**
     * Optional input for the ordering of which score is best in the tournament. The options are 'HIGHER_IS_BETTER'
     * or 'LOWER_IS_BETTER'. If not specified, the default is 'HIGHER_IS_BETTER'.
     */
    sortOrder?: SortOrder;
    /**
     * Optional input for the formatting of the scores in the tournament leaderboard. The options are 'NUMERIC'
     * or 'TIME'. If not specified, the default is 'NUMERIC'.
     */
    scoreFormat?: ScoreFormat;
    /**
     * Optional input for setting a custom end time for the tournament. The number passed in represents a
     * unix timestamp. If not specified, the tournament will end one week after creation.
     */
    endTime?: number;
}

/**
 * Represents content used to share a tournament.
 */
export interface ShareTournamentPayload {
    /**
     * An optional integer value representing the player's latest score.
     */
    score: number;
    /**
     * A blob of data to attach to the update. Must be less than or equal to 1000 characters when stringified.
     */
    data?: object;
}

/** @hidden */
export interface TournamentData {
    id: string;
    contextID: string;
    endTime: number;
    title?: string;
    payload?: object;
}
