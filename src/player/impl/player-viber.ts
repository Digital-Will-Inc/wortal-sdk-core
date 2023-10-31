import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported, rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Viber } from "../../errors/interfaces/viber-error";
import { debug } from "../../utils/logger";
import { ConnectedPlayer } from "../classes/connected-player";
import { ViberPlayer } from "../classes/viber-player";
import { Player } from "../classes/player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import { SignedASID } from "../interfaces/facebook-player";
import { PlayerData } from "../interfaces/player-data";
import { ConnectedPlayer_Link_Viber } from "../interfaces/rakuten-player";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";

/**
 * Viber implementation of the Player API.
 * @hidden
 */
export class PlayerViber extends PlayerBase {
    protected _player: Player;

    constructor() {
        super();
        this._player = new ViberPlayer();
    }

    protected canSubscribeBotAsyncImpl(): Promise<boolean> {
        throw notSupported(undefined, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC);
    }

    protected flushDataAsyncImpl(): Promise<void> {
        return window.Wortal._internalPlatformSDK.player.flushDataAsync()
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_FLUSH_DATA_ASYNC, API_URL.PLAYER_FLUSH_DATA_ASYNC);
            });
    }

    protected getASIDAsyncImpl(): Promise<string> {
        throw notSupported(undefined, WORTAL_API.PLAYER_GET_ASID_ASYNC, API_URL.PLAYER_GET_ASID_ASYNC);
    }

    protected getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        return window.Wortal._internalPlatformSDK.player.getConnectedPlayersAsync(payload)
            .then((players: ConnectedPlayer_Link_Viber[]) => {
                return players.map((player: ConnectedPlayer_Link_Viber) => {
                    const playerData: PlayerData = {
                        id: player.getID(),
                        name: player.getName(),
                        photo: player.getPhoto(),
                        isFirstPlay: !player.hasPlayed,
                        daysSinceFirstPlay: 0,
                    };

                    return new ConnectedPlayer(playerData);
                });
            })
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC, API_URL.PLAYER_GET_CONNECTED_PLAYERS_ASYNC);
            });
    }

    protected getDataAsyncImpl(keys: string[]): Promise<any> {
        return window.Wortal._internalPlatformSDK.player.getDataAsync(keys)
            .then((data: any) => {
                return data;
            })
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC);
            });
    }

    protected getSignedASIDAsyncImpl(): Promise<SignedASID> {
        throw notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC, API_URL.PLAYER_GET_SIGNED_ASID_ASYNC);
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        return window.Wortal._internalPlatformSDK.player.getSignedPlayerInfoAsync()
            .then((info: any) => {
                return {
                    id: info.getPlayerID(),
                    signature: info.getSignature(),
                };
            })
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC, API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC);
            });
    }

    protected getTokenAsyncImpl(): Promise<string> {
        throw notSupported(undefined, WORTAL_API.PLAYER_GET_TOKEN_ASYNC, API_URL.PLAYER_GET_TOKEN_ASYNC);
    }

    protected setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        return window.Wortal._internalPlatformSDK.player.setDataAsync(data)
            .then(() => {
                debug("Saved data to cloud storage.");
            })
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
            });
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        throw notSupported(undefined, WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC);
    }

}
