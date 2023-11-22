import { ConnectedPlayer } from "../../player/classes/connected-player";
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
 * Debug implementation of the Context API.
 * @hidden
 */
export class ContextDebug extends ContextBase {
    protected chooseAsyncImpl(payload?: ChoosePayload): Promise<void> {
        return Promise.resolve();
    }

    protected createAsyncImpl(playerID?: string | string[]): Promise<void> {
        return Promise.resolve();
    }

    protected getIdImpl(): string {
        return "debug";
    }

    protected getPlayersAsyncImpl(): Promise<ConnectedPlayer[]> {
        return Promise.resolve([ConnectedPlayer.mock(), ConnectedPlayer.mock(), ConnectedPlayer.mock()]);
    }

    protected getTypeImpl(): ContextType {
        return "THREAD";
    }

    protected inviteAsyncImpl(payload: InvitePayload): Promise<number> {
        return Promise.resolve(0);
    }

    protected isSizeBetweenImpl(min?: number, max?: number): ContextSizeResponse | null {
        return {
            answer: true,
            minSize: min || 2,
            maxSize: max || 4,
        };
    }

    protected shareAsyncImpl(payload: SharePayload): Promise<number> {
        return Promise.resolve(0);
    }

    protected shareLinkAsyncImpl(payload: LinkSharePayload): Promise<string | void> {
        return Promise.resolve();
    }

    protected switchAsyncImpl(contextID: string, payload?: SwitchPayload): Promise<void> {
        return Promise.resolve();
    }

    protected updateAsyncImpl(payload: UpdatePayload): Promise<void> {
        return Promise.resolve();
    }

}
