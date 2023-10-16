/** @hidden */
export const PLATFORM_DOMAINS = {
    "viber": ["vbrplsbx.io"],
    "link": ["rgsbx.net", "lgsbx.net"],
    "wortal": ["html5gameportal.com", "html5gameportal.dev"],
    "gd": ["revision.gamedistribution.com", "gamedistribution.com", "html5.gamedistribution.com"],
    "facebook": ["facebook.com", "www.facebook.com", "apps.fbsbx.com"],
    "crazygames": ["crazygames.com", "www.crazygames.com", "developer.crazygames.com"],
    "gamepix": ["gamepix.com", "my.gamepix.com", "test.builds.gamepix.com"],
    // This isn't used as the game is served in an iframe from Wortal, which we check the query params of to detect Telegram.
    // This is just added here for completeness.
    "telegram": ["playdeck.io"],
    "gamemonetize": ["gamemonetize.com", "gamemonetize.co", "gamemonetize.games"],
}

/** @hidden */
export const EXTERNAL_EVENTS_GD_GameMonetize = {
    SDK_READY: "SDK_READY",
    BEFORE_AD: "SDK_GAME_PAUSE",
    AFTER_AD: "SDK_GAME_START",
    AD_DISMISSED: "SKIPPED",
    AD_VIEWED: "SDK_REWARDED_WATCH_COMPLETE",
    NO_FILL: "AD_ERROR",
}

/** @hidden */
export const TELEGRAM_API = {
    GET_USER: "getUser",
    GET_DATA: "getData",
    SET_DATA: "setData",
    GET_SCORE: "getScore",
    GET_GLOBAL_SCORE: "getGlobalScore",
    SET_SCORE: "setScore",
    GET_LOCALE: "getUserLocale",
    GET_STATE: "getPlaydeckState",
}

/**
 * Different endpoints for Wortal API. Always ends with a slash.
 * @hidden
 */
export const APIEndpoints = {
    ADS: "https://html5gameportal.com/api/v1/fig/ads/",
    VIBER: "https://html5gameportal.com/api/v1/viber/",
    NOTIFICATIONS: "https://html5gameportal.com/api/v1/notification/",
}

/**
 * Status of the authentication process.
 */
export type AuthStatus = "success" | "error" | "cancel";

/** @hidden */
export type ShareTo = "facebook" | "twitter"

/** @hidden */
export type Error_CrazyGames = string;
