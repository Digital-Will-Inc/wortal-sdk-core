import { YandexPlayerObject } from "../../core/interfaces/yandex-sdk";
import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported, rethrowError_Yandex } from "../../errors/error-handler";
import Wortal from "../../index";
import { delayUntilConditionMet } from "../../utils/wortal-utils";
import { ConnectedPlayer } from "../classes/connected-player";
import { Player } from "../classes/player";
import { YandexPlayer } from "../classes/yandex-player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import { SignedASID } from "../interfaces/facebook-player";
import { PlayerData } from "../interfaces/player-data";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";

/**
 * Yandex implementation of the Player API.
 * @hidden
 */
export class PlayerYandex extends PlayerBase {
    protected _player!: Player;
    private _playerObject!: YandexPlayerObject;

    constructor() {
        super();

        // Normally this would occur in initializeImpl(), but we need to do this here as the APIs
        // we need to use exist in the YandexPlayerObject, which is not accessible from the Player class.
        this._setPlayerObject().then(() => {
            const playerData: PlayerData = {
                id: this._playerObject.getUniqueID(),
                name: this._playerObject.getName(),
                photo: this._playerObject.getPhoto("medium"), //TODO: check if this is the right size
                isFirstPlay: false,
                daysSinceFirstPlay: 0,
            };

            this._player = new YandexPlayer(playerData);
        });
    }

    get _internalPlayer(): Player {
        return this._player;
    }

    protected canSubscribeBotAsyncImpl(): Promise<boolean> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC));
    }

    protected flushDataAsyncImpl(): Promise<void> {
        // This is technically supported but just included as a param in setData()
        //TODO: sort out how to call setData() with flush = true from here
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_FLUSH_DATA_ASYNC, API_URL.PLAYER_FLUSH_DATA_ASYNC));
    }

    protected getASIDAsyncImpl(): Promise<string> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_ASID_ASYNC, API_URL.PLAYER_GET_ASID_ASYNC));
    }

    protected getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC, API_URL.PLAYER_GET_CONNECTED_PLAYERS_ASYNC));
    }

    protected getDataAsyncImpl(keys: string[]): Promise<any> {
        return this._playerObject.getData(keys)
            .then((data: any) => {
                return data;
            })
            .catch((error: any) => {
                return Promise.reject(rethrowError_Yandex(error, WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC));
            });
    }

    protected getSignedASIDAsyncImpl(): Promise<SignedASID> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC, API_URL.PLAYER_GET_SIGNED_ASID_ASYNC));
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC, API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC));
    }

    protected getTokenAsyncImpl(): Promise<string> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_TOKEN_ASYNC, API_URL.PLAYER_GET_TOKEN_ASYNC));
    }

    protected setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        return this._playerObject.setData(data, false)
            .catch((error: any) => {
                return Promise.reject(rethrowError_Yandex(error, WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC));
            });
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC));
    }

    private async _setPlayerObject(): Promise<void> {
        if (typeof this._playerObject !== "undefined") {
            return;
        }

        // This might be called before the platform SDK is available.
        if (typeof Wortal._internalPlatformSDK === "undefined") {
            await delayUntilConditionMet(() => typeof Wortal._internalPlatformSDK !== "undefined",
                "Waiting for Wortal._internalPlatformSDK to be defined.");
        }

        this._playerObject = Wortal._internalPlatformSDK.getPlayer();
    }

}
