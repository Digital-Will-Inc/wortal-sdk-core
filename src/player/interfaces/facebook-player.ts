/**
 * Represents app-scoped user id of current player along with a signature to verify that it indeed comes from Facebook.
 */
export interface SignedASID {
    /**
     * The ID of the player
     */
    asid: string;
    /**
     * A signature to verify this object indeed comes from Facebook. The string is base64url encoded and signed with an
     * HMAC version of your App Secret, based on the OAuth 2.0 spec.
     *
     * You can validate it with the following 4 steps:
     *
     * - Split the signature into two parts delimited by the '.' character.
     * - Decode the first part (the encoded signature) with base64url encoding.
     * - Decode the second part (the response payload) with base64url encoding, which should be a string representation of a JSON object that has the following fields: ** algorithm - always equals to HMAC-SHA256 ** issued_at - a unix timestamp of when this response was issued. ** asid - the app-scoped user id of the player.
     * - Hash the whole response payload string using HMAC SHA-256 and your app secret and confirm that it is equal to the encoded signature.
     * - You may also wish to validate the issued_at timestamp in the response payload to ensure the request was made recently.
     *
     * Signature validation should only happen on your server. Never do it on the client side as it will compromise your app secret key.
     */
    signature: string;
}

/**
 * Facebook Instant Games SDK player interface.
 * @hidden
 */
export interface ConnectedPlayer_Facebook {
    getID(): string;
    getName(): string;
    getPhoto(): string;
}

/**
 * Facebook Instant Games SDK SignedPlayerInfo interface.
 * @see SignedPlayerInfo
 * @hidden
 */
export interface SignedPlayerInfo_Facebook {
    getPlayerID(): string;
    getSignature(): string;
}

/**
 * Facebook Instant Games SDK SignedASID interface.
 * @see SignedASID
 * @hidden
 */
export interface SignedASID_Facebook {
    getASID(): string;
    getSignature(): string;
}
