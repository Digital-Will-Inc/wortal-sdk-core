import { AdConfig } from "../classes/ads";
import { Player } from "../classes/player";
import { GameState, Session } from "../classes/session";
import { Platform } from "../types/session";

/** @hidden */
export default class SDKConfig {
    private readonly _game: GameState;
    private readonly _session: Session;

    // We construct these in initialize/lateInitialize because they sometimes depend on a platform SDK to be initialized already
    // so that we can use the platform's API.
    private _adConfig!: AdConfig;
    private _player!: Player;

    private _isIAPEnabled: boolean = false;
    private _isDebugMode: boolean = false;
    private _isInitialized: boolean = false;
    private _isPlatformInitialized: boolean = false;
    private _isAutoInit: boolean = true;

    private _platformSDK: any;

    constructor() {
        this._game = new GameState();
        this._session = new Session();
    }

    initialize() {
        // This depends on session.platform being set.
        this._adConfig = new AdConfig();
    }

    async lateInitialize(): Promise<void> {
        // This may depend on the platform SDK being initialized to fetch the player's data.
        this._player = new Player();
        await this._player.initialize();
        // This may depend on the platform SDK or Wortal API to fetch the ad config.
        await this._adConfig.lateInitialize();
        // It should now be safe to mark the SDK as initialized and allow the game to use it.
        this._isInitialized = true;
    }

    get adConfig(): AdConfig {
        return this._adConfig;
    }

    get game(): GameState {
        return this._game;
    }

    get player(): Player {
        return this._player;
    }

    get session(): Session {
        return this._session;
    }

    get isIAPEnabled(): boolean {
        return this._isIAPEnabled;
    }

    enableIAP(): void {
        this._isIAPEnabled = true;
    }

    get platformSDK(): any {
        return this._platformSDK;
    }

    set platformSDK(sdk: any) {
        this._platformSDK = sdk;
    }

    get isInitialized(): boolean {
        return this._isInitialized;
    }

    get isPlatformInitialized(): boolean {
        return this._isPlatformInitialized;
    }

    set isPlatformInitialized(value: boolean) {
        this._isPlatformInitialized = value;
    }

    get isAutoInit(): boolean {
        return this._isAutoInit;
    }

    set isAutoInit(value: boolean) {
        this._isAutoInit = value;
    }

    get isDebugMode(): boolean {
        return this._isDebugMode;
    }

    // This needs to be updated every time a new API is added to the SDK or a platform adds support for an existing API.
    // Failure to do so can result in a game not using the feature when it's available as the developer may not
    // make the API call if they don't think it's supported. This is more error-prone than we'd like, but many
    // devs are used to this function from FB Instant Games SDK, so we want to keep it consistent.
    _supportedAPIs: Record<Platform, string[]> = {
        wortal: [
            WORTAL_API.INITIALIZE_ASYNC,
            WORTAL_API.START_GAME_ASYNC,
            WORTAL_API.SET_LOADING_PROGRESS,
            WORTAL_API.ADS_IS_AD_BLOCKED,
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            WORTAL_API.ADS_SHOW_REWARDED,
            WORTAL_API.IAP_IS_ENABLED,
            WORTAL_API.PLAYER_GET_ID,
            WORTAL_API.PLAYER_GET_NAME,
            WORTAL_API.PLAYER_GET_PHOTO,
            WORTAL_API.PLAYER_IS_FIRST_PLAY,
            WORTAL_API.SESSION_GET_LOCALE,
            WORTAL_API.SESSION_GET_PLATFORM,
            WORTAL_API.SESSION_GET_DEVICE,
            WORTAL_API.SESSION_GET_ORIENTATION,
            WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
            WORTAL_API.SESSION_GAME_LOADING_START,
            WORTAL_API.SESSION_GAME_LOADING_STOP,
        ],
        link: [
            WORTAL_API.INITIALIZE_ASYNC,
            WORTAL_API.START_GAME_ASYNC,
            WORTAL_API.SET_LOADING_PROGRESS,
            WORTAL_API.ON_PAUSE,
            WORTAL_API.ADS_IS_AD_BLOCKED,
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            WORTAL_API.ADS_SHOW_REWARDED,
            WORTAL_API.CONTEXT_CHOOSE_ASYNC,
            WORTAL_API.CONTEXT_CREATE_ASYNC,
            WORTAL_API.CONTEXT_GET_ID,
            WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC,
            WORTAL_API.CONTEXT_GET_TYPE,
            WORTAL_API.CONTEXT_INVITE_ASYNC,
            WORTAL_API.CONTEXT_IS_SIZE_BETWEEN,
            WORTAL_API.CONTEXT_SHARE_ASYNC,
            WORTAL_API.CONTEXT_SWITCH_ASYNC,
            WORTAL_API.CONTEXT_UPDATE_ASYNC,
            WORTAL_API.IAP_IS_ENABLED,
            WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC,
            WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
            WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC,
            WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC,
            WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC,
            WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC,
            WORTAL_API.PLAYER_GET_ID,
            WORTAL_API.PLAYER_GET_NAME,
            WORTAL_API.PLAYER_GET_PHOTO,
            WORTAL_API.PLAYER_IS_FIRST_PLAY,
            WORTAL_API.PLAYER_GET_DATA_ASYNC,
            WORTAL_API.PLAYER_SET_DATA_ASYNC,
            WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC,
            WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC,
            WORTAL_API.PLAYER_FLUSH_DATA_ASYNC,
            WORTAL_API.SESSION_GET_LOCALE,
            WORTAL_API.SESSION_GET_PLATFORM,
            WORTAL_API.SESSION_GET_TRAFFIC_SOURCE,
            WORTAL_API.SESSION_GET_DEVICE,
            WORTAL_API.SESSION_GET_ORIENTATION,
            WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
            WORTAL_API.SESSION_GET_ENTRY_POINT_DATA,
            WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC,
            WORTAL_API.SESSION_GAME_LOADING_START,
            WORTAL_API.SESSION_GAME_LOADING_STOP,
        ],
        viber: [
            WORTAL_API.INITIALIZE_ASYNC,
            WORTAL_API.START_GAME_ASYNC,
            WORTAL_API.SET_LOADING_PROGRESS,
            WORTAL_API.ON_PAUSE,
            WORTAL_API.ADS_IS_AD_BLOCKED,
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            WORTAL_API.ADS_SHOW_REWARDED,
            WORTAL_API.CONTEXT_CHOOSE_ASYNC,
            WORTAL_API.CONTEXT_CREATE_ASYNC,
            WORTAL_API.CONTEXT_GET_ID,
            WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC,
            WORTAL_API.CONTEXT_GET_TYPE,
            WORTAL_API.CONTEXT_INVITE_ASYNC,
            WORTAL_API.CONTEXT_IS_SIZE_BETWEEN,
            WORTAL_API.CONTEXT_SHARE_ASYNC,
            WORTAL_API.CONTEXT_SWITCH_ASYNC,
            WORTAL_API.CONTEXT_UPDATE_ASYNC,
            WORTAL_API.IAP_IS_ENABLED,
            WORTAL_API.IAP_GET_CATALOG_ASYNC,
            WORTAL_API.IAP_GET_PURCHASES_ASYNC,
            WORTAL_API.IAP_MAKE_PURCHASE_ASYNC,
            WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC,
            WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC,
            WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
            WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC,
            WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC,
            WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC,
            WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC,
            WORTAL_API.PLAYER_GET_ID,
            WORTAL_API.PLAYER_GET_NAME,
            WORTAL_API.PLAYER_GET_PHOTO,
            WORTAL_API.PLAYER_IS_FIRST_PLAY,
            WORTAL_API.PLAYER_GET_DATA_ASYNC,
            WORTAL_API.PLAYER_SET_DATA_ASYNC,
            WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC,
            WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC,
            WORTAL_API.PLAYER_FLUSH_DATA_ASYNC,
            WORTAL_API.SESSION_GET_LOCALE,
            WORTAL_API.SESSION_GET_PLATFORM,
            WORTAL_API.SESSION_GET_TRAFFIC_SOURCE,
            WORTAL_API.SESSION_GET_DEVICE,
            WORTAL_API.SESSION_GET_ORIENTATION,
            WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
            WORTAL_API.SESSION_GET_ENTRY_POINT_DATA,
            WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC,
            WORTAL_API.SESSION_GAME_LOADING_START,
            WORTAL_API.SESSION_GAME_LOADING_STOP,
            WORTAL_API.SESSION_SET_SESSION_DATA,
        ],
        gd: [
            WORTAL_API.INITIALIZE_ASYNC,
            WORTAL_API.START_GAME_ASYNC,
            WORTAL_API.SET_LOADING_PROGRESS,
            WORTAL_API.ADS_IS_AD_BLOCKED,
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            WORTAL_API.ADS_SHOW_REWARDED,
            WORTAL_API.IAP_IS_ENABLED,
            WORTAL_API.PLAYER_GET_ID,
            WORTAL_API.PLAYER_GET_NAME,
            WORTAL_API.PLAYER_GET_PHOTO,
            WORTAL_API.PLAYER_IS_FIRST_PLAY,
            WORTAL_API.SESSION_GET_LOCALE,
            WORTAL_API.SESSION_GET_PLATFORM,
            WORTAL_API.SESSION_GET_DEVICE,
            WORTAL_API.SESSION_GET_ORIENTATION,
            WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
            WORTAL_API.SESSION_GAME_LOADING_START,
            WORTAL_API.SESSION_GAME_LOADING_STOP,
        ],
        facebook: [
            WORTAL_API.INITIALIZE_ASYNC,
            WORTAL_API.START_GAME_ASYNC,
            WORTAL_API.SET_LOADING_PROGRESS,
            WORTAL_API.ON_PAUSE,
            WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC,
            WORTAL_API.ADS_IS_AD_BLOCKED,
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            WORTAL_API.ADS_SHOW_REWARDED,
            WORTAL_API.CONTEXT_CHOOSE_ASYNC,
            WORTAL_API.CONTEXT_CREATE_ASYNC,
            WORTAL_API.CONTEXT_GET_ID,
            WORTAL_API.CONTEXT_GET_PLAYERS_ASYNC,
            WORTAL_API.CONTEXT_GET_TYPE,
            WORTAL_API.CONTEXT_INVITE_ASYNC,
            WORTAL_API.CONTEXT_IS_SIZE_BETWEEN,
            WORTAL_API.CONTEXT_SHARE_ASYNC,
            WORTAL_API.CONTEXT_SHARE_LINK_ASYNC,
            WORTAL_API.CONTEXT_SWITCH_ASYNC,
            WORTAL_API.CONTEXT_UPDATE_ASYNC,
            WORTAL_API.IAP_IS_ENABLED,
            WORTAL_API.IAP_GET_CATALOG_ASYNC,
            WORTAL_API.IAP_GET_PURCHASES_ASYNC,
            WORTAL_API.IAP_MAKE_PURCHASE_ASYNC,
            WORTAL_API.IAP_CONSUME_PURCHASE_ASYNC,
            WORTAL_API.LEADERBOARD_GET_LEADERBOARD_ASYNC,
            WORTAL_API.LEADERBOARD_SEND_ENTRY_ASYNC,
            WORTAL_API.LEADERBOARD_GET_ENTRIES_ASYNC,
            WORTAL_API.LEADERBOARD_GET_PLAYER_ENTRY_ASYNC,
            WORTAL_API.LEADERBOARD_GET_ENTRY_COUNT_ASYNC,
            WORTAL_API.LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC,
            WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC,
            WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC,
            WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC,
            WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC,
            WORTAL_API.PLAYER_GET_ID,
            WORTAL_API.PLAYER_GET_NAME,
            WORTAL_API.PLAYER_GET_PHOTO,
            WORTAL_API.PLAYER_IS_FIRST_PLAY,
            WORTAL_API.PLAYER_GET_DATA_ASYNC,
            WORTAL_API.PLAYER_SET_DATA_ASYNC,
            WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC,
            WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC,
            WORTAL_API.PLAYER_FLUSH_DATA_ASYNC,
            WORTAL_API.PLAYER_GET_ASID_ASYNC,
            WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC,
            WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC,
            WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC,
            WORTAL_API.SESSION_GET_LOCALE,
            WORTAL_API.SESSION_GET_PLATFORM,
            WORTAL_API.SESSION_GET_TRAFFIC_SOURCE,
            WORTAL_API.SESSION_GET_DEVICE,
            WORTAL_API.SESSION_GET_ORIENTATION,
            WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
            WORTAL_API.SESSION_GET_ENTRY_POINT_DATA,
            WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC,
            WORTAL_API.SESSION_GAME_LOADING_START,
            WORTAL_API.SESSION_GAME_LOADING_STOP,
            WORTAL_API.SESSION_SET_SESSION_DATA,
            WORTAL_API.SESSION_SWITCH_GAME_ASYNC,
            WORTAL_API.TOURNAMENT_GET_CURRENT_ASYNC,
            WORTAL_API.TOURNAMENT_GET_ALL_ASYNC,
            WORTAL_API.TOURNAMENT_POST_SCORE_ASYNC,
            WORTAL_API.TOURNAMENT_CREATE_ASYNC,
            WORTAL_API.TOURNAMENT_SHARE_ASYNC,
            WORTAL_API.TOURNAMENT_JOIN_ASYNC,
        ],
        crazygames: [
            WORTAL_API.INITIALIZE_ASYNC,
            WORTAL_API.START_GAME_ASYNC,
            WORTAL_API.AUTHENTICATE_ASYNC,
            WORTAL_API.LINK_ACCOUNT_ASYNC,
            WORTAL_API.SET_LOADING_PROGRESS,
            WORTAL_API.ADS_IS_AD_BLOCKED,
            WORTAL_API.ADS_SHOW_INTERSTITIAL,
            WORTAL_API.ADS_SHOW_REWARDED,
            WORTAL_API.CONTEXT_SHARE_LINK_ASYNC,
            WORTAL_API.IAP_IS_ENABLED,
            WORTAL_API.PLAYER_GET_ID,
            WORTAL_API.PLAYER_GET_NAME,
            WORTAL_API.PLAYER_GET_PHOTO,
            WORTAL_API.PLAYER_IS_FIRST_PLAY,
            WORTAL_API.PLAYER_GET_TOKEN_ASYNC,
            WORTAL_API.PLAYER_ON_LOGIN,
            WORTAL_API.SESSION_GET_LOCALE,
            WORTAL_API.SESSION_GET_PLATFORM,
            WORTAL_API.SESSION_GET_DEVICE,
            WORTAL_API.SESSION_GET_ORIENTATION,
            WORTAL_API.SESSION_ON_ORIENTATION_CHANGE,
            WORTAL_API.SESSION_GAME_LOADING_START,
            WORTAL_API.SESSION_GAME_LOADING_STOP,
            WORTAL_API.SESSION_HAPPY_TIME,
            WORTAL_API.SESSION_GAMEPLAY_START,
            WORTAL_API.SESSION_GAMEPLAY_STOP,
        ],
        debug: [],
    };
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
    ADS_IS_AD_BLOCKED: "ads.isAdBlocked",
    ADS_SHOW_INTERSTITIAL: "ads.showInterstitial",
    ADS_SHOW_REWARDED: "ads.showRewarded",
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
    TOURNAMENT_GET_CURRENT_ASYNC: "tournament.getCurrentAsync",
    TOURNAMENT_GET_ALL_ASYNC: "tournament.getAllAsync",
    TOURNAMENT_POST_SCORE_ASYNC: "tournament.postScoreAsync",
    TOURNAMENT_CREATE_ASYNC: "tournament.createAsync",
    TOURNAMENT_SHARE_ASYNC: "tournament.shareAsync",
    TOURNAMENT_JOIN_ASYNC: "tournament.joinAsync",
};

export const API_URL = {
    GET_SUPPORTED_APIS: "https://sdk.html5gameportal.com/api/wortal/#getsupportedapis",
    INITIALIZE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#initializeasync",
    START_GAME_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#startgameasync",
    AUTHENTICATE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#authenticateasync",
    LINK_ACCOUNT_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#linkaccountasync",
    SET_LOADING_PROGRESS: "https://sdk.html5gameportal.com/api/wortal/#setloadingprogress",
    ON_PAUSE: "https://sdk.html5gameportal.com/api/wortal/#onpause",
    PERFORM_HAPTIC_FEEDBACK_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#performhapticfeedbackasync",
    ADS_SHOW_INTERSTITIAL: "https://sdk.html5gameportal.com/api/wortal/#adsshowinterstitial",
    ADS_SHOW_REWARDED: "https://sdk.html5gameportal.com/api/wortal/#adsshowrewarded",
    ANALYTICS_LOG_LEVEL_START: "https://sdk.html5gameportal.com/api/wortal/#analyticsloglevelstart",
    ANALYTICS_LOG_LEVEL_END: "https://sdk.html5gameportal.com/api/wortal/#analyticsloglevelend",
    ANALYTICS_LOG_LEVEL_UP: "https://sdk.html5gameportal.com/api/wortal/#analyticsloglevelup",
    ANALYTICS_LOG_SCORE: "https://sdk.html5gameportal.com/api/wortal/#analyticslogscore",
    ANALYTICS_LOG_GAME_CHOICE: "https://sdk.html5gameportal.com/api/wortal/#analyticsloggamechoice",
    ANALYTICS_LOG_SOCIAL_INVITE: "https://sdk.html5gameportal.com/api/wortal/#analyticslogsocialinvite",
    ANALYTICS_LOG_SOCIAL_SHARE: "https://sdk.html5gameportal.com/api/wortal/#analyticslogsocialshare",
    ANALYTICS_LOG_PURCHASE: "https://sdk.html5gameportal.com/api/wortal/#analyticslogpurchase",
    ANALYTICS_LOG_PURCHASE_SUBSCRIPTION: "https://sdk.html5gameportal.com/api/wortal/#analyticslogpurchasesubscription",
    CONTEXT_GET_PLAYERS_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#contextgetplayersasync",
    CONTEXT_INVITE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#contextinviteasync",
    CONTEXT_SHARE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#contextshareasync",
    CONTEXT_SHARE_LINK_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#contextsharelinkasync",
    CONTEXT_UPDATE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#contextupdateasync",
    CONTEXT_CHOOSE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#contextchooseasync",
    CONTEXT_SWITCH_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#contextswitchasync",
    CONTEXT_CREATE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#contextcreateasync",
    IAP_GET_CATALOG_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#iapgetcatalogasync",
    IAP_GET_PURCHASES_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#iapgetpurchasesasync",
    IAP_MAKE_PURCHASE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#iapmakepurchaseasync",
    IAP_CONSUME_PURCHASE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#iapconsumepurchaseasync",
    LEADERBOARD_GET_LEADERBOARD_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#leaderboardgetleaderboardasync",
    LEADERBOARD_SEND_ENTRY_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#leaderboardsendentryasync",
    LEADERBOARD_GET_ENTRIES_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#leaderboardgetentriesasync",
    LEADERBOARD_GET_PLAYER_ENTRY_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#leaderboardgetplayerentryasync",
    LEADERBOARD_GET_ENTRY_COUNT_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#leaderboardgetentrycountasync",
    LEADERBOARD_GET_CONNECTED_PLAYER_ENTRIES_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#leaderboardgetconnectedplayerentriesasync",
    NOTIFICATIONS_SCHEDULE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#notificationsscheduleasync",
    NOTIFICATIONS_GET_HISTORY_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#notificationsgethistoryasync",
    NOTIFICATIONS_CANCEL_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#notificationscancelasync",
    NOTIFICATIONS_CANCEL_ALL_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#notificationscancelallasync",
    PLAYER_GET_DATA_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playergetdataasync",
    PLAYER_SET_DATA_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playersetdataasync",
    PLAYER_FLUSH_DATA_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playerflushdataasync",
    PLAYER_GET_CONNECTED_PLAYERS_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playergetconnectedplayersasync",
    PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playergetsignedplayerinfoasync",
    PLAYER_GET_ASID_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playergetasidasync",
    PLAYER_GET_SIGNED_ASID_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playergetsignedasidasync",
    PLAYER_CAN_SUBSCRIBE_BOT_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playercansubscribebotasync",
    PLAYER_SUBSCRIBE_BOT_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playersubscribebotasync",
    PLAYER_GET_TOKEN_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#playergettokenasync",
    PLAYER_ON_LOGIN: "https://sdk.html5gameportal.com/api/wortal/#playeronlogin",
    SESSION_GET_ENTRY_POINT_DATA: "https://sdk.html5gameportal.com/api/wortal/#sessiongetentrypointdata",
    SESSION_GET_ENTRY_POINT_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#sessiongetentrypointasync",
    SESSION_ON_ORIENTATION_CHANGE: "https://sdk.html5gameportal.com/api/wortal/#sessiononorientationchange",
    SESSION_SWITCH_GAME_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#sessionswitchgameasync",
    TOURNAMENT_GET_CURRENT_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#tournamentgetcurrentasync",
    TOURNAMENT_GET_ALL_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#tournamentgetallasync",
    TOURNAMENT_POST_SCORE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#tournamentpostscoreasync",
    TOURNAMENT_CREATE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#tournamentcreateasync",
    TOURNAMENT_SHARE_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#tournamentshareasync",
    TOURNAMENT_JOIN_ASYNC: "https://sdk.html5gameportal.com/api/wortal/#tournamentjoinasync",
}
