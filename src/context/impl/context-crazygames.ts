import { API_URL, WORTAL_API } from "../../data/core-data";
import { Error_CrazyGames } from "../../errors/types/crazygames-error-types";
import Wortal from "../../index";
import { ConnectedPlayer } from "../../player/classes/connected-player";
import { notSupported, rethrowError_CrazyGames } from "../../errors/error-handler";
import { ContextBase } from "../context-base";
import { ChoosePayload } from "../interfaces/choose-payload";
import { ContextSizeResponse } from "../interfaces/context-size-response";
import { InvitePayload } from "../interfaces/invite-payload";
import { LinkSharePayload } from "../interfaces/link-share-payload";
import { SharePayload } from "../interfaces/share-payload";
import { SwitchPayload } from "../interfaces/switch-payload";
import { UpdatePayload } from "../interfaces/update-payload";
import { ContextType } from "../types/context-payload-property-types";

/**
 * CrazyGames implementation of the Context API.
 * @hidden
 */
export class ContextCrazyGames extends ContextBase {
    protected chooseAsyncImpl(payload?: ChoosePayload): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.CONTEXT_CHOOSE_ASYNC, API_URL.CONTEXT_CHOOSE_ASYNC));
    }

    protected createAsyncImpl(playerID?: string | string[]): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.CONTEXT_CREATE_ASYNC, API_URL.CONTEXT_CREATE_ASYNC));
    }

    protected getIdImpl(): string {
        return "";
    }

    protected getPlayersAsyncImpl(): Promise<ConnectedPlayer[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC, API_URL.CONTEXT_GET_PLAYERS_ASYNC));
    }

    protected getTypeImpl(): ContextType {
        return "SOLO";
    }

    protected inviteAsyncImpl(payload: InvitePayload): Promise<number> {
        return Promise.reject(notSupported(undefined, WORTAL_API.CONTEXT_INVITE_ASYNC, API_URL.CONTEXT_INVITE_ASYNC));
    }

    protected isSizeBetweenImpl(min?: number, max?: number): ContextSizeResponse | null {
        return null;
    }

    protected shareAsyncImpl(payload: SharePayload): Promise<number> {
        return Promise.reject(notSupported(undefined, WORTAL_API.CONTEXT_SHARE_ASYNC, API_URL.CONTEXT_SHARE_ASYNC));
    }

    protected shareLinkAsyncImpl(payload: LinkSharePayload): Promise<string | void> {
        return new Promise((resolve, reject) => {
            const callback = (error: Error_CrazyGames, link: string) => {
                if (error) {
                    reject(rethrowError_CrazyGames(error, WORTAL_API.CONTEXT_SHARE_LINK_ASYNC, API_URL.CONTEXT_SHARE_LINK_ASYNC));
                } else {
                    resolve(link);
                }
            };

            Wortal._internalPlatformSDK.game.inviteLink(payload.data, callback);
        });
    }

    protected switchAsyncImpl(contextID: string, payload?: SwitchPayload): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.CONTEXT_SWITCH_ASYNC, API_URL.CONTEXT_SWITCH_ASYNC));
    }

    protected updateAsyncImpl(payload: UpdatePayload): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.CONTEXT_UPDATE_ASYNC, API_URL.CONTEXT_UPDATE_ASYNC));
    }

}
