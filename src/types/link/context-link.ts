import ContextPlayerLink from '../../models/link/context-player-link'
import { PlayerRawDataLink } from './player-link'
import { MessageOptionsLink } from './message-options-link'
import { LocalizableContent } from '../localizable-content'

export interface ContextChoosePayloadLink extends MessageOptionsLink {
}

/** @hidden */
export interface ContextSizeResponseLink {
    /** Result about whether the context fits the requested size */
    answer: boolean;
    /** The minimum bound of the context size query */
    minSize?: number;
    /** The maximum bound of the context size query */
    maxSize?: number;
}

/** @hidden */
export interface CurrentContextLink {
    id: string | null;
    type: 'SOLO' | 'THREAD';
    size: number;
    connectedPlayers: ContextPlayerLink[];
}

/** @hidden */
export interface InitializeResponseContextLink {
    id: string | null;
    type: 'SOLO' | 'THREAD';
    size: number;
    connectedPlayers: PlayerRawDataLink[];
}

export interface ContextCreatePayloadLink {
    /**
     * Message which will be displayed to contact.
     * GAME_NAME, SENDER_NAME, RECEIVER_NAME can be used as template string in the text.
     * If not specified, "RECEIVER_NAME\nとプレイしますか？" will be used by default.
     */
    text?: string | LocalizableContent,
    /**
     * Text of the call to action button.
     * If not specified, "プレイ" will be used by default.
     */
    caption?: string | LocalizableContent,
}
