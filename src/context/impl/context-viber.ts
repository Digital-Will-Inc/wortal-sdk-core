import { API_URL, WORTAL_API } from "../../data/core-data";
import { ErrorMessage_Viber } from "../../errors/interfaces/viber-error";
import Wortal from "../../index";
import { ConnectedPlayer } from "../../player/classes/connected-player";
import { PlayerData } from "../../player/interfaces/player-data";
import { notSupported, rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ConnectedPlayer_Link_Viber } from "../../player/interfaces/rakuten-player";
import { ContextBase } from "../context-base";
import { ChoosePayload } from "../interfaces/choose-payload";
import { ContextSizeResponse } from "../interfaces/context-size-response";
import { InvitePayload } from "../interfaces/invite-payload";
import { LinkSharePayload } from "../interfaces/link-share-payload";
import { SharePayload } from "../interfaces/share-payload";
import { ShareResult } from "../interfaces/share-result";
import { SwitchPayload } from "../interfaces/switch-payload";
import { UpdatePayload } from "../interfaces/update-payload";
import { ContextFilter, ContextType, InviteFilter } from "../types/context-payload-property-types";

/**
 * Viber implementation of the Context API.
 * @hidden
 */
export class ContextViber extends ContextBase {
    constructor() {
        super();
    }

    protected chooseAsyncImpl(payload?: ChoosePayload): Promise<void> {
        return Wortal._internalPlatformSDK.context.chooseAsync(payload)
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_CHOOSE_ASYNC, API_URL.CONTEXT_CHOOSE_ASYNC);
            });
    }

    protected createAsyncImpl(playerID?: string | string[]): Promise<void> {
        // Viber only allows a single player to be used to create a context.
        if (Array.isArray(playerID)) {
            playerID = playerID[0];
        }

        return Wortal._internalPlatformSDK.context.createAsync(playerID)
            .catch((error: ErrorMessage_Viber) => {
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
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC, API_URL.CONTEXT_GET_PLAYERS_ASYNC);
            });
    }

    protected getTypeImpl(): ContextType {
        return Wortal._internalPlatformSDK.context.getType();
    }

    protected inviteAsyncImpl(payload: InvitePayload): Promise<number> {
        const convertedPayload: SharePayload = this._convertToViberSharePayload(payload);
        return Wortal._internalPlatformSDK.shareAsync(convertedPayload)
            .then((result: ShareResult) => {
                return result.sharedCount;
            })
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_INVITE_ASYNC, API_URL.CONTEXT_INVITE_ASYNC);
            });
    }

    protected isSizeBetweenImpl(min?: number, max?: number): ContextSizeResponse | null {
        return Wortal._internalPlatformSDK.context.isSizeBetween(min, max);
    }

    protected shareAsyncImpl(payload: SharePayload): Promise<number> {
        return Wortal._internalPlatformSDK.shareAsync(payload)
            .then((result: ShareResult) => {
                return result.sharedCount;
            })
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_SHARE_ASYNC, API_URL.CONTEXT_SHARE_ASYNC);
            });
    }

    protected shareLinkAsyncImpl(payload: LinkSharePayload): Promise<string | void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.CONTEXT_SHARE_LINK_ASYNC, API_URL.CONTEXT_SHARE_LINK_ASYNC));
    }

    protected switchAsyncImpl(contextID: string, payload?: SwitchPayload): Promise<void> {
        return Wortal._internalPlatformSDK.context.switchAsync(contextID)
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_SWITCH_ASYNC, API_URL.CONTEXT_SWITCH_ASYNC);
            });
    }

    protected updateAsyncImpl(payload: UpdatePayload): Promise<void> {
        return Wortal._internalPlatformSDK.updateAsync(payload)
            .catch((error: ErrorMessage_Viber) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_UPDATE_ASYNC, API_URL.CONTEXT_UPDATE_ASYNC);
            });
    }

    private _convertToViberSharePayload(payload: InvitePayload): SharePayload {
        const sharePayload: SharePayload = {
            image: payload.image,
            text: payload.text,
        }

        if (payload?.cta) sharePayload.cta = payload.cta;
        if (payload?.data) sharePayload.data = payload.data;
        if (payload?.filters) {
            sharePayload.filters = this._convertInviteFilterToContextFilter(payload.filters);
        }

        return sharePayload;
    }

    private _convertInviteFilterToContextFilter(filter: InviteFilter | InviteFilter[]): [ContextFilter] | undefined {
        if (typeof filter === "string") {
            if (this._isContextFilterValid(filter)) {
                return [filter];
            } else {
                return undefined;
            }
        } else if (Array.isArray(filter)) {
            // Viber only accepts the first filter so just return that.
            for (let i = 0; i < filter.length; i++) {
                if (this._isContextFilterValid(filter[i])) {
                    return [filter[i]] as [ContextFilter];
                }
            }
            return undefined;
        } else {
            return undefined;
        }
    }

    private _isContextFilterValid(value: string): value is ContextFilter {
        return ["NEW_CONTEXT_ONLY", "INCLUDE_EXISTING_CHALLENGES", "NEW_PLAYERS_ONLY", "NEW_INVITATIONS_ONLY"].includes(value);
    }

}
