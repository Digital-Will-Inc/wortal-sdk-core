import { GameState } from "./classes/game-state";
import { Session } from "./classes/session";
import { TrafficSource } from "./interfaces/traffic-source";
import { SessionBase } from "./session-base";
import { Device, Orientation, Platform } from "./types/session-types";

/**
 * The Session API provides information about the player's session. This includes information about the device, platform, and locale.
 * It also provides information about the entry point that the game was launched from, and any data associated with that entry point.
 * @module Session
 */
export class SessionAPI {
    private _session: SessionBase;

    constructor(impl: SessionBase) {
        this._session = impl;
    }

    /** @internal */
    get _internalGameState(): GameState {
        return this._session._internalGameState;
    }

    /** @internal */
    get _internalSession(): Session {
        return this._session._internalSession;
    }

//#region Public API

    /**
     * Tracks the start of a gameplay session, including resuming play after a break.
     * Call whenever the player starts playing or resumes playing after a break
     * (menu/loading/achievement screen, game paused, etc.).
     * @example
     * // Player closes in-game menu and resumes playing
     * Wortal.session.gameplayStart();
     */
    public gameplayStart(): void {
        return this._session.gameplayStart();
    }

    /**
     * Tracks the end of a gameplay session, including pausing play or opening a menu.
     * Call on every game break (entering a menu, switching level, pausing the game, ...)
     * @example
     * // Player opens in-game menu
     * Wortal.session.gameplayStop();
     */
    public gameplayStop(): void {
        return this._session.gameplayStop();
    }

    /**
     * Gets the device the player is using. This is useful for device specific code.
     * @example
     * const device = Wortal.session.getDevice();
     * console.log(device);
     * @returns {Device} Device the player is using.
     */
    public getDevice(): Device {
        return this._session.getDevice();
    }

    /**
     * Returns the entry point that the game was launched from.
     * @example
     * Wortal.session.getEntryPointAsync()
     *  .then(entryPoint => console.log(entryPoint);
     * @returns {Promise<string>} Promise that resolves with the name of the entry point from which the user started the game.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>RETHROW_FROM_PLATFORM</li>
     * </ul>
     */
    public getEntryPointAsync(): Promise<string> {
        return this._session.getEntryPointAsync();
    }

    /**
     * Returns any data object associated with the entry point that the game was launched from.
     *
     * The contents of the object are developer-defined, and can occur from entry points on different platforms.
     * This will return null for older mobile clients, as well as when there is no data associated with the particular entry point.
     * @example
     * const data = Wortal.session.getEntryPointData();
     * console.log(data.property);
     * @returns {Record<string, unknown>} Data about the entry point or an empty object if none exists.
     */
    public getEntryPointData(): Record<string, unknown> {
        return this._session.getEntryPointData();
    }

    /**
     * Gets the locale the player is using. This is useful for localizing your game.
     * @example
     * const lang = Wortal.session.getLocale();
     * @returns {string} Locale in [BCP47](http://www.ietf.org/rfc/bcp/bcp47.txt) format.
     */
    public getLocale(): string {
        return this._session.getLocale();
    }

    /**
     * Gets the orientation of the device the player is using. This is useful for determining how to display the game.
     * @example
     * const orientation = Wortal.session.getOrientation();
     * if (orientation === 'portrait') {
     *    // Render portrait mode.
     * }
     * @returns {Orientation} Orientation of the device the player is using.
     */
    public getOrientation(): Orientation {
        return this._session.getOrientation();
    }

    /**
     * Gets the platform the game is running on. This is useful for platform specific code.
     * For example, if you want to show a different social share asset on Facebook than on Link.
     * @example
     * const platform = Wortal.session.getPlatform();
     * console.log(platform);
     * @returns {Platform} Platform the game is running on.
     */
    public getPlatform(): Platform {
        return this._session.getPlatform();
    }

    /**
     * Gets the traffic source info for the game. This is useful for tracking where players are coming from.
     * For example, if you want to track where players are coming from for a specific campaign.
     * @example
     * const source = Wortal.session.getTrafficSource();
     * console.log(source['r_entrypoint']);
     * console.log(source['utm_source']);
     * @returns {TrafficSource} URL parameters attached to the game.
     */
    public getTrafficSource(): TrafficSource {
        return this._session.getTrafficSource();
    }

    /**
     * The happyTimeAsync method can be called on various player achievements (beating a boss, reaching a high score, etc.).
     * It makes the website celebrate (for example by launching some confetti). There is no need to call this when a level
     * is completed, or an item is obtained.
     * @example
     * // Player defeats a boss
     * Wortal.session.happyTime();
     */
    public happyTime(): void {
        return this._session.happyTime();
    }

    /**
     * Assigns a callback to be invoked when the orientation of the device changes.
     * @example
     * Wortal.session.onOrientationChange(orientation => {
     *    if (orientation === 'portrait') {
     *      // Render portrait mode
     *    }
     * });
     * @param callback Callback to be invoked when the orientation of the device changes.
     */
    public onOrientationChange(callback: (orientation: Orientation) => void): void {
        return this._session.onOrientationChange(callback);
    }

    /**
     * Sets the data associated with the individual gameplay session for the current context.
     *
     * This function should be called whenever the game would like to update the current session data.
     * This session data may be used to populate a variety of payloads, such as game play webhooks.
     * @example
     * Wortal.session.setSessionData({
     *     'high-score': 100,
     *     'current-level': 2,
     * });
     * @param data An arbitrary data object, which must be less than or equal to 1000 characters when stringified.
     */
    public setSessionData(data: Record<string, unknown>): void {
        return this._session.setSessionData(data);
    }

    /**
     * Request to switch to another game. The API will reject if the switch fails - else, the client will load the new game.
     * @example
     * Wortal.session.switchGameAsync(
     *   '12345678',
     *   { referrer: 'game_switch', reward_coins: 30 });
     * @param gameID ID of the game to switch to. The application must be a Wortal game.
     * @param data An optional data payload. This will be set as the entrypoint data for the game being switched to. Must be less than or equal to 1000 characters when stringified.
     * @returns {Promise<void>} Promise that resolves when the game has switched. If the game fails to switch, the promise will reject.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>INVALID_PARAMS</li>
     * <li>USER_INPUT</li>
     * <li>PENDING_REQUEST</li>
     * <li>CLIENT_REQUIRES_UPDATE</li>
     * <li>NOT_SUPPORTED</li>
     * </ul>
     */
    public switchGameAsync(gameID: string, data?: object): Promise<void> {
        return this._session.switchGameAsync(gameID, data);
    }

//#endregion
//#region Internal API

    /** @internal */
    _gameLoadingStart(): void {
        return this._session._gameLoadingStart();
    }

    /** @internal */
    _gameLoadingStop(): void {
        return this._session._gameLoadingStop();
    }

//#endregion
}
