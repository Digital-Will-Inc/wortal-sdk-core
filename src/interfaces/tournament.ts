import { ScoreFormat, SortOrder } from "../types/tournament";

/**
 * Represents the configurations used in creating a tournament.
 */
export interface CreateTournamentConfig {
    /**
     * Optional text title for the tournament.
     */
    title?: string;
    /**
     * Optional boolean that specifies if the tournament requires game server validation before a score can be
     * added to or updated on the leaderboard.
     */
    forceScoreValidation?: boolean;
    /**
     * Optional boolean that specifies if the tournament should use score range validation. If true, then minimum
     * and/or maximum scores should be provided; scores falling outside the range will be automatically rejected.
     * If either minimum or maximum is null, then that side of the range will be ignored.
     */
    forceScoreRangeValidation?: boolean;
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
    /**
     * Optional input will only be used if forceScoreRangeValidation is true. If it is, scores below this will be
     * automatically rejected. If null or forceScoreRangeValidation is false, no minimum will be used.
     */
    minimumScore?: number;
    /**
     * Optional input will only be used if forceScoreRangeValidation is true. If it is, scores above this will be
     * automatically rejected. If null or forceScoreRangeValidation is false, no maximum will be used.
     */
    maximumScore?: number;
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
    data?: Object;
}

/** @hidden */
export interface TournamentData {
    id: string;
    contextID: string;
    endTime: number;
    title?: string;
    payload?: string;
}
