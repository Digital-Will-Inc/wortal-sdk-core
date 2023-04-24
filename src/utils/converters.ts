import Leaderboard from "../models/leaderboard";
import LeaderboardEntry from "../models/leaderboard-entry";
import { ContextPayload } from "../types/context";

/** @hidden */
export function contextToLinkMessagePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.cta) obj.caption = payload.cta;
    if (payload?.caption) obj.caption = payload.caption;
    if (payload?.data) obj.data = payload.data;
    return obj;
}

/** @hidden */
export function contextToViberChoosePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        // Not used in this payload.
        image: "",
        text: "",
    }
    if (payload?.filters) obj.filters = payload.filters;
    if (payload?.maxSize) obj.maxSize = payload.maxSize;
    if (payload?.minSize) obj.minSize = payload.minSize;
    if (payload?.hoursSinceInvitation) obj.hoursSinceInvitation = payload.hoursSinceInvitation;
    if (payload?.description) obj.description = payload.description;
    return obj;
}

/** @hidden */
export function contextToViberSharePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.data) obj.data = payload.data;
    if (payload?.filters) obj.filters = payload.filters;
    if (payload?.hoursSinceInvitation) obj.hoursSinceInvitation = payload.hoursSinceInvitation;
    if (payload?.minShare) obj.minShare = payload.minShare;
    if (payload?.description) obj.description = payload.description;
    if (payload?.ui) obj.ui = payload.ui;
    if (payload?.cta) obj.cta = payload.cta;
    if (payload?.caption) obj.cta = payload.caption;
    if (payload?.intent) obj.intent = payload.intent
    else obj.intent = 'REQUEST';
    return obj;
}

/** @hidden */
export function contextToViberUpdatePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.cta) obj.cta = payload.cta;
    if (payload?.caption) obj.cta = payload.caption;
    if (payload?.data) obj.data = payload.data;
    if (payload?.strategy) obj.strategy = payload.strategy;
    if (payload?.notifications) obj.notifications = payload.notifications;
    if (payload?.action) obj.action = payload.action;
    else obj.action = "CUSTOM";
    if (payload?.template) obj.template = payload.template;
    else obj.template = "";
    return obj;
}

/** @hidden */
export function contextToFBInstantSharePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.data) obj.data = payload.data;
    if (payload?.shareDestination) obj.shareDestination = payload.shareDestination;
    if (payload?.switchContext) obj.switchContext = payload.switchContext;
    return obj;
}

/** @hidden */
export function contextToFBInstantUpdatePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.data) obj.data = payload.data;
    if (payload?.cta) obj.cta = payload.cta;
    if (payload?.caption) obj.cta = payload.caption;
    if (payload?.strategy) obj.strategy = payload.strategy;
    if (payload?.notifications) obj.notifications = payload.notifications;
    if (payload?.action) obj.action = payload.action;
    else obj.action = "CUSTOM";
    if (payload?.template) obj.template = payload.template;
    else obj.template = "";
    return obj;
}

/** @hidden */
export function contextToFBInstantChoosePayload(payload: ContextPayload): ContextPayload {
    let obj: ContextPayload = {
        // Not used in this payload.
        image: "",
        text: "",
    }
    if (payload?.filters) obj.filters = payload.filters;
    if (payload?.maxSize) obj.maxSize = payload.maxSize;
    if (payload?.minSize) obj.minSize = payload.minSize;
    return obj;
}

/** @hidden */
export function rakutenLeaderboardToWortal(leaderboard: any): Leaderboard {
    return new Leaderboard(
        leaderboard.$leaderboard.id, leaderboard.$leaderboard.name, leaderboard.$leaderboard.contextId
    );
}

/** @hidden */
export function rakutenLeaderboardEntryToWortal(entry: any): LeaderboardEntry {
    return new LeaderboardEntry({
        formattedScore: entry.$leaderboardEntry.formattedScore,
        player: {
            id: entry.$leaderboardEntry.player.id,
            name: entry.$leaderboardEntry.player.name,
            photo: entry.$leaderboardEntry.player.photo,
            isFirstPlay: false,
            daysSinceFirstPlay: 0,
        },
        rank: entry.$leaderboardEntry.rank,
        score: entry.$leaderboardEntry.score,
        timestamp: entry.$leaderboardEntry.timestamp,
        details: entry.$leaderboardEntry.extraData,
    });
}

/** @hidden */
export function facebookLeaderboardToWortal(leaderboard: any): Leaderboard {
    return new Leaderboard(
        leaderboard.getName(), leaderboard.getName(), leaderboard.getContextID()
    );
}

/** @hidden */
export function facebookLeaderboardEntryToWortal(entry: any): LeaderboardEntry {
    return new LeaderboardEntry({
        formattedScore: entry.getFormattedScore(),
        player: {
            id: entry.getPlayer().getID(),
            name: entry.getPlayer().getName(),
            photo: entry.getPlayer().getPhoto(),
            isFirstPlay: false,
            daysSinceFirstPlay: 0,
        },
        rank: entry.getRank(),
        score: entry.getScore(),
        timestamp: entry.getTimestamp(),
        details: entry.getExtraData(),
    });
}
