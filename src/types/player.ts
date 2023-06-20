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
    /**
     * Specify where to start fetch the friend list. This parameter only applies when NEW_INVITATIONS_ONLY filter is used.
     * When not specified with NEW_INVITATIONS_ONLY filter, default cursor is 0.
     */
    cursor?: number;
    /**
     * Filter to be applied to the friend list.
     */
    filter?: ConnectedPlayerFilter;
    /**
     * Specify how long a friend should be filtered out after the current player sends him/her a message.
     * This parameter only applies when NEW_INVITATIONS_ONLY filter is used.
     * When not specified, it will filter out any friend who has been sent a message.
     */
    hoursSinceInvitation?: number;
    /**
     * Specify how many friends to be returned in the friend list.
     * This parameter only applies when NEW_INVITATIONS_ONLY filter is used.
     * When not specified with NEW_INVITATIONS_ONLY filter, default cursor is 25.
     */
    size?: number;
}

/**
 * Filter used when searching for connected players.
 */
export type ConnectedPlayerFilter = 'ALL' | 'INCLUDE_PLAYERS' | 'INCLUDE_NON_PLAYERS' | 'NEW_INVITATIONS_ONLY'
