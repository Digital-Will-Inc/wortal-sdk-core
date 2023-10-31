import { ConnectedPlayer } from "./classes/connected-player";
import { Player } from "./classes/player";
import { ConnectedPlayerPayload } from "./interfaces/connected-player-payload";
import { SignedASID } from "./interfaces/facebook-player";
import { SignedPlayerInfo } from "./interfaces/signed-player-info";
import { PlayerBase } from "./player-base";

/**
 * The Player API provides access to information about the current player, such as their name, ID, and profile picture.
 * It also provides access to the player's cloud storage, which can be used to persist data across sessions. The player's
 * connected friends can also be retrieved, which can be used to provide a social experience in the game.
 * @module Player
 */
export class PlayerAPI {
    private _player: PlayerBase;

    constructor(impl: PlayerBase) {
        this._player = impl;
    }

    /** @internal */
    get _internalPlayer(): Player {
        return this._player._internalPlayer;
    }

    /** @internal */
    set _internalPlayer(player: Player) {
        this._player._internalPlayer = player;
    }

    /**
     * Checks if the current user can subscribe to the game's bot.
     * @example
     * Wortal.player.canSubscribeBotAsync()
     * .then(canSubscribe => console.log("Can subscribe to bot: " + canSubscribe));
     * @returns {Promise<boolean>} Promise that resolves whether a player can subscribe to the game bot or not. Developer can only call
     * `player.subscribeBotAsync()` after checking `player.canSubscribeBotAsync()`, and the game will only be able to show the player their
     * bot subscription dialog once per week.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>RATE_LIMITED</li>
     * <li>INVALID_OPERATION</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * </ul>
     */
    public canSubscribeBotAsync(): Promise<boolean> {
        return this._player.canSubscribeBotAsync();
    }

    /**
     * Flushes any unsaved data to the platform's storage. This function is expensive, and should primarily be used for
     * critical changes where persistence needs to be immediate and known by the game. Non-critical changes should rely on
     * the platform to persist them in the background.
     *
     * NOTE: Calls to `player.setDataAsync` will be rejected while this function's result is pending.
     * @example
     * Wortal.player.flushDataAsync()
     *  .then(() => console.log("Data flushed."));
     * @returns {Promise<void>} Promise that resolves when changes have been persisted successfully, and rejects if the save fails.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>PENDING_REQUEST</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * </ul>
     */
    public flushDataAsync(): Promise<void> {
        return this._player.flushDataAsync();
    }

    /**
     * A unique identifier for the player. This is the standard Facebook Application-Scoped ID which is used for all Graph
     * API calls. If your game shares an AppID with a native game this is the ID you will see in the native game too.
     * @example
     * Wortal.player.getASIDAsync()
     * .then(asid => console.log("Player ASID: " + asid));
     * @returns {Promise<string>} A unique identifier for the player. String is nullable.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>RETHROW_FROM_PLATFORM</li>
     * </ul>
     */
    public getASIDAsync(): Promise<string> {
        return this._player.getASIDAsync();
    }

    /**
     * Fetches an array of ConnectedPlayer objects containing information about active players that are connected to the current player.
     *
     * PLATFORM NOTE: Facebook does not support the payload parameter or any filters, it will always return the list of
     * connected players who have played the game in the last 90 days. Facebook also requires the user_data permission to
     * be granted to the game in order to use this API.
     * @example
     * Wortal.player.getConnectedPlayersAsync({
     *     filter: 'ALL',
     *     size: 20,
     *     hoursSinceInvitation: 4,
     * }).then(players => console.log(players.length));
     * @param payload Options for the friends to get.
     * @returns {Promise<ConnectedPlayer[]>} Promise that resolves with a list of connected player objects.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>NETWORK_FAILURE</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * </ul>
     */
    public getConnectedPlayersAsync(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        return this._player.getConnectedPlayersAsync(payload);
    }

    /**
     * Retrieve data from the designated cloud storage of the current player.
     *
     * PLATFORM NOTE: JSON objects stored as string values will be returned back as JSON objects on Facebook.
     * @example
     * Wortal.player.getDataAsync(['items', 'lives'])
     *  .then(data => {
     *      console.log(data['items']);
     *      console.log(data['lives']);
     *  });
     * @param keys Array of keys for the data to get.
     * @returns {Promise<any>} Promise that resolves with an object which contains the current key-value pairs for each
     * key specified in the input array, if they exist.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * </ul>
     */
    public getDataAsync(keys: string[]): Promise<any> {
        return this._player.getDataAsync(keys);
    }

    /**
     * Gets the player's ID from the platform.
     * @example
     * Wortal.player.getID(); // 'Player123ABC'
     * @returns {string | null} The player's ID.
     */
    public getID(): string | null {
        return this._player.getID();
    }

    /**
     * Gets the player's name on the platform.
     * @example
     * Wortal.player.getName(); // 'Ragnar Lothbrok'
     * @returns {string | null} The player's name.
     */
    public getName(): string | null {
        return this._player.getName();
    }

    /**
     * Gets the player's photo from the platform.
     * @example
     * Wortal.player.getPhoto();
     * @returns {string | null} URL of image for the player's photo.
     */
    public getPhoto(): string | null {
        return this._player.getPhoto();
    }

    /**
     * A unique identifier for the player. This is the standard Facebook Application-Scoped ID which is used for all Graph
     * API calls. If your game shares an AppID with a native game this is the ID you will see in the native game too.
     * @example
     * Wortal.player.getSignedASIDAsync()
     *  .then(info => {
     *     myServer.validate(
     *     info.asid,
     *     info.signature,
     *     );
     *   });
     * @returns {Promise<SignedASID>} Promise that resolves with an object containing player ASID and signature.
     * @see SignedASID
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>RETHROW_FROM_PLATFORM</li>
     * </ul>
     */
    public getSignedASIDAsync(): Promise<SignedASID> {
        return this._player.getSignedASIDAsync();
    }

    /**
     * Gets a signed player object that includes the player ID and signature for validation. This can be used to
     * send something to a backend server for validation, such as game or purchase data.
     * @example
     * Wortal.player.getSignedPlayerInfoAsync()
     *  .then(info => {
     *      myServer.validate(
     *          info.id,
     *          info.signature,
     *          gameDataToValidate,
     *      )
     *  });
     * @returns {Promise<object>} Promise that resolves with an object containing the player ID and signature.
     * @see Signature
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * </ul>
     */
    public getSignedPlayerInfoAsync(): Promise<SignedPlayerInfo> {
        return this._player.getSignedPlayerInfoAsync();
    }

    /**
     * Gets the player token from the platform.
     * @example
     * Wortal.player.getTokenAsync()
     * .then(token => console.log("Player token: " + token));
     * @returns {Promise<string>} Promise that resolves with the player token.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>AUTH_NOT_ENABLED</li>
     * <li>USER_NOT_AUTHENTICATED</li>
     * <li>UNKNOWN</li>
     * <li>NOT_SUPPORTED</li>
     * </ul>
     */
    public getTokenAsync(): Promise<string | undefined> {
        return this._player.getTokenAsync();
    }

    /**
     * Checks whether this is the first time the player has played this game.
     * @example
     * if (Wortal.player.isFirstPlay()) {
     *    // Show tutorial
     *    Wortal.player.setDataAsync({ tutorialShown: true });
     * }
     * @returns {boolean} True if it is the first play. Some platforms do not have data persistence and always return true.
     */
    public isFirstPlay(): boolean {
        return this._player.isFirstPlay();
    }

    /**
     * Registers a callback to be called when the player logs in or registers for an account.
     * @param callback Callback to be called when the player logs in or registers for an account.
     * @example
     * Wortal.player.onLogin(() => console.log("Player logged in or registered"));
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * </ul>
     */
    public onLogin(callback: () => void): void {
        this._player.onLogin(callback);
    }

    /**
     * Set data to be saved to the designated cloud storage of the current player.
     *
     * PLATFORM NOTE: Facebook/Link allow storage up to 1MB of data for each unique player.
     *
     * PLATFORM NOTE: Viber allows storage up to 1000 characters when stringified.
     * @example
     * Wortal.player.setDataAsync({
     *     items: {
     *         coins: 100,
     *         boosters: 2
     *     },
     *     lives: 3,
     * });
     * @param data An object containing a set of key-value pairs that should be persisted to cloud storage. The object must
     * contain only serializable values - any non-serializable values will cause the entire modification to be rejected.
     * @returns {Promise<void>} Promise that resolves when the input values are set.
     *
     * NOTE: The promise resolving does not necessarily mean that the input has already been persisted. Rather, it means
     * that the data was valid and has been scheduled to be saved. It also guarantees that all values that were set are now
     * available in `player.getDataAsync`.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>NETWORK_FAILURE</li>
     * <li>PENDING_REQUEST</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * </ul>
     */
    public setDataAsync(data: Record<string, unknown>): Promise<void> {
        return this._player.setDataAsync(data);
    }

    /**
     * Request that the player subscribe the bot associated to the game. The API will reject if the subscription fails -
     * else, the player will subscribe the game bot.
     * @example
     * Wortal.player.subscribeBotAsync()
     * .then(() => console.log("Player subscribed to bot"));
     * @returns {Promise<void>} Promise that resolves if player successfully subscribed to the game bot, or rejects if
     * request failed or player chose to not subscribe.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>INVALID_PARAM</li>
     * <li>PENDING_REQUEST</li>
     * <li>CLIENT_REQUIRES_UPDATE</li>
     * </ul>
     */
    public subscribeBotAsync(): Promise<void> {
        return this._player.subscribeBotAsync();
    }
}
