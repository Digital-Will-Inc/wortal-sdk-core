import { AdConfig } from "../classes/ads";
import { Player } from "../classes/player";
import { GameState, Session } from "../classes/session";
import { InitializationOptions } from "../interfaces/session";
import { Platform } from "../types/session";

/** @hidden */
export default class SDKConfig {
    private readonly _game: GameState;
    private readonly _session: Session;

    // We construct these in lateInitialize because they sometimes depend on a platform SDK to be initialized already
    // so that we can use the platform's API.
    private _adConfig!: AdConfig;
    private _player!: Player;

    private _isIAPEnabled: boolean = false;
    private _isDebugMode: boolean = false;
    private _isInitialized: boolean = false;

    private _platformSDK: any;

    constructor(options?: InitializationOptions) {
        if (typeof options !== "undefined") {
            if (typeof options.debugMode !== "undefined") {
                this._isDebugMode = options.debugMode;
            }
        }
        this._session = new Session();
        this._game = new GameState();
    }

    lateInitialize(): void {
        this._player = new Player().initialize();
        this._adConfig = new AdConfig();
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

    get isDebugMode(): boolean {
        return this._isDebugMode;
    }

    // This needs to be updated every time a new API is added to the SDK or a platform adds support for an existing API.
    // Failure to do so can result in a game not using the feature when it's available as the developer may not
    // make the API call if they don't think it's supported.
    _supportedAPIs: Record<Platform, string[]> = {
        wortal: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "session.getLocale",
            "session.getPlatform",
            "session.getDevice",
        ],
        link: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "context.chooseAsync",
            "context.createAsync",
            "context.getId",
            "context.getPlayersAsync",
            "context.getType",
            "context.isSizeBetween",
            "context.shareAsync",
            "context.switchAsync",
            "context.updateAsync",
            "leaderboard.getLeaderboardAsync",
            "leaderboard.sendEntryAsync",
            "leaderboard.getEntriesAsync",
            "leaderboard.getPlayerEntryAsync",
            "leaderboard.getEntryCountAsync",
            "leaderboard.getConnectedPlayerEntriesAsync",
            "player.getID",
            "player.getName",
            "player.getPhoto",
            "player.isFirstPlay",
            "player.getDataAsync",
            "player.setDataAsync",
            "player.getConnectedPlayersAsync",
            "player.getSignedPlayerInfoAsync",
            "player.flushDataAsync",
            "session.getEntryPointData",
            "session.getEntryPointAsync",
            "session.getLocale",
            "session.getPlatform",
            "session.getTrafficSource",
            "session.getDevice",
        ],
        viber: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "context.chooseAsync",
            "context.createAsync",
            "context.getId",
            "context.getPlayersAsync",
            "context.getType",
            "context.isSizeBetween",
            "context.shareAsync",
            "context.switchAsync",
            "context.updateAsync",
            "iap.getCatalogAsync",
            "iap.getPurchasesAsync",
            "iap.makePurchaseAsync",
            "iap.consumePurchaseAsync",
            "leaderboard.getLeaderboardAsync",
            "leaderboard.sendEntryAsync",
            "leaderboard.getEntriesAsync",
            "leaderboard.getPlayerEntryAsync",
            "leaderboard.getEntryCountAsync",
            "leaderboard.getConnectedPlayerEntriesAsync",
            "player.getID",
            "player.getName",
            "player.getPhoto",
            "player.isFirstPlay",
            "player.getDataAsync",
            "player.setDataAsync",
            "player.getConnectedPlayersAsync",
            "player.getSignedPlayerInfoAsync",
            "player.flushDataAsync",
            "session.getEntryPointData",
            "session.getEntryPointAsync",
            "session.getLocale",
            "session.getPlatform",
            "session.getTrafficSource",
            "session.setSessionData",
            "session.getDevice",
        ],
        gd: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "session.getLocale",
            "session.getPlatform",
            "session.getDevice",
        ],
        facebook: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "context.chooseAsync",
            "context.createAsync",
            "context.getId",
            "context.getPlayersAsync",
            "context.getType",
            "context.isSizeBetween",
            "context.shareAsync",
            "context.shareLinkAsync",
            "context.switchAsync",
            "context.updateAsync",
            "iap.getCatalogAsync",
            "iap.getPurchasesAsync",
            "iap.makePurchaseAsync",
            "iap.consumePurchaseAsync",
            "leaderboard.getLeaderboardAsync",
            "leaderboard.sendEntryAsync",
            "leaderboard.getEntriesAsync",
            "leaderboard.getPlayerEntryAsync",
            "leaderboard.getEntryCountAsync",
            "leaderboard.getConnectedPlayerEntriesAsync",
            "notifications.scheduleAsync",
            "notifications.cancelAsync",
            "notifications.cancelAllAsync",
            "notifications.getHistoryAsync",
            "player.getID",
            "player.getName",
            "player.getPhoto",
            "player.getDataAsync",
            "player.setDataAsync",
            "player.getConnectedPlayersAsync",
            "player.getSignedPlayerInfoAsync",
            "player.flushDataAsync",
            "session.getEntryPointData",
            "session.getEntryPointAsync",
            "session.getLocale",
            "session.getPlatform",
            "session.setSessionData",
            "session.getDevice",
            "tournament.getCurrentAsync",
            "tournament.getAllAsync",
            "tournament.postScoreAsync",
            "tournament.createAsync",
            "tournament.shareAsync",
            "tournament.joinAsync",
        ],
        debug: [],
    };
}
