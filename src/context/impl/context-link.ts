import { API_URL, WORTAL_API } from "../../data/core-data";
import { ErrorMessage_Link } from "../../errors/interfaces/link-error";
import Wortal from "../../index";
import { ConnectedPlayer } from "../../player/classes/connected-player";
import { PlayerData } from "../../player/interfaces/player-data";
import { notSupported, rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ConnectedPlayer_Link_Viber } from "../../player/interfaces/rakuten-player";
import { ContextBase } from "../context-base";
import { ChoosePayload } from "../interfaces/choose-payload";
import { ContextSizeResponse } from "../interfaces/context-size-response";
import { InvitePayload } from "../interfaces/invite-payload";
import { LinkMessagePayload } from "../interfaces/link-message-payload";
import { LinkSharePayload } from "../interfaces/link-share-payload";
import { SharePayload } from "../interfaces/share-payload";
import { ShareResult } from "../interfaces/share-result";
import { SwitchPayload } from "../interfaces/switch-payload";
import { UpdatePayload } from "../interfaces/update-payload";
import { ContextType } from "../types/context-payload-property-types";

/**
 * Link implementation of the Context API.
 * @hidden
 */
export class ContextLink extends ContextBase {
    constructor() {
        super();
    }

    protected chooseAsyncImpl(payload?: ChoosePayload): Promise<void> {
        return Wortal._internalPlatformSDK.context.chooseAsync(payload)
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_CHOOSE_ASYNC, API_URL.CONTEXT_CHOOSE_ASYNC);
            });
    }

    protected createAsyncImpl(playerID?: string | string[]): Promise<void> {
        // Link only allows a single player to be used to create a context.
        if (Array.isArray(playerID)) {
            playerID = playerID[0];
        }

        return Wortal._internalPlatformSDK.context.createAsync(playerID)
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_CREATE_ASYNC, API_URL.CONTEXT_CREATE_ASYNC);
            });
    }

    protected getIdImpl(): string {
        return Wortal._internalPlatformSDK.context.getID();
    }

    protected getPlayersAsyncImpl(): Promise<ConnectedPlayer[]> {
        return Wortal._internalPlatformSDK.context.getPlayersAsync()
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
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC, API_URL.CONTEXT_GET_PLAYERS_ASYNC);
            });
    }

    protected getTypeImpl(): ContextType {
        return Wortal._internalPlatformSDK.context.getType();
    }

    protected inviteAsyncImpl(payload: InvitePayload): Promise<number> {
        const convertedPayload: LinkMessagePayload = this._convertToLinkMessagePayload(payload);
        return Wortal._internalPlatformSDK.shareAsync(convertedPayload)
            .then((result: ShareResult) => {
                return result.sharedCount;
            })
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_INVITE_ASYNC, API_URL.CONTEXT_INVITE_ASYNC);
            });
    }

    protected isSizeBetweenImpl(min?: number, max?: number): ContextSizeResponse | null {
        return Wortal._internalPlatformSDK.context.isSizeBetween(min, max);
    }

    protected shareAsyncImpl(payload: SharePayload): Promise<number> {
        const convertedPayload: LinkMessagePayload = this._convertToLinkMessagePayload(payload);
        return Wortal._internalPlatformSDK.shareAsync(convertedPayload)
            .then((result: ShareResult) => {
                return result.sharedCount;
            })
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_SHARE_ASYNC, API_URL.CONTEXT_SHARE_ASYNC);
            });
    }

    protected shareLinkAsyncImpl(payload: LinkSharePayload): Promise<string | void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.CONTEXT_SHARE_LINK_ASYNC, API_URL.CONTEXT_SHARE_LINK_ASYNC));
    }

    protected switchAsyncImpl(contextID: string, payload?: SwitchPayload): Promise<void> {
        return Wortal._internalPlatformSDK.context.switchAsync(contextID, payload)
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_SWITCH_ASYNC, API_URL.CONTEXT_SWITCH_ASYNC);
            });
    }

    protected updateAsyncImpl(payload: UpdatePayload): Promise<void> {
        const convertedPayload: LinkMessagePayload = this._convertToLinkMessagePayload(payload);
        return Wortal._internalPlatformSDK.updateAsync(convertedPayload)
            .catch((error: ErrorMessage_Link) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_UPDATE_ASYNC, API_URL.CONTEXT_UPDATE_ASYNC);
            });
    }

    private _convertToLinkMessagePayload(payload: SharePayload | UpdatePayload): LinkMessagePayload {
        const messagePayload: LinkMessagePayload = {
            image: payload.image,
            text: payload.text,
        }

        if (payload?.cta) messagePayload.caption = payload.cta;
        if (payload?.data) messagePayload.data = payload.data;

        return messagePayload;
    }

}
