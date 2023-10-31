import { API_URL, WORTAL_API } from "../data/core-data";
import { invalidParams } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { apiCall, internalCall } from "../utils/logger";
import { isValidString } from "../utils/validators";
import { GameState } from "./classes/game-state";
import { Session } from "./classes/session";
import { TrafficSource } from "./interfaces/traffic-source";
import { Device, Orientation, Platform } from "./types/session-types";

/**
 * Base class for Session API. Extend this class to implement the Session API on a specific platform.
 * @hidden
 */
export abstract class SessionBase {
    protected _session: Session;
    protected _game: GameState;

    constructor() {
        this._game = new GameState();
        this._session = new Session();
    }

    /** @internal */
    get _internalGameState(): GameState {
        return this._game;
    }

    /** @internal */
    get _internalSession(): Session {
        return this._session;
    }

//#region Public API

    public gameplayStart(): void {
        apiCall(WORTAL_API.SESSION_GAMEPLAY_START);

        return this.gameplayStartImpl();
    }

    public gameplayStop(): void {
        apiCall(WORTAL_API.SESSION_GAMEPLAY_STOP);

        return this.gameplayStopImpl();
    }

    public getDevice(): Device {
        apiCall(WORTAL_API.SESSION_GET_DEVICE);

        return this.getDeviceImpl();
    }

    public getEntryPointAsync(): Promise<string> {
        apiCall(WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC);

        return this.getEntryPointAsyncImpl();
    }

    public getEntryPointData(): Record<string, unknown> {
        apiCall(WORTAL_API.SESSION_GET_ENTRY_POINT_DATA);

        return this.getEntryPointDataImpl();
    }

    public getLocale(): string {
        apiCall(WORTAL_API.SESSION_GET_LOCALE);

        return this.getLocaleImpl();
    }

    public getOrientation(): Orientation {
        apiCall(WORTAL_API.SESSION_GET_ORIENTATION);

        const portrait = window.matchMedia("(orientation: portrait)").matches;
        if (portrait) {
            return "portrait";
        } else {
            return "landscape";
        }
    }

    public getPlatform(): Platform {
        apiCall(WORTAL_API.SESSION_GET_PLATFORM);

        return Wortal._internalPlatform;
    }

    public getTrafficSource(): TrafficSource {
        apiCall(WORTAL_API.SESSION_GET_TRAFFIC_SOURCE);

        return this.getTrafficSourceImpl();
    }

    public happyTime(): void {
        apiCall(WORTAL_API.SESSION_HAPPY_TIME);

        return this.happyTimeImpl();
    }

    public onOrientationChange(callback: (orientation: Orientation) => void): void {
        apiCall(WORTAL_API.SESSION_ON_ORIENTATION_CHANGE);

        const validationResult = this.validateOnOrientationChange(callback);
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        window.matchMedia("(orientation: portrait)").addEventListener("change", event => {
            const portrait = event.matches;
            if (portrait) {
                callback("portrait");
            } else {
                callback("landscape");
            }
        });
    }

    public setSessionData(data: Record<string, unknown>): void {
        apiCall(WORTAL_API.SESSION_SET_SESSION_DATA);

        return this.setSessionDataImpl(data);
    }

    public switchGameAsync(gameID: string, data?: object): Promise<void> {
        apiCall(WORTAL_API.SESSION_SWITCH_GAME_ASYNC);

        const validationResult = this.validateSwitchGameAsync(gameID, data);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.switchGameAsyncImpl(gameID, data);
    }

//#endregion
//#region Internal API

    _gameLoadingStart(): void {
        internalCall(WORTAL_API.SESSION_GAME_LOADING_START);

        return this._gameLoadingStartImpl();
    }

    _gameLoadingStop(): void {
        internalCall(WORTAL_API.SESSION_GAME_LOADING_STOP);

        return this._gameLoadingStopImpl();
    }

//#endregion
//#region Implementation interface

    protected abstract gameplayStartImpl(): void;
    protected abstract gameplayStopImpl(): void;
    protected abstract getDeviceImpl(): Device;
    protected abstract getEntryPointAsyncImpl(): Promise<string>;
    protected abstract getEntryPointDataImpl(): Record<string, unknown>;
    protected abstract getLocaleImpl(): string;
    protected abstract getTrafficSourceImpl(): TrafficSource;
    protected abstract happyTimeImpl(): void;
    protected abstract setSessionDataImpl(data: Record<string, unknown>): void;
    protected abstract switchGameAsyncImpl(gameID: string, data?: object): Promise<void>;

    protected abstract _gameLoadingStartImpl(): void;
    protected abstract _gameLoadingStopImpl(): void;

//#endregion
//#region Validation

    protected validateOnOrientationChange(callback: (orientation: Orientation) => void): ValidationResult {
        if (typeof callback !== "function") {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.SESSION_ON_ORIENTATION_CHANGE, API_URL.SESSION_ON_ORIENTATION_CHANGE),
            };
        }

        return { valid: true }
    }

    protected validateSwitchGameAsync(gameID: string, data?: object): ValidationResult {
        if (!isValidString(gameID)) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.SESSION_SWITCH_GAME_ASYNC, API_URL.SESSION_SWITCH_GAME_ASYNC),
            };
        }

        return { valid: true }
    }

//#endregion
}
