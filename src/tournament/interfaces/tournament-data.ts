/**
 * Data about a tournament.
 * @hidden
 */
export interface TournamentData {
    id: string;
    contextID: string;
    endTime: number;
    title?: string;
    payload?: object;
}
