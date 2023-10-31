/**
 * Facebook tournament interface.
 * @hidden
 */
export interface FacebookTournament {
    getID(): string;
    getContextID(): string;
    getEndTime(): number;
    getTitle(): string | null;
    getPayload(): string | null;
}
