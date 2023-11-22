import { API_URL, WORTAL_API } from "../data/core-data";
import { implementationError, invalidParams, notInitialized } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { isValidString } from "../utils/validators";
import { GameState } from "./classes/game-state";
import { Session } from "./classes/session";
import { TrafficSource } from "./interfaces/traffic-source";
import { Device, Orientation, Platform } from "./types/session-types";

/**
 * Base class for Session API. Extend this class to implement the Session API on a specific platform.
 * @hidden
 */
export class SessionBase {
    protected _session: Session;
    protected _game: GameState;

    constructor(game: GameState, session: Session) {
        this._game = game;
        this._session = session;
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
        Wortal._log.apiCall(WORTAL_API.SESSION_GAMEPLAY_START);

        const validationResult = this.validateGameplayStart();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.gameplayStartImpl();
    }

    public gameplayStop(): void {
        Wortal._log.apiCall(WORTAL_API.SESSION_GAMEPLAY_STOP);

        const validationResult = this.validateGameplayStop();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.gameplayStopImpl();
    }

    public getDevice(): Device {
        Wortal._log.apiCall(WORTAL_API.SESSION_GET_DEVICE);

        return this.getDeviceImpl();
    }

    public getEntryPointAsync(): Promise<string> {
        Wortal._log.apiCall(WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC);

        const validationResult = this.validateGetEntryPointAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getEntryPointAsyncImpl();
    }

    public getEntryPointData(): Record<string, unknown> {
        Wortal._log.apiCall(WORTAL_API.SESSION_GET_ENTRY_POINT_DATA);

        const validationResult = this.validateGetEntryPointData();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.getEntryPointDataImpl();
    }

    public getLocale(): string {
        Wortal._log.apiCall(WORTAL_API.SESSION_GET_LOCALE);

        return this.getLocaleImpl();
    }

    public getOrientation(): Orientation {
        Wortal._log.apiCall(WORTAL_API.SESSION_GET_ORIENTATION);

        const portrait = window.matchMedia("(orientation: portrait)").matches;
        if (portrait) {
            return "portrait";
        } else {
            return "landscape";
        }
    }

    public getPlatform(): Platform {
        Wortal._log.apiCall(WORTAL_API.SESSION_GET_PLATFORM);

        return Wortal._internalPlatform;
    }

    public getTrafficSource(): TrafficSource {
        Wortal._log.apiCall(WORTAL_API.SESSION_GET_TRAFFIC_SOURCE);

        const validationResult = this.validateGetTrafficSource();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.getTrafficSourceImpl();
    }

    public happyTime(): void {
        Wortal._log.apiCall(WORTAL_API.SESSION_HAPPY_TIME);

        const validationResult = this.validateHappyTime();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.happyTimeImpl();
    }

    public onOrientationChange(callback: (orientation: Orientation) => void): void {
        Wortal._log.apiCall(WORTAL_API.SESSION_ON_ORIENTATION_CHANGE);

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
        Wortal._log.apiCall(WORTAL_API.SESSION_SET_SESSION_DATA);

        const validationResult = this.validateSetSessionData(data);
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this.setSessionDataImpl(data);
    }

    public switchGameAsync(gameID: string, data?: object): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.SESSION_SWITCH_GAME_ASYNC);

        const validationResult = this.validateSwitchGameAsync(gameID, data);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.switchGameAsyncImpl(gameID, data);
    }

//#endregion
//#region Internal API

    _gameLoadingStart(): void {
        Wortal._log.internalCall(WORTAL_API.SESSION_GAME_LOADING_START);

        return this._gameLoadingStartImpl();
    }

    _gameLoadingStop(): void {
        Wortal._log.internalCall(WORTAL_API.SESSION_GAME_LOADING_STOP);

        return this._gameLoadingStopImpl();
    }

//#endregion
//#region Implementation interface

    protected gameplayStartImpl(): void { throw implementationError(); }
    protected gameplayStopImpl(): void { throw implementationError(); }
    protected getDeviceImpl(): Device { throw implementationError(); }
    protected getEntryPointAsyncImpl(): Promise<string> { throw implementationError(); }
    protected getEntryPointDataImpl(): Record<string, unknown> { throw implementationError(); }
    protected getLocaleImpl(): string { throw implementationError(); }
    protected getTrafficSourceImpl(): TrafficSource { throw implementationError(); }
    protected happyTimeImpl(): void { throw implementationError(); }
    protected setSessionDataImpl(data: Record<string, unknown>): void { throw implementationError(); }
    protected switchGameAsyncImpl(gameID: string, data?: object): Promise<void> { throw implementationError(); }

    protected _gameLoadingStartImpl(): void { throw implementationError(); }
    protected _gameLoadingStopImpl(): void { throw implementationError(); }

//#endregion
//#region Validation

    protected validateGameplayStart(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.SESSION_GAMEPLAY_START,
                    API_URL.SESSION_GAMEPLAY_START),
            };
        }

        return { valid: true }
    }

    protected validateGameplayStop(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.SESSION_GAMEPLAY_STOP,
                    API_URL.SESSION_GAMEPLAY_STOP),
            };
        }

        return { valid: true }
    }

    protected validateGetEntryPointAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC,
                    API_URL.SESSION_GET_ENTRY_POINT_ASYNC),
            };
        }

        return { valid: true }
    }

    protected validateGetEntryPointData(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.SESSION_GET_ENTRY_POINT_DATA,
                    API_URL.SESSION_GET_ENTRY_POINT_DATA),
            };
        }

        return { valid: true }
    }

    protected validateGetTrafficSource(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.SESSION_GET_TRAFFIC_SOURCE,
                    API_URL.SESSION_GET_TRAFFIC_SOURCE),
            };
        }

        return { valid: true }
    }

    protected validateHappyTime(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.SESSION_HAPPY_TIME,
                    API_URL.SESSION_HAPPY_TIME),
            };
        }

        return { valid: true }
    }

    protected validateOnOrientationChange(callback: (orientation: Orientation) => void): ValidationResult {
        if (typeof callback !== "function") {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
                    API_URL.SESSION_ON_ORIENTATION_CHANGE),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
                    API_URL.SESSION_ON_ORIENTATION_CHANGE),
            };
        }

        return { valid: true }
    }

    protected validateSetSessionData(data: Record<string, unknown>): ValidationResult {
        if (typeof data !== "object") {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.SESSION_SET_SESSION_DATA,
                    API_URL.SESSION_SET_SESSION_DATA),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.SESSION_SET_SESSION_DATA,
                    API_URL.SESSION_SET_SESSION_DATA),
            };
        }

        return { valid: true }
    }

    protected validateSwitchGameAsync(gameID: string, data?: object): ValidationResult {
        if (!isValidString(gameID)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.SESSION_SWITCH_GAME_ASYNC,
                    API_URL.SESSION_SWITCH_GAME_ASYNC),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.SESSION_SWITCH_GAME_ASYNC,
                    API_URL.SESSION_SWITCH_GAME_ASYNC),
            };
        }

        return { valid: true }
    }

//#endregion
}
