import ConnectedPlayerViber from "../../models/rakuten/connected-player-viber";

export interface PlayerDataViber {
    [key: string]: any;
}

/** @hidden */
export interface PlayerRawDataViber {
    id: string,
    name: string,
    photo: string,
    hasPlayed: boolean,
}

/** @hidden */
export interface CurrentPlayerViber {
    name: string | null,
    id: string | null,
    photo: string | null,
    connectedPlayers: ConnectedPlayerViber[],
}

/** @hidden */
export interface InitializeResponsePlayerViber {
    name: string,
    id: string,
    photo: string,
    connectedPlayers: PlayerRawDataViber[],
}

/**
 * Defines the filtering behavior
 *
 * `ALL` enlists all friends.
 * `INCLUDE_PLAYERS` only enlists friends who have played this game before.
 * `INCLUDE_NON_PLAYERS` only enlists friends who haven't played this game before.
 * `NEW_INVITATIONS_ONLY` only enlists friends who haven't been sent an in-game message before. This filter can be fine-tuned with `hoursSinceInvitation` parameter and return list is depended on `cursor` and `size` parameter.
 */
export type ConnectedPlayerFilterViber = 'ALL'
    | 'INCLUDE_PLAYERS'
    | 'INCLUDE_NON_PLAYERS'
    | 'NEW_INVITATIONS_ONLY'

export interface GetConnectedPlayersPayloadViber {
    /**
     * Filter to be applied to the friend list.
     */
    filter?: ConnectedPlayerFilterViber
    /**
     * Specify how long a friend should be filtered out after the current player sends him/her a message.
     * This parameter only applies when `NEW_INVITATIONS_ONLY` filter is used.
     * When not specified, it will filter out any friend who has been sent a message.
     */
    hoursSinceInvitation?: number,
    /**
     * Specify where to start fetch the friend list.
     * This parameter only applies when `NEW_INVITATIONS_ONLY` filter is used.
     * When not specified with `NEW_INVITATIONS_ONLY` filter, default cursor is 0.
     */
    cursor?: number,
    /**
     * Specify how many friends to be returned in the friend list.
     * This parameter only applies when `NEW_INVITATIONS_ONLY` filter is used.
     * When not specified with `NEW_INVITATIONS_ONLY` filter, default cursor is 25.
     */
    size?: number,
}
