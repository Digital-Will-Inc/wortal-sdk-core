import { API_URL, WORTAL_API } from "../data/core-data";
import { invalidParams, notInitialized, operationFailed } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { apiCall, debug, exception } from "../utils/logger";
import { ConnectedPlayer } from "./classes/connected-player";
import { Player } from "./classes/player";
import { ConnectedPlayerPayload } from "./interfaces/connected-player-payload";
import { SignedASID } from "./interfaces/facebook-player";
import { SignedPlayerInfo } from "./interfaces/signed-player-info";

/**
 * Base class for the Player API. Extend this class to implement the Player API for a specific platform.
 * @hidden
 */
export abstract class PlayerBase {
    protected abstract _player: Player;

    constructor() {
    }

    /** @hidden */
    get _internalPlayer(): Player {
        return this._player;
    }

    /** @hidden */
    set _internalPlayer(value: Player) {
        this._player = value;
    }

//#region Public API

    public canSubscribeBotAsync(): Promise<boolean> {
        apiCall(WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC);

        const validationResult: ValidationResult = this.validateCanSubscribeBotAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.canSubscribeBotAsyncImpl();
    }

    public flushDataAsync(): Promise<void> {
        apiCall(WORTAL_API.PLAYER_FLUSH_DATA_ASYNC);

        const validationResult: ValidationResult = this.validateFlushDataAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.flushDataAsyncImpl();
    }

    public getASIDAsync(): Promise<string> {
        apiCall(WORTAL_API.PLAYER_GET_ASID_ASYNC);

        // We don't validate this call because it's called from the SDK itself during Player initialization on FB.
        // We need the ASID to fetch the ad unit IDs from the Wortal API, so we can't have this fail.

        return this.getASIDAsyncImpl();
    }

    public getConnectedPlayersAsync(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        apiCall(WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC);

        const validationResult: ValidationResult = this.validateGetConnectedPlayersAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getConnectedPlayersAsyncImpl(payload);
    }

    public getDataAsync(keys: string[]): Promise<any> {
        apiCall(WORTAL_API.PLAYER_GET_DATA_ASYNC);

        const validationResult: ValidationResult = this.validateGetDataAsync(keys);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getDataAsyncImpl(keys);
    }

    public getID(): string | null {
        apiCall(WORTAL_API.PLAYER_GET_ID);

        const validationResult: ValidationResult = this.validateGetID();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this._player.id;
    }

    public getName(): string | null {
        apiCall(WORTAL_API.PLAYER_GET_NAME);

        const validationResult: ValidationResult = this.validateGetName();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this._player.name;
    }

    public getPhoto(): string | null {
        apiCall(WORTAL_API.PLAYER_GET_PHOTO);

        const validationResult: ValidationResult = this.validateGetPhoto();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this._player.photo;
    }

    public getSignedASIDAsync(): Promise<SignedASID> {
        apiCall(WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC);

        const validationResult: ValidationResult = this.validateGetSignedASIDAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getSignedASIDAsyncImpl();
    }

    public getSignedPlayerInfoAsync(): Promise<SignedPlayerInfo> {
        apiCall(WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC);

        const validationResult: ValidationResult = this.validateGetSignedPlayerInfoAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getSignedPlayerInfoAsyncImpl();
    }

    public getTokenAsync(): Promise<string> {
        apiCall(WORTAL_API.PLAYER_GET_TOKEN_ASYNC);

        const validationResult: ValidationResult = this.validateGetTokenAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getTokenAsyncImpl();
    }

    public isFirstPlay(): boolean {
        apiCall(WORTAL_API.PLAYER_IS_FIRST_PLAY);

        const validationResult: ValidationResult = this.validateIsFirstPlay();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this._player.isFirstPlay
    }

    public onLogin(callback: () => void): void {
        apiCall(WORTAL_API.PLAYER_ON_LOGIN);

        const validationResult: ValidationResult = this.validateOnLogin(callback);
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        //TODO: implement onLogin
        /*
        if (platform === "crazygames") {
            config.platformSDK.user.addAuthListener(callback);
        }
         */
    }

    public setDataAsync(data: Record<string, unknown>): Promise<void> {
        apiCall(WORTAL_API.PLAYER_SET_DATA_ASYNC);

        const validationResult: ValidationResult = this.validateSetDataAsync(data);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.setDataAsyncImpl(data);
    }

    public subscribeBotAsync(): Promise<void> {
        apiCall(WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC);

        const validationResult: ValidationResult = this.validateSubscribeBotAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.subscribeBotAsyncImpl();
    }

//#endregion
//#region Implementation interface

    protected abstract canSubscribeBotAsyncImpl(): Promise<boolean>;
    protected abstract flushDataAsyncImpl(): Promise<void>;
    protected abstract getASIDAsyncImpl(): Promise<string>;
    protected abstract getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]>;
    protected abstract getDataAsyncImpl(keys: string[]): Promise<any>;
    protected abstract getSignedASIDAsyncImpl(): Promise<SignedASID>;
    protected abstract getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo>;
    protected abstract getTokenAsyncImpl(): Promise<string>;
    protected abstract setDataAsyncImpl(data: Record<string, unknown>): Promise<void>;
    protected abstract subscribeBotAsyncImpl(): Promise<void>;

    protected async defaultGetDataAsyncImpl(keys: string[]): Promise<any> {
        try {
            let dataObj: Record<string, any> = {};

            const data = localStorage.getItem(`${Wortal.session._internalSession.gameID}-save-data`);
            if (data) {
                try {
                    const localSaveData = JSON.parse(data);
                    if (localSaveData) {
                        dataObj = {...dataObj, ...localSaveData};
                    }
                } catch (error: any) {
                    exception(`Error loading object from localStorage: ${error.message}`);
                }
            }

            // if Waves available and authenticated, try to get data from Waves
            if (Wortal._internalIsWavesEnabled && window.waves && window.waves.authToken) {
                try {
                    const wavesData = await window.waves.getData();
                    if (wavesData) {
                        dataObj = {...dataObj, ...wavesData};
                    }
                } catch (error: any) {
                    exception(`Error loading object from waves: ${error.message}`);
                }
            }

            // filter data by keys
            const result: Record<string, any> = {};
            keys.forEach((key: string) => {
                result[key] = dataObj[key];
            });
            return result;

        } catch (error: any) {
            throw operationFailed(`Error saving object to localStorage: ${error.message}`,
                WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC);
        }
    }

    protected defaultSetDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(`${Wortal.session._internalSession.gameID}-save-data`, JSON.stringify(data));
                debug("Saved data to localStorage.");

            } catch (error: any) {
                reject(operationFailed(`Error saving object to localStorage: ${error.message}`,
                    WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC));
            }

            // if Waves available and authenticated
            if (Wortal._internalIsWavesEnabled && window.waves && window.waves.authToken) {
                window.waves.saveData(data)
                    .then(() => resolve())
                    .catch(
                        // could be caused by user cancel or network error
                        (error: any) => reject(exception(`Error saving object to waves: ${error.message}`))
                    );
            } else {
                resolve();
            }
        });
    }

//#endregion
//#region Validation

    protected validateCanSubscribeBotAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC,
                    API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateFlushDataAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_FLUSH_DATA_ASYNC,
                    API_URL.PLAYER_FLUSH_DATA_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateGetConnectedPlayersAsync(payload?: ConnectedPlayerPayload): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC,
                    API_URL.PLAYER_GET_CONNECTED_PLAYERS_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateGetDataAsync(keys: string[]): ValidationResult {
        if (!Array.isArray(keys) || !keys.length) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.PLAYER_GET_DATA_ASYNC,
                    API_URL.PLAYER_GET_DATA_ASYNC),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_DATA_ASYNC,
                    API_URL.PLAYER_GET_DATA_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateGetID(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_ID,
                    API_URL.PLAYER_GET_ID),
            };
        }

        return { valid: true };
    }

    protected validateGetName(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_NAME,
                    API_URL.PLAYER_GET_NAME),
            };
        }

        return { valid: true };
    }

    protected validateGetPhoto(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_PHOTO,
                    API_URL.PLAYER_GET_PHOTO),
            };
        }

        return { valid: true };
    }

    protected validateGetSignedASIDAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC,
                    API_URL.PLAYER_GET_SIGNED_ASID_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateGetSignedPlayerInfoAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC,
                    API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateGetTokenAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_TOKEN_ASYNC,
                    API_URL.PLAYER_GET_TOKEN_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateIsFirstPlay(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_IS_FIRST_PLAY,
                    API_URL.PLAYER_IS_FIRST_PLAY),
            };
        }

        return { valid: true };
    }

    protected validateOnLogin(callback: () => void): ValidationResult {
        if (typeof callback !== "function") {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.PLAYER_ON_LOGIN,
                    API_URL.PLAYER_ON_LOGIN),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_ON_LOGIN,
                    API_URL.PLAYER_ON_LOGIN),
            };
        }

        return { valid: true };
    }

    protected validateSetDataAsync(data: Record<string, unknown>): ValidationResult {
        if (typeof data !== "object") {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.PLAYER_SET_DATA_ASYNC,
                    API_URL.PLAYER_SET_DATA_ASYNC),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_SET_DATA_ASYNC,
                    API_URL.PLAYER_SET_DATA_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateSubscribeBotAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC,
                    API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC),
            };
        }

        return { valid: true };
    }

//#endregion
}
