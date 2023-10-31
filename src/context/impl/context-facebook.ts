import { API_URL, WORTAL_API } from "../../data/core-data";
import { ErrorMessage_Facebook } from "../../errors/interfaces/facebook-error";
import Wortal from "../../index";
import { ConnectedPlayer } from "../../player/classes/connected-player";
import { ConnectedPlayer_Facebook } from "../../player/interfaces/facebook-player";
import { PlayerData } from "../../player/interfaces/player-data";
import { rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
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
 * Facebook implementation of the Context API.
 * @hidden
 */
export class ContextFacebook extends ContextBase {
    constructor() {
        super();
    }

    protected chooseAsyncImpl(payload?: ChoosePayload): Promise<void> {
        return Wortal._internalPlatformSDK.context.chooseAsync(payload)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_CHOOSE_ASYNC, API_URL.CONTEXT_CHOOSE_ASYNC);
            });
    }

    protected createAsyncImpl(playerID?: string | string[]): Promise<void> {
        return Wortal._internalPlatformSDK.context.createAsync(playerID)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_CREATE_ASYNC, API_URL.CONTEXT_CREATE_ASYNC);
            });
    }

    protected getIdImpl(): string {
        return Wortal._internalPlatformSDK.context.getID();
    }

    protected getPlayersAsyncImpl(): Promise<ConnectedPlayer[]> {
        return Wortal._internalPlatformSDK.context.getPlayersAsync()
            .then((players: ConnectedPlayer_Facebook[]) => {
                return players.map((player: ConnectedPlayer_Facebook) => {
                    const playerData: PlayerData = {
                        id: player.getID(),
                        name: player.getName(),
                        photo: player.getPhoto(),
                        // Facebook's player model doesn't have the hasPlayed flag.
                        isFirstPlay: false,
                        daysSinceFirstPlay: 0,
                    };

                    return new ConnectedPlayer(playerData);
                });
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC, API_URL.CONTEXT_GET_PLAYERS_ASYNC);
            });
    }

    protected getTypeImpl(): ContextType {
        return Wortal._internalPlatformSDK.context.getType();
    }

    protected inviteAsyncImpl(payload: InvitePayload): Promise<number> {
        return Wortal._internalPlatformSDK.inviteAsync(payload)
            .then(() => {
                return 0;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_INVITE_ASYNC, API_URL.CONTEXT_INVITE_ASYNC);
            });
    }

    protected isSizeBetweenImpl(min?: number, max?: number): ContextSizeResponse | null {
        return Wortal._internalPlatformSDK.context.isSizeBetween(min, max);
    }

    protected shareAsyncImpl(payload: SharePayload): Promise<number> {
        const convertedPayload: SharePayload = this._convertToFBInstantSharePayload(payload);
        return Wortal._internalPlatformSDK.shareAsync(convertedPayload)
            .then(() => {
                // FB doesn't return a shareResult, so we return 0.
                return 0;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_SHARE_ASYNC, API_URL.CONTEXT_SHARE_ASYNC);
            });
    }

    protected shareLinkAsyncImpl(payload: LinkSharePayload): Promise<string | void> {
        return Wortal._internalPlatformSDK.shareLinkAsync(payload)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_SHARE_LINK_ASYNC, API_URL.CONTEXT_SHARE_LINK_ASYNC);
            });
    }

    protected switchAsyncImpl(contextID: string, payload?: SwitchPayload): Promise<void> {
        return Wortal._internalPlatformSDK.context.switchAsync(contextID, payload?.switchSilentlyIfSolo)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_SWITCH_ASYNC, API_URL.CONTEXT_SWITCH_ASYNC);
            });
    }

    protected updateAsyncImpl(payload: UpdatePayload): Promise<void> {
        const convertedPayload: UpdatePayload = this._convertToFBInstantUpdatePayload(payload);
        return Wortal._internalPlatformSDK.updateAsync(convertedPayload)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.CONTEXT_UPDATE_ASYNC, API_URL.CONTEXT_UPDATE_ASYNC);
            });
    }

    private _convertToFBInstantSharePayload(payload: SharePayload): SharePayload {
        // FB.shareAsync doesn't take LocalizableContent, so we need to pass a string.
        // We first check for an exact locale match, then a language match, then default. (en-US -> en -> default)
        // This may need to be revisited as its potentially problematic for some languages/dialects.
        if (typeof payload.text === "object") {
            const locale: string = Wortal.session.getLocale();
            if (locale in payload.text.localizations) {
                payload.text = payload.text.localizations[locale];
            } else if (locale.substring(0, 2) in payload.text.localizations) {
                payload.text = payload.text.localizations[locale.substring(0, 2)];
            } else {
                payload.text = payload.text.default;
            }
        }

        return payload;
    }

    private _convertToFBInstantUpdatePayload(payload: UpdatePayload): UpdatePayload {
        if (payload.strategy === "IMMEDIATE_CLEAR") {
            payload.strategy = "IMMEDIATE";
        }
        if (typeof payload.action === "undefined") {
            payload.action = "CUSTOM";
        }
        if (typeof payload.template === "undefined") {
            payload.template = "";
        }

        return payload;
    }

}
