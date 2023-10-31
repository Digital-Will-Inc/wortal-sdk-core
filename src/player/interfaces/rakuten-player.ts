/**
 * Link and Viber SDK player object.
 * @hidden
 */
export interface ConnectedPlayer_Link_Viber {
    getID(): string;
    getName(): string;
    getPhoto(): string;
    hasPlayed(): boolean;
}

/**
 * Link and Viber SignedPlayerInfo interface.
 * @see SignedPlayerInfo
 * @hidden
 */
export interface SignedPlayerInfo_Link_Viber {
    getPlayerID(): string;
    getSignature(): string;
}
