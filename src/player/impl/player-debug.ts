import { ConnectedPlayer } from "../classes/connected-player";
import { DebugPlayer } from "../classes/debug-player";
import { Player } from "../classes/player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import { SignedASID } from "../interfaces/facebook-player";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";

/**
 * Debug implementation of the Player API. This is used for testing purposes.
 * @hidden
 */
export class PlayerDebug extends PlayerBase {
    protected _player: Player;

    constructor() {
        super();
        this._player = new DebugPlayer();
    }

    protected canSubscribeBotAsyncImpl(): Promise<boolean> {
        return Promise.resolve(true);
    }

    protected flushDataAsyncImpl(): Promise<void> {
        return Promise.resolve();
    }

    protected getASIDAsyncImpl(): Promise<string> {
        return Promise.resolve(this._player.id);
    }

    protected getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        return Promise.resolve([ConnectedPlayer.mock(), ConnectedPlayer.mock(), ConnectedPlayer.mock()]);
    }

    protected getDataAsyncImpl(keys: string[]): Promise<any> {
        return this.defaultGetDataAsyncImpl(keys);
    }

    protected getSignedASIDAsyncImpl(): Promise<SignedASID> {
        return Promise.resolve({
            asid: this._player.id,
            signature: "debug.signature",
        });
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        return Promise.resolve({
            id: this._player.id,
            signature: "debug.signature",
        });
    }

    protected getTokenAsyncImpl(): Promise<string> {
        return Promise.resolve("debug.token");
    }

    protected setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        return this.defaultSetDataAsyncImpl(data);
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        return Promise.resolve();
    }

}
