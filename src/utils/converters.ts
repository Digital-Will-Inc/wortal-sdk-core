import Wortal from "../index";
import Leaderboard from "../models/leaderboard";
import LeaderboardEntry from "../models/leaderboard-entry";
import { LinkMessagePayload, SharePayload, UpdatePayload } from "../types/payloads";

/** @hidden */
export function convertToLinkMessagePayload(payload: SharePayload | UpdatePayload): LinkMessagePayload {
    let messagePayload: LinkMessagePayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.cta) messagePayload.caption = payload.cta;
    if (payload?.data) messagePayload.data = payload.data;
    return messagePayload;
}

/** @hidden */
export function convertToFBInstantSharePayload(payload: SharePayload): SharePayload {
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

/** @hidden */
export function convertToFBInstantUpdatePayload(payload: UpdatePayload): UpdatePayload {
    if (payload.strategy === "IMMEDIATE_CLEAR") {
        payload.strategy = "IMMEDIATE";
    }
    return payload;
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
