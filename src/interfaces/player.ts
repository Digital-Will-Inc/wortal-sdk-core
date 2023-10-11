import { ConnectedPlayerFilter } from "../types/player";

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

/** @hidden */
export interface PlayerData {
    id: string;
    name: string;
    photo: string;
    isFirstPlay: boolean;
    daysSinceFirstPlay: number;
    asid?: string;
}

/** @hidden */
export interface TelegramPlayer {
    id: string;
    username: string;
}
