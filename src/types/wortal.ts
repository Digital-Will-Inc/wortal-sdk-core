/** @hidden */
export const PLATFORM_DOMAINS = {
    "viber": ["vbrplsbx.io"],
    "link": ["rgsbx.net", "lgsbx.net"],
    "wortal": ["html5gameportal.com", "html5gameportal.dev"],
    "gd": ["revision.gamedistribution.com", "gamedistribution.com", "html5.gamedistribution.com"],
    "facebook": ["facebook.com", "www.facebook.com", "apps.fbsbx.com"],
}

/** @hidden */
export const GD_EVENTS = {
    BEFORE_AD: "STARTED",
    AFTER_AD: "COMPLETE",
    AD_DISMISSED: "SKIPPED",
    AD_VIEWED: "SDK_REWARDED_WATCH_COMPLETE",
    NO_FILL: "AD_ERROR",
    ON_PAUSE: "SDK_GAME_PAUSE",
}

/** @hidden */
export const APIEndpoints = {
    ADS: "https://html5gameportal.com/api/v1/fig/ads/",
    NOTIFICATIONS: "https://html5gameportal.com/api/v1/notification/",
}

/** @hidden */
export type ShareTo = "facebook" | "twitter"
