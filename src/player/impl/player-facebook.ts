import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported, rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Facebook } from "../../errors/interfaces/facebook-error";
import Wortal from "../../index";
import { ConnectedPlayer } from "../classes/connected-player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import {
    ConnectedPlayer_Facebook,
    SignedASID,
    SignedASID_Facebook,
    SignedPlayerInfo_Facebook
} from "../interfaces/facebook-player";
import { PlayerData } from "../interfaces/player-data";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";

/**
 * Facebook implementation of the Player API.
 * @hidden
 */
export class PlayerFacebook extends PlayerBase {
    protected canSubscribeBotAsyncImpl(): Promise<boolean> {
        return Wortal._internalPlatformSDK.player.canSubscribeBotAsync()
            .then((canSubscribe: boolean) => {
                return canSubscribe;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC);
            });
    }

    protected flushDataAsyncImpl(): Promise<void> {
        return Wortal._internalPlatformSDK.player.flushDataAsync()
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_FLUSH_DATA_ASYNC, API_URL.PLAYER_FLUSH_DATA_ASYNC);
            });
    }

    protected getASIDAsyncImpl(): Promise<string> {
        return Wortal._internalPlatformSDK.player.getASIDAsync()
            .then((asid: string) => {
                return asid;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_ASID_ASYNC, API_URL.PLAYER_GET_ASID_ASYNC);
            });
    }

    protected getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        return Wortal._internalPlatformSDK.player.getConnectedPlayersAsync(payload)
            .then((players: ConnectedPlayer_Facebook[]) => {
                return players.map((player: ConnectedPlayer_Facebook) => {
                    const playerData: PlayerData = {
                        id: player.getID(),
                        name: player.getName(),
                        photo: player.getPhoto(),
                        isFirstPlay: false, // Facebook's player model doesn't have the hasPlayed flag.
                        daysSinceFirstPlay: 0,
                    };

                    return new ConnectedPlayer(playerData);
                });
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC, API_URL.PLAYER_GET_CONNECTED_PLAYERS_ASYNC);
            });
    }

    protected getDataAsyncImpl(keys: string[]): Promise<any> {
        return Wortal._internalPlatformSDK.player.getDataAsync(keys)
            .then((data: any) => {
                return data;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC);
            });
    }

    protected getSignedASIDAsyncImpl(): Promise<SignedASID> {
        return Wortal._internalPlatformSDK.player.getSignedASIDAsync()
            .then((info: SignedASID_Facebook) => {
                return {
                    asid: info.getASID(),
                    signature: info.getSignature(),
                };
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC, API_URL.PLAYER_GET_SIGNED_ASID_ASYNC);
            });
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        return Wortal._internalPlatformSDK.player.getSignedPlayerInfoAsync()
            .then((info: SignedPlayerInfo_Facebook) => {
                return {
                    id: info.getPlayerID(),
                    signature: info.getSignature(),
                };
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC, API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC);
            });
    }

    protected getTokenAsyncImpl(): Promise<string> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_TOKEN_ASYNC, API_URL.PLAYER_GET_TOKEN_ASYNC));
    }

    protected setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        return Wortal._internalPlatformSDK.player.setDataAsync(data)
            .then(() => {
                Wortal._log.debug("Saved data to cloud storage.");
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
            });
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        return Wortal._internalPlatformSDK.player.subscribeBotAsync()
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC);
            });
    }

}
