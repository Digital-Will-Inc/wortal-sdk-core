/** @hidden */
export interface PlayerData {
    id: string;
    name: string;
    photo: string;
    isFirstPlay: boolean;
    daysSinceFirstPlay: number;
}

/** @hidden */
export interface ConnectedPlayerPayload {
    cursor?: number;
    filter?: ConnectedPlayerFilter;
    hoursSinceInvitation?: number;
    size?: number;
}

/** @hidden */
export type ConnectedPlayerFilter = 'ALL' | 'INCLUDE_PLAYERS' | 'INCLUDE_NON_PLAYERS' | 'NEW_INVITATIONS_ONLY'
