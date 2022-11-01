import {LocalizedContent} from "./localized-content";
import SocialPlayer from "../models/social-player";

/**
 * Types of group filtering.
 *
 * NEW_GROUP_ONLY - Groups that the current player is in, but never participated in (e.g. a new group created by a friend).
 * INCLUDE_EXISTING_GROUPS - Groups that the current player has participated in before.
 * NEW_PLAYERS_ONLY - List of friends who haven't played this game before.
 * NEW_INVITES_ONLY - List of friends who haven't been sent an in-game message before. This filter can be fine-tuned with `hoursSinceInvitation` parameter.
 */
export type GroupFilter = 'NEW_GROUP_ONLY' | 'EXISTING_GROUPS' | 'NEW_PLAYERS_ONLY' | 'NEW_INVITES_ONLY';

/**
 * A request for a friend list to use for a group.
 */
export interface GroupRequest {
    /**
     * Filter to be applied to the friend list.
     */
    filter?: GroupFilter;
    /**
     * Minimum size for the friend list returned.
     */
    minSize?: number;
    /**
     * Maximum size for the friend list returned.
     */
    maxSize?: number;
    /**
     * Define how long a friend should be filtered out after the current player sends them a message.
     * This parameter only applies when the `NEW_INVITES_ONLY` filter is used.
     * When not defined, it will filter out any friend who has already been sent a message.
     */
    hoursSinceInvitation?: number;
    /**
     * Optional customizable text field in the share UI.
     * This can be used to describe the incentive a user can get from sharing.
     */
    description?: string | LocalizedContent;
}

/** @hidden */
export interface CreateGroupResponse {
    id: string;
    type: 'GROUP';
    size: number;
}

/** @hidden */
export interface CurrentGroup {
    id: string;
    type: 'SOLO' | 'GROUP';
    size: number;
    players: SocialPlayer[];
}
