import ConnectedPlayerLink from "../../models/link/connected-player-link";
import { CustomPermissionLink } from './custom-permission-link'

/** @hidden */
export interface PlayerDataLink {
    [key: string]: any;
}

/** @hidden */
export interface PlayerRawDataLink {
    id: string,
    name: string,
    photo: string,
}

/** @hidden */
export interface CurrentPlayerLink {
    name: string | null,
    id: string | null,
    photo: string | null,
    connectedPlayers: ConnectedPlayerLink[],
}

/** @hidden */
export interface InitializeResponsePlayerLink {
    name: string,
    id: string,
    photo: string,
    connectedPlayers: PlayerRawDataLink[],
    customPermission: CustomPermissionLink
}
