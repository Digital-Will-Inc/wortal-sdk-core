import { Leaderboard, LeaderboardEntry } from "../classes/leaderboard";
import { Tournament } from "../classes/tournament";
import { InvitePayload, LinkMessagePayload, SharePayload, UpdatePayload } from "../interfaces/context";
import { TelegramLeaderboardEntry } from "../interfaces/leaderboard";
import { ContextFilter, InviteFilter } from "../types/context";
import Wortal from "../index";
import { warn } from "./logger";
import { generateRandomID } from "./wortal-utils";

/** @hidden */
export function convertToLinkMessagePayload(payload: SharePayload | UpdatePayload): LinkMessagePayload {
    const messagePayload: LinkMessagePayload = {
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
    if (typeof payload.action === "undefined") {
        payload.action = "CUSTOM";
    }
    if (typeof payload.template === "undefined") {
        payload.template = "";
    }
    return payload;
}

/** @hidden */
export function convertToViberSharePayload(payload: InvitePayload): SharePayload {
    const sharePayload: SharePayload = {
        image: payload.image,
        text: payload.text,
    }
    if (payload?.cta) sharePayload.cta = payload.cta;
    if (payload?.data) sharePayload.data = payload.data;
    if (payload?.filters) {
        sharePayload.filters = _convertInviteFilterToContextFilter(payload.filters);
    }
    return sharePayload;
}

/** @hidden */
export function convertRakutenLeaderboardToWortal(leaderboard: any): Leaderboard {
    return new Leaderboard(
        leaderboard.$leaderboard.id, leaderboard.$leaderboard.name, leaderboard.$leaderboard.contextId
    );
}

/** @hidden */
export function convertRakutenLeaderboardEntryToWortal(entry: any): LeaderboardEntry {
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
export function convertFacebookLeaderboardToWortal(leaderboard: any): Leaderboard {
    return new Leaderboard(
        leaderboard.getName(), leaderboard.getName(), leaderboard.getContextID()
    );
}

/** @hidden */
export function convertFacebookLeaderboardEntryToWortal(entry: any): LeaderboardEntry {
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

/** @hidden */
export function convertTelegramLeaderboardEntryToWortal(entry: TelegramLeaderboardEntry): LeaderboardEntry {
    return new LeaderboardEntry({
        rank: entry.position,
        score: entry.score,
        player: {
            id: generateRandomID(),
            name: entry.username || "Telegram Player",
            photo: "https://storage.googleapis.com/html5gameportal.com/images/avatar.jpg",
            isFirstPlay: false,
            daysSinceFirstPlay: 0,
        }
    });
}

/** @hidden */
export function convertFacebookTournamentToWortal(tournament: any): Tournament {
    return new Tournament(
        tournament.getID(), tournament.getContextID(), tournament.getEndTime(), tournament.getTitle(), tournament.getPayload()
    );
}

/**
 * Attempts to convert a string to a number. This will extract the first number from the string.
 * @example
 * convertStringToNumber("Level 1") // 1
 * convertStringToNumber("100 points") // 100
 * @param value String to convert. Passing a non-string will result in a warning and null being returned.
 * @returns {number|null} The first number extracted from the string, or null if no number was found.
 * @hidden
 */
export function convertStringToNumber(value: any): number | null {
    if (typeof value !== "string") {
        warn(`convertStringToNumber: value is not a string. (value: ${value})`, typeof value);
        return null;
    }

    const match = value.match(/\d+/);
    if (match) {
        const result = parseInt(match[0], 10);
        if (isNaN(result)) {
            return null;
        } else {
            return result;
        }
    } else {
        return null;
    }
}

function _convertInviteFilterToContextFilter(filter: InviteFilter | InviteFilter[]): [ContextFilter] | undefined {
    if (typeof filter === "string") {
        if (_isContextFilterValid(filter)) {
            return [filter];
        } else {
            return undefined;
        }
    } else if (Array.isArray(filter)) {
        // Viber only accepts the first filter so just return that.
        for (let i = 0; i < filter.length; i++) {
            if (_isContextFilterValid(filter[i])) {
                return [filter[i]] as [ContextFilter];
            }
        }
        return undefined;
    } else {
        return undefined;
    }
}

function _isContextFilterValid(value: string): value is ContextFilter {
    return ['NEW_CONTEXT_ONLY', 'INCLUDE_EXISTING_CHALLENGES', 'NEW_PLAYERS_ONLY', 'NEW_INVITATIONS_ONLY'].includes(value);
}
