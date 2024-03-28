import { Platform } from "../session/types/session-types";

/**
 * Domain names for each platform. These are used to detect which platform the game is being played on.
 * @hidden
 */
export const PLATFORM_DOMAINS: PlatformDomains = {
    "yandex": ["yandex.com", "yandex.ru", "yandex.net"],
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
    "poki": ["poki.com", "poki.dev", "poki-user-content.com"],
    "addictinggames": ["addictinggames.com", "shockwave.com"],
}

/**
 * List of platforms that only support local chunks. This is used to determine whether to load chunks from the CDN or locally.
 * Some platforms impose CSP restrictions that prevent loading chunks from the CDN. In these cases we add the chunks
 * to the game bundle in the backend.
 * @hidden
 */
export const LOCAL_CHUNKS_ONLY: Platform[] = ["poki", "yandex"];

/**
 * Different endpoints for Wortal API. Always ends with a slash.
 * @hidden
 */
export const API_ENDPOINTS = {
    ADS: "https://html5gameportal.com/api/v1/fig/ads/",
    VIBER: "https://html5gameportal.com/api/v1/viber/",
    NOTIFICATIONS: "https://html5gameportal.com/api/v1/notification/",
    XSOLLA_STORE: 'https://store.xsolla.com/api',
    WAVES_API_BASE_URL: `${__WORTAL_BASE_URL__}/api/v1/waves`,
    WORTAL_SDK_PARAMETER: `${__WORTAL_BASE_URL__}/api/v1/game-sdk-param`,
}

/**
 * Source URLs for platform SDKs.
 * @hidden
 */
export const SDK_SRC = {
    GOOGLE: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
    LINK: "https://lg.rgames.jp/libs/link-game-sdk/1.3.0/bundle.js",
    VIBER: "https://vbrpl.io/libs/viber-play-sdk/1.14.0/bundle.js",
    FACEBOOK: "https://connect.facebook.net/en_US/fbinstant.7.1.js",
    GD: "https://html5.api.gamedistribution.com/main.min.js",
    CRAZY_GAMES: "https://sdk.crazygames.com/crazygames-sdk-v3.js",
    GAME_PIX: "https://integration.gamepix.com/sdk/v3/gamepix.sdk.js",
    GAME_MONETIZE: "https://api.gamemonetize.com/sdk.js",
    POKI: "https://game-cdn.poki.com/scripts/v2/poki-sdk.js",
    ADDICTING_GAMES_SDK: "https://swagapi.shockwave.com/dist/swag-api.js",
    ADDICTING_GAMES_CSS: "https://swagapi.shockwave.com/dist/swag-api.css",
    YANDEX: "https://yandex.ru/games/sdk/v2",
    XSOLLA: "https://login-sdk.xsolla.com/latest/",
    XSOLLA_PAY_STATION: "https://cdn.xsolla.net/embed/paystation/1.2.7/widget.min.js"
}

/**
 * List of APIs supported by the Telegram SDK.
 * @hidden
 */
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
 * List of events triggered by both the GD and GameMonetize SDKs. These are used to handle event callbacks.
 * @hidden
 */
export const GD_GAME_MONETIZE_API = {
    SDK_READY: "SDK_READY",
    BEFORE_AD: "SDK_GAME_PAUSE",
    AFTER_AD: "SDK_GAME_START",
    AD_DISMISSED: "SKIPPED",
    AD_VIEWED: "SDK_REWARDED_WATCH_COMPLETE",
    NO_FILL: "AD_ERROR",
}

/**
 * List of all APIs supported by the SDK.
 * @hidden
 */
export const WORTAL_API= {
    INITIALIZE_ASYNC: "initializeAsync",
    START_GAME_ASYNC: "startGameAsync",
    AUTHENTICATE_ASYNC: "authenticateAsync",
    LINK_ACCOUNT_ASYNC: "linkAccountAsync",
    SET_LOADING_PROGRESS: "setLoadingProgress",
    ON_PAUSE: "onPause",
    PERFORM_HAPTIC_FEEDBACK_ASYNC: "performHapticFeedbackAsync",
    GET_SUPPORTED_APIS: "getSupportedAPIs",
    ACHIEVEMENTS_GET_ACHIEVEMENTS_ASYNC: "achievements.getAchievementsAsync",
    ACHIEVEMENTS_UNLOCK_ACHIEVEMENT_ASYNC: "achievements.unlockAchievementAsync",
    ADS_IS_AD_BLOCKED: "ads.isAdBlocked",
    ADS_SHOW_INTERSTITIAL: "ads.showInterstitial",
    ADS_SHOW_REWARDED: "ads.showRewarded",
    ADS_SHOW_BANNER: "ads.showBanner",
    ANALYTICS_LOG_LEVEL_START: "analytics.logLevelStart",
    ANALYTICS_LOG_LEVEL_END: "analytics.logLevelEnd",
    ANALYTICS_LOG_TUTORIAL_START: "analytics.logTutorialStart",
    ANALYTICS_LOG_TUTORIAL_END: "analytics.logTutorialEnd",
    ANALYTICS_LOG_LEVEL_UP: "analytics.logLevelUp",
    ANALYTICS_LOG_SCORE: "analytics.logScore",
    ANALYTICS_LOG_GAME_CHOICE: "analytics.logGameChoice",
    ANALYTICS_LOG_SOCIAL_INVITE: "analytics.logSocialInvite",
    ANALYTICS_LOG_SOCIAL_SHARE: "analytics.logSocialShare",
    ANALYTICS_LOG_PURCHASE: "analytics.logPurchase",
    ANALYTICS_LOG_PURCHASE_SUBSCRIPTION: "analytics.logPurchaseSubscription",
    CONTEXT_GET_ID: "context.getId",
    CONTEXT_GET_TYPE: "context.getType",
    CONTEXT_GET_PLAYERS_ASYNC: "context.getPlayersAsync",
    CONTEXT_INVITE_ASYNC: "context.inviteAsync",
    CONTEXT_SHARE_ASYNC: "context.shareAsync",
    CONTEXT_SHARE_LINK_ASYNC: "context.shareLinkAsync",
    CONTEXT_UPDATE_ASYNC: "context.updateAsync",
    CONTEXT_CHOOSE_ASYNC: "context.chooseAsync",
    CONTEXT_SWITCH_ASYNC: "context.switchAsync",
    CONTEXT_CREATE_ASYNC: "context.createAsync",
    CONTEXT_IS_SIZE_BETWEEN: "context.isSizeBetween",
    IAP_IS_ENABLED: "iap.isEnabled",
    IAP_GET_CATALOG_ASYNC: "iap.getCatalogAsync",
    IAP_GET_PURCHASES_ASYNC: "iap.getPurchasesAsync",
    IAP_MAKE_PURCHASE_ASYNC: "iap.makePurchaseAsync",
    IAP_CONSUME_PURCHASE_ASYNC: "iap.consumePurchaseAsync",
    IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC: "iap.getSubscribableCatalogAsync",
    IAP_PURCHASE_SUBSCRIPTION_ASYNC: "iap.purchaseSubscriptionAsync",
    IAP_GET_SUBSCRIPTIONS_ASYNC: "iap.getSubscriptionsAsync",
    IAP_CANCEL_SUBSCRIPTION_ASYNC: "iap.cancelSubscriptionAsync",
    LEADERBOARD_GET_LEADERBOARD_ASYNC: "leaderboard.getLeaderboardAsync",
    LEADERBOARD_SEND_ENTRY_ASYNC: "leaderboard.sendEntryAsync",
    LEADERBOARD_GET_ENTRIES_ASYNC: "leaderboard.getEntriesAsync",
    LEADERBOARD_GET_PLAYER_ENTRY_ASYNC: "leaderboard.getPlayerEntryAsync",
    LEADERBOARD_GET_ENTRY_COUNT_ASYNC: "leaderboard.getEntryCountAsync",
    LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC: "leaderboard.getConnectedPlayerEntriesAsync",
    NOTIFICATIONS_SCHEDULE_ASYNC: "notifications.scheduleAsync",
    NOTIFICATIONS_GET_HISTORY_ASYNC: "notifications.getHistoryAsync",
    NOTIFICATIONS_CANCEL_ASYNC: "notifications.cancelAsync",
    NOTIFICATIONS_CANCEL_ALL_ASYNC: "notifications.cancelAllAsync",
    PLAYER_GET_ID: "player.getID",
    PLAYER_GET_NAME: "player.getName",
    PLAYER_GET_PHOTO: "player.getPhoto",
    PLAYER_IS_FIRST_PLAY: "player.isFirstPlay",
    PLAYER_GET_DATA_ASYNC: "player.getDataAsync",
    PLAYER_SET_DATA_ASYNC: "player.setDataAsync",
    PLAYER_FLUSH_DATA_ASYNC: "player.flushDataAsync",
    PLAYER_GET_CONNECTED_PLAYERS_ASYNC: "player.getConnectedPlayersAsync",
    PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC: "player.getSignedPlayerInfoAsync",
    PLAYER_GET_ASID_ASYNC: "player.getASIDAsync",
    PLAYER_GET_SIGNED_ASID_ASYNC: "player.getSignedASIDAsync",
    PLAYER_CAN_SUBSCRIBE_BOT_ASYNC: "player.canSubscribeBotAsync",
    PLAYER_SUBSCRIBE_BOT_ASYNC: "player.subscribeBotAsync",
    PLAYER_GET_TOKEN_ASYNC: "player.getTokenAsync",
    PLAYER_ON_LOGIN: "player.onLogin",
    SESSION_GET_ENTRY_POINT_DATA: "session.getEntryPointData",
    SESSION_GET_ENTRY_POINT_ASYNC: "session.getEntryPointAsync",
    SESSION_SET_SESSION_DATA: "session.setSessionData",
    SESSION_GET_LOCALE: "session.getLocale",
    SESSION_GET_TRAFFIC_SOURCE: "session.getTrafficSource",
    SESSION_GET_PLATFORM: "session.getPlatform",
    SESSION_GET_DEVICE: "session.getDevice",
    SESSION_GET_ORIENTATION: "session.getOrientation",
    SESSION_ON_ORIENTATION_CHANGE: "session.onOrientationChange",
    SESSION_SWITCH_GAME_ASYNC: "session.switchGameAsync",
    SESSION_HAPPY_TIME: "session.happyTime",
    SESSION_GAMEPLAY_START: "session.gameplayStart",
    SESSION_GAMEPLAY_STOP: "session.gameplayStop",
    SESSION_GAME_LOADING_START: "session.gameLoadingStart",
    SESSION_GAME_LOADING_STOP: "session.gameLoadingStop",
    STATS_GET_STATS_ASYNC: "stats.getStatsAsync",
    STATS_POST_STATS_ASYNC: "stats.postStatsAsync",
    TOURNAMENT_GET_CURRENT_ASYNC: "tournament.getCurrentAsync",
    TOURNAMENT_GET_ALL_ASYNC: "tournament.getAllAsync",
    TOURNAMENT_POST_SCORE_ASYNC: "tournament.postScoreAsync",
    TOURNAMENT_CREATE_ASYNC: "tournament.createAsync",
    TOURNAMENT_SHARE_ASYNC: "tournament.shareAsync",
    TOURNAMENT_JOIN_ASYNC: "tournament.joinAsync",
};

/**
 * List of all URLs for all APIs supported by the SDK. These are used to link to the documentation in error messages.
 * @hidden
 */
export const API_URL = {
    GET_SUPPORTED_APIS: "https://sdk.html5gameportal.com/api/wortal/#getsupportedapis",
    INITIALIZE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#initializeasync",
    START_GAME_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#startgameasync",
    AUTHENTICATE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#authenticateasync",
    LINK_ACCOUNT_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#linkaccountasync",
    SET_LOADING_PROGRESS: "https://sdk.html5gameportal.com/api/wortal/#setloadingprogress",
    ON_PAUSE: "https://sdk.html5gameportal.com/api/wortal/#onpause",
    PERFORM_HAPTIC_FEEDBACK_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#performhapticfeedbackasync",
    ACHIEVEMENTS_GET_ACHIEVEMENTS_ASYNC: "https://sdk.html5gameportal.com/api/achievements/#getachievementsasync",
    ACHIEVEMENTS_UNLOCK_ACHIEVEMENT_ASYNC: "https://sdk.html5gameportal.com/api/achievements/#unlockachievementasync",
    ADS_SHOW_INTERSTITIAL: "https://sdk.html5gameportal.com/api/ads/#showinterstitial",
    ADS_SHOW_REWARDED: "https://sdk.html5gameportal.com/api/ads/#showrewarded",
    ADS_SHOW_BANNER: "https://sdk.html5gameportal.com/api/ads/#showbanner",
    ANALYTICS_LOG_LEVEL_START: "https://sdk.html5gameportal.com/api/analytics/#loglevelstart",
    ANALYTICS_LOG_LEVEL_END: "https://sdk.html5gameportal.com/api/analytics/#loglevelend",
    ANALYTICS_LOG_LEVEL_UP: "https://sdk.html5gameportal.com/api/analytics/#loglevelup",
    ANALYTICS_LOG_SCORE: "https://sdk.html5gameportal.com/api/analytics/#logscore",
    ANALYTICS_LOG_GAME_CHOICE: "https://sdk.html5gameportal.com/api/analytics/#loggamechoice",
    ANALYTICS_LOG_SOCIAL_INVITE: "https://sdk.html5gameportal.com/api/analytics/#logsocialinvite",
    ANALYTICS_LOG_SOCIAL_SHARE: "https://sdk.html5gameportal.com/api/analytics/#logsocialshare",
    ANALYTICS_LOG_PURCHASE: "https://sdk.html5gameportal.com/api/analytics/#logpurchase",
    ANALYTICS_LOG_PURCHASE_SUBSCRIPTION: "https://sdk.html5gameportal.com/api/analytics/#logpurchasesubscription",
    ANALYTICS_LOG_TUTORIAL_END: "https://sdk.html5gameportal.com/api/analytics/#logtutorialend",
    ANALYTICS_LOG_TUTORIAL_START: "https://sdk.html5gameportal.com/api/analytics/#logtutorialstart",
    CONTEXT_GET_ID: "https://sdk.html5gameportal.com/api/context/#getid",
    CONTEXT_GET_TYPE: "https://sdk.html5gameportal.com/api/context/#gettype",
    CONTEXT_GET_PLAYERS_ASYNC: "https://sdk.html5gameportal.com/api/context/#getplayersasync",
    CONTEXT_INVITE_ASYNC: "https://sdk.html5gameportal.com/api/context/#inviteasync",
    CONTEXT_IS_SIZE_BETWEEN: "https://sdk.html5gameportal.com/api/context/#issizebetween",
    CONTEXT_SHARE_ASYNC: "https://sdk.html5gameportal.com/api/context/#shareasync",
    CONTEXT_SHARE_LINK_ASYNC: "https://sdk.html5gameportal.com/api/context/#sharelinkasync",
    CONTEXT_UPDATE_ASYNC: "https://sdk.html5gameportal.com/api/context/#updateasync",
    CONTEXT_CHOOSE_ASYNC: "https://sdk.html5gameportal.com/api/context/#chooseasync",
    CONTEXT_SWITCH_ASYNC: "https://sdk.html5gameportal.com/api/context/#switchasync",
    CONTEXT_CREATE_ASYNC: "https://sdk.html5gameportal.com/api/context/#createasync",
    IAP_GET_CATALOG_ASYNC: "https://sdk.html5gameportal.com/api/iap/#getcatalogasync",
    IAP_GET_PURCHASES_ASYNC: "https://sdk.html5gameportal.com/api/iap/#getpurchasesasync",
    IAP_MAKE_PURCHASE_ASYNC: "https://sdk.html5gameportal.com/api/iap/#makepurchaseasync",
    IAP_CONSUME_PURCHASE_ASYNC: "https://sdk.html5gameportal.com/api/iap/#consumepurchaseasync",
    IAP_GET_SUBSCRIBABLE_CATALOG_ASYNC: "https://sdk.html5gameportal.com/api/iap/#getsubscribablecatalogasync",
    IAP_PURCHASE_SUBSCRIPTION_ASYNC: "https://sdk.html5gameportal.com/api/iap/#purchasesubscriptionasync",
    IAP_GET_SUBSCRIPTIONS_ASYNC: "https://sdk.html5gameportal.com/api/iap/#getsubscriptionsasync",
    IAP_CANCEL_SUBSCRIPTION_ASYNC: "https://sdk.html5gameportal.com/api/iap/#cancelsubscriptionasync",
    LEADERBOARD_GET_LEADERBOARD_ASYNC: "https://sdk.html5gameportal.com/api/leaderboard/#getleaderboardasync",
    LEADERBOARD_SEND_ENTRY_ASYNC: "https://sdk.html5gameportal.com/api/leaderboard/#sendentryasync",
    LEADERBOARD_GET_ENTRIES_ASYNC: "https://sdk.html5gameportal.com/api/leaderboard/#getentriesasync",
    LEADERBOARD_GET_PLAYER_ENTRY_ASYNC: "https://sdk.html5gameportal.com/api/leaderboard/#getplayerentryasync",
    LEADERBOARD_GET_ENTRY_COUNT_ASYNC: "https://sdk.html5gameportal.com/api/leaderboard/#getentrycountasync",
    LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC: "https://sdk.html5gameportal.com/api/leaderboard/#getconnectedplayerentriesasync",
    NOTIFICATIONS_SCHEDULE_ASYNC: "https://sdk.html5gameportal.com/api/notifications/#scheduleasync",
    NOTIFICATIONS_GET_HISTORY_ASYNC: "https://sdk.html5gameportal.com/api/notifications/#gethistoryasync",
    NOTIFICATIONS_CANCEL_ASYNC: "https://sdk.html5gameportal.com/api/notifications/#cancelasync",
    NOTIFICATIONS_CANCEL_ALL_ASYNC: "https://sdk.html5gameportal.com/api/notifications/#cancelallasync",
    PLAYER_GET_DATA_ASYNC: "https://sdk.html5gameportal.com/api/player/#getdataasync",
    PLAYER_SET_DATA_ASYNC: "https://sdk.html5gameportal.com/api/player/#setdataasync",
    PLAYER_FLUSH_DATA_ASYNC: "https://sdk.html5gameportal.com/api/player/#flushdataasync",
    PLAYER_GET_CONNECTED_PLAYERS_ASYNC: "https://sdk.html5gameportal.com/api/player/#getconnectedplayersasync",
    PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC: "https://sdk.html5gameportal.com/api/player/#getsignedplayerinfoasync",
    PLAYER_GET_ASID_ASYNC: "https://sdk.html5gameportal.com/api/player/#getasidasync",
    PLAYER_GET_SIGNED_ASID_ASYNC: "https://sdk.html5gameportal.com/api/player/#getsignedasidasync",
    PLAYER_CAN_SUBSCRIBE_BOT_ASYNC: "https://sdk.html5gameportal.com/api/player/#cansubscribebotasync",
    PLAYER_SUBSCRIBE_BOT_ASYNC: "https://sdk.html5gameportal.com/api/player/#subscribebotasync",
    PLAYER_GET_ID: "https://sdk.html5gameportal.com/api/player/#getid",
    PLAYER_GET_NAME: "https://sdk.html5gameportal.com/api/player/#getname",
    PLAYER_GET_PHOTO: "https://sdk.html5gameportal.com/api/player/#getphoto",
    PLAYER_IS_FIRST_PLAY: "https://sdk.html5gameportal.com/api/player/#isfirstplay",
    PLAYER_GET_TOKEN_ASYNC: "https://sdk.html5gameportal.com/api/player/#gettokenasync",
    PLAYER_ON_LOGIN: "https://sdk.html5gameportal.com/api/player/#onlogin",
    SESSION_GAMEPLAY_STOP: "https://sdk.html5gameportal.com/api/session/#gameplaystop",
    SESSION_GAMEPLAY_START: "https://sdk.html5gameportal.com/api/session/#gameplaystart",
    SESSION_GET_LOCALE: "https://sdk.html5gameportal.com/api/session/#getlocale",
    SESSION_GET_TRAFFIC_SOURCE: "https://sdk.html5gameportal.com/api/session/#gettrafficsource",
    SESSION_GET_PLATFORM: "https://sdk.html5gameportal.com/api/session/#getplatform",
    SESSION_GET_DEVICE: "https://sdk.html5gameportal.com/api/session/#getdevice",
    SESSION_GET_ORIENTATION: "https://sdk.html5gameportal.com/api/session/#getorientation",
    SESSION_GET_ENTRY_POINT_DATA: "https://sdk.html5gameportal.com/api/session/#getentrypointdata",
    SESSION_GET_ENTRY_POINT_ASYNC: "https://sdk.html5gameportal.com/api/session/#getentrypointasync",
    SESSION_SET_SESSION_DATA: "https://sdk.html5gameportal.com/api/session/#setsessiondata",
    SESSION_HAPPY_TIME: "https://sdk.html5gameportal.com/api/session/#happytime",
    SESSION_ON_ORIENTATION_CHANGE: "https://sdk.html5gameportal.com/api/session/#onorientationchange",
    SESSION_SWITCH_GAME_ASYNC: "https://sdk.html5gameportal.com/api/session/#switchgameasync",
    STATS_GET_STATS_ASYNC: "https://sdk.html5gameportal.com/api/stats/#getstatsasync",
    STATS_POST_STATS_ASYNC: "https://sdk.html5gameportal.com/api/stats/#poststatsasync",
    TOURNAMENT_GET_CURRENT_ASYNC: "https://sdk.html5gameportal.com/api/tournament/#getcurrentasync",
    TOURNAMENT_GET_ALL_ASYNC: "https://sdk.html5gameportal.com/api/tournament/#getallasync",
    TOURNAMENT_POST_SCORE_ASYNC: "https://sdk.html5gameportal.com/api/tournament/#postscoreasync",
    TOURNAMENT_CREATE_ASYNC: "https://sdk.html5gameportal.com/api/tournament/#createasync",
    TOURNAMENT_SHARE_ASYNC: "https://sdk.html5gameportal.com/api/tournament/#shareasync",
    TOURNAMENT_JOIN_ASYNC: "https://sdk.html5gameportal.com/api/tournament/#joinasync",
};
