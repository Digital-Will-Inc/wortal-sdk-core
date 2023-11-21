import { LeaderboardPlayerAvatarSize_Yandex, LeaderboardResultType_Yandex } from "../types/yandex-leaderboard-types";

/**
 * Leaderboard interface for Yandex.
 * https://yandex.com/dev/games/doc/en/sdk/sdk-leaderboard#response-format
 * @hidden
 */
export interface Leaderboard_Yandex {
    appID: string;
    default: boolean;
    description: {
        invert_sort_order: boolean,
        score_format: {
            options: {
                decimal_offset: number,
            }
        }
        type: LeaderboardResultType_Yandex,
    },
    name: string,
    title: {
        en?: string,
        ru?: string,
        be?: string,
        uk?: string,
        kk?: string,
        uz?: string,
        tr?: string,
    },
}

/**
 * Leaderboard entry interface for Yandex.
 * https://yandex.com/dev/games/doc/en/sdk/sdk-leaderboard#response-format1
 * @hidden
 */
export interface LeaderboardEntry_Yandex {
    score: number;
    extraData?: string;
    rank: number;
    player: LeaderboardPlayer_Yandex;
    formattedScore?: string;
}

/**
 * Leaderboard player interface for Yandex.
 * https://yandex.com/dev/games/doc/en/sdk/sdk-leaderboard#response-format1
 * @hidden
 */
export interface LeaderboardPlayer_Yandex {
    getAvatarSrc: (size: LeaderboardPlayerAvatarSize_Yandex) => string;
    getAvatarSrcSet: (size: LeaderboardPlayerAvatarSize_Yandex) => string;
    lang: string;
    publicName: string;
    scopePermissions: {
        avatar: string;
        public_name: string;
    },
    uniqueID: string;
}

/**
 * Options for getting leaderboard entries from Yandex.
 * https://yandex.com/dev/games/doc/en/sdk/sdk-leaderboard#get-entries
 * @hidden
 */
export interface LeaderboardGetEntriesOptions_Yandex {
    // Include the user entry. Default is false.
    includeUser?: boolean;
    // Number of entries to return below and above the user in the leaderboard. The minimum value is 1, the maximum value is 10. The default is 5.
    quantityAround?: number;
    // Number of entries from the top of the leaderboard. The minimum value is 1, the maximum value is 20. The default is 5.
    quantityTop?: number;
}

/**
 * Result for getting leaderboard entries from Yandex.
 * https://yandex.com/dev/games/doc/en/sdk/sdk-leaderboard#response-format2
 * @hidden
 */
export interface LeaderboardGetEntriesResult_Yandex {
    leaderboard: Leaderboard_Yandex;
    ranges: LeaderboardRankingRange_Yandex[];
    userRank: number;
    entries: LeaderboardEntry_Yandex[];
}

/**
 * Ranking range for leaderboard entries from Yandex.
 * https://yandex.com/dev/games/doc/en/sdk/sdk-leaderboard#response-format2
 * @hidden
 */
export interface LeaderboardRankingRange_Yandex {
    start: number;
    size: number;
}
