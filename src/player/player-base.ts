import { API_URL, WORTAL_API } from "../data/core-data";
import { invalidParams, operationFailed } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { apiCall, debug } from "../utils/logger";
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

        return this.canSubscribeBotAsyncImpl();
    }

    public flushDataAsync(): Promise<void> {
        apiCall(WORTAL_API.PLAYER_FLUSH_DATA_ASYNC);

        return this.flushDataAsyncImpl();
    }

    public getASIDAsync(): Promise<string> {
        apiCall(WORTAL_API.PLAYER_GET_ASID_ASYNC);

        return this.getASIDAsyncImpl();
    }

    public getConnectedPlayersAsync(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        apiCall(WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC);

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

        return this._player.id;
    }

    public getName(): string | null {
        apiCall(WORTAL_API.PLAYER_GET_NAME);

        return this._player.name;
    }

    public getPhoto(): string | null {
        apiCall(WORTAL_API.PLAYER_GET_PHOTO);

        return this._player.photo;
    }

    public getSignedASIDAsync(): Promise<SignedASID> {
        apiCall(WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC);

        return this.getSignedASIDAsyncImpl();
    }

    public getSignedPlayerInfoAsync(): Promise<SignedPlayerInfo> {
        apiCall(WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC);

        return this.getSignedPlayerInfoAsyncImpl();
    }

    public getTokenAsync(): Promise<string> {
        apiCall(WORTAL_API.PLAYER_GET_TOKEN_ASYNC);

        return this.getTokenAsyncImpl();
    }

    public isFirstPlay(): boolean {
        apiCall(WORTAL_API.PLAYER_IS_FIRST_PLAY);

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

        return this.setDataAsyncImpl(data);
    }

    public subscribeBotAsync(): Promise<void> {
        apiCall(WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC);

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

    protected defaultGetDataAsyncImpl(keys: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const data = localStorage.getItem(`${Wortal.session._internalSession.gameID}-save-data`);
                if (data) {
                    const dataObj = JSON.parse(data);
                    const result: any = {};
                    keys.forEach((key: string) => {
                        result[key] = dataObj[key];
                    });
                    resolve(result);
                } else {
                    debug("No save data found in localStorage. Returning empty object.");
                    resolve({});
                }
            } catch (error: any) {
                reject(operationFailed(`Error saving object to localStorage: ${error.message}`,
                    WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC));
            }
        });
    }

    protected defaultSetDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(`${Wortal.session._internalSession.gameID}-save-data`, JSON.stringify(data));
                debug("Saved data to localStorage.");
                return;
            } catch (error: any) {
                reject(operationFailed(`Error saving object to localStorage: ${error.message}`,
                    WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC));
            }
        });
    }

//#endregion
//#region Validation

    protected validateGetDataAsync(keys: string[]): ValidationResult {
        if (!Array.isArray(keys) || !keys.length) {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateOnLogin(callback: () => void): ValidationResult {
        if (typeof callback !== "function") {
            return {
                valid: false,
                error: invalidParams(undefined, WORTAL_API.PLAYER_ON_LOGIN, API_URL.PLAYER_ON_LOGIN),
            };
        }

        return { valid: true };
    }

//#endregion
}
