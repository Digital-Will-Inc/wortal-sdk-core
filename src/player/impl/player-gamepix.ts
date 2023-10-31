import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { ConnectedPlayer } from "../classes/connected-player";
import { DebugPlayer } from "../classes/debug-player";
import { Player } from "../classes/player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import { SignedASID } from "../interfaces/facebook-player";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";

/**
 * GamePix implementation of Player API.
 * @hidden
 */
export class PlayerGamePix extends PlayerBase {
    protected _player: Player;

    constructor() {
        super();
        this._player = new DebugPlayer();
    }

    protected canSubscribeBotAsyncImpl(): Promise<boolean> {
        throw notSupported(undefined, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC);
    }

    protected flushDataAsyncImpl(): Promise<void> {
        throw notSupported(undefined, WORTAL_API.PLAYER_FLUSH_DATA_ASYNC, API_URL.PLAYER_FLUSH_DATA_ASYNC);
    }

    protected getASIDAsyncImpl(): Promise<string> {
        throw notSupported(undefined, WORTAL_API.PLAYER_GET_ASID_ASYNC, API_URL.PLAYER_GET_ASID_ASYNC);
    }

    protected getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        throw notSupported(undefined, WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC, API_URL.PLAYER_GET_CONNECTED_PLAYERS_ASYNC);
    }

    protected getDataAsyncImpl(keys: string[]): Promise<any> {
        return this.defaultGetDataAsyncImpl(keys);
    }

    protected getSignedASIDAsyncImpl(): Promise<SignedASID> {
        throw notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC, API_URL.PLAYER_GET_SIGNED_ASID_ASYNC);
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        throw notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC, API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC);
    }

    protected getTokenAsyncImpl(): Promise<string> {
        throw notSupported(undefined, WORTAL_API.PLAYER_GET_TOKEN_ASYNC, API_URL.PLAYER_GET_TOKEN_ASYNC);
    }

    protected setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        return this.defaultSetDataAsyncImpl(data);
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        throw notSupported(undefined, WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC);
    }

}
