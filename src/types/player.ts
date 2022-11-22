/** @hidden */
export interface PlayerData {
    id: string;
    name: string;
    photo: string;
    isFirstPlay: boolean;
    daysSinceFirstPlay: number;
}

/**
 * Payload used to find connected players.
 */
export interface ConnectedPlayerPayload {
    cursor?: number;
    filter?: ConnectedPlayerFilter;
    hoursSinceInvitation?: number;
    size?: number;
}

/**
 * Filter used when searching for connected players.
 */
export type ConnectedPlayerFilter = 'ALL' | 'INCLUDE_PLAYERS' | 'INCLUDE_NON_PLAYERS' | 'NEW_INVITATIONS_ONLY'
