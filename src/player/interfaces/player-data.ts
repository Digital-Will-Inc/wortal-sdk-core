/**
 * Data about a player.
 * @hidden
 */
export interface PlayerData {
    id: string;
    name: string;
    photo: string;
    isFirstPlay: boolean;
    daysSinceFirstPlay: number;
    asid?: string;
}
