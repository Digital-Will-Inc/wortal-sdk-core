import { AchievementsAPI } from "../achievements/achievements-api";
import { AdConfig } from "../ads/classes/ad-config";
import { AdConfigFacebook } from "../ads/classes/ad-config-facebook";
import { AdConfigLink } from "../ads/classes/ad-config-link";
import { AdConfigViber } from "../ads/classes/ad-config-viber";
import { AuthPayload } from "../auth/interfaces/auth-payload";
import { AuthResponse } from "../auth/interfaces/auth-response";
import { ContextWortal } from "../context/impl/context-wortal";
import { LOCAL_CHUNKS_ONLY, SDK_SRC } from "../data/core-data";
import { CrazyGamesPlayer } from "../player/classes/crazygames-player";
import { FacebookPlayer } from "../player/classes/facebook-player";
import { LinkPlayer } from "../player/classes/link-player";
import { Player } from "../player/classes/player";
import { ViberPlayer } from "../player/classes/viber-player";
import { YandexPlayer } from "../player/classes/yandex-player";
import { GameState } from "../session/classes/game-state";
import { Session } from "../session/classes/session";
import { Platform } from "../session/types/session-types";
import { initializationError } from "../errors/error-handler";
import { StatsAPI } from "../stats/stats-api";
import { WortalLogger } from "../utils/logger";
import {
    addGameEndEventListener,
    addLoadingListener,
    addPauseListener,
    delayUntilConditionMet
} from "../utils/wortal-utils";
import { AdsAPI } from "../ads/ads-api";
import { AnalyticsAPI } from "../analytics/analytics-api";
import { ContextAPI } from "../context/context-api";
import { InAppPurchaseAPI } from "../iap/iap-api";
import { LeaderboardAPI } from "../leaderboard/leaderboard-api";
import { NotificationsAPI } from "../notifications/notifications-api";
import { PlayerAPI } from "../player/player-api";
import { SessionAPI } from "../session/session-api";
import { TournamentAPI } from "../tournament/tournament-api";
import { CoreBase } from "./core-base";
import { AddictingGamesSDK } from "./interfaces/addictinggames-sdk";
import { CrazyGamesSDK } from "./interfaces/crazygames-sdk";
import { FacebookSDK } from "./interfaces/facebook-sdk";
import { GameMonetizeSDK } from "./interfaces/gamemonetize-sdk";
import { GamePixSDK } from "./interfaces/gamepix-sdk";
import { GDSDK } from "./interfaces/gd-sdk";
import { InitializationOptions } from "./interfaces/initialization-options";
import { LinkSDK } from "./interfaces/link-sdk";
import { PokiSDK } from "./interfaces/poki-sdk";
import { ViberSDK } from "./interfaces/viber-sdk";
import { YandexSDK } from "./interfaces/yandex-sdk";

/**
 * Core module for the SDK. This is the main entry point for the SDK. It is responsible for initializing the SDK
 * and loading the platform specific SDK. It also provides access to the other modules in the SDK. This should not
 * be access directly. Instead, use the global Wortal object.
 * @module Core
 */
export class CoreAPI {
//#region Private/Internal Members

    private _core!: CoreBase;

    private _isInitialized: boolean = false;
    private _isAutoInit: boolean = true;
    private _isPlatformInitialized: boolean = false;
    private _isWavesEnabled: boolean = false;

    private _platformSDK: AddictingGamesSDK | CrazyGamesSDK | FacebookSDK | GameMonetizeSDK | GamePixSDK | GDSDK |
        LinkSDK | PokiSDK | ViberSDK | YandexSDK | any;

    private _platform: Platform = "debug";

    /**
     * Holds a reference to the external SDK for the current platform. This is set in _initializePlatformAsync.
     * Some platforms, such as Telegram, do not require including an SDK so this will remain an empty object.
     *
     * See the platform specific SDK interface in core/interfaces for details on what APIs are available.
     *
     * **Do not attempt to access this before _initializePlatformAsync has finished and _internalIsPlatformInitialized is
     * true, as it will not be set.**
     * @internal
     */
    get _internalPlatformSDK(): AddictingGamesSDK | CrazyGamesSDK | FacebookSDK | GameMonetizeSDK | GamePixSDK | GDSDK |
        LinkSDK | PokiSDK | ViberSDK | YandexSDK | any {
        return this._platformSDK;
    }

    /**
     * Sets the external SDK for the current platform. This should only ever be called in _initializePlatformAsync
     * after loading the platform specific SDK.
     * @internal
     */
    set _internalPlatformSDK(value: AddictingGamesSDK | CrazyGamesSDK | FacebookSDK | GameMonetizeSDK | GamePixSDK |
        GDSDK | LinkSDK | PokiSDK | ViberSDK | YandexSDK | any) {
        this._platformSDK = value;
    }

    /**
     * Returns the current platform. This is set in _loadCoreAsync and should be used by the SDK to determine
     * which platform specific APIs to use.
     * @internal
     */
    get _internalPlatform(): Platform {
        return this._platform;
    }

    /**
     * Returns whether the platform has been initialized. This is set in _initializePlatformAsync and should be used
     * to determine whether the platform specific APIs are ready to use.
     *
     * **Do not attempt to access _internalPlatformSDK before this is true, as it will not be set.**
     * @internal
     */
    get _internalIsPlatformInitialized(): boolean {
        return this._isPlatformInitialized;
    }

    /**
     * Flag set to determine whether the SDK should initialize automatically or wait for the developer to call initializeAsync.
     * This determines the initialization path in _loadCoreAsync, and is set by the developer in the initialization options.
     * @internal
     */
    get _internalIsAutoInit(): boolean {
        return this._isAutoInit;
    }

    /**
     * Flag set to determine whether the Waves Client SDK is initialized
     * This determines if the waves game save feature is enabled.
     * @internal
     */
    get _internalIsWavesEnabled(): boolean {
        return this._isWavesEnabled;
    }

    /**
     * Logger for the SDK. This is used to log messages to the console. Use this instead of console logging directly.
     * @internal
     */
    _log: WortalLogger = new WortalLogger();

//#endregion
//#region Public API

    // We assign these in _loadAPIsAsync because we need to dynamically import the platform specific modules.
    // Every platform should always have an implementation of every module, even if it doesn't support that module's functionality.

    /** Achievements module */
    public achievements!: AchievementsAPI;
    /** Ads module */
    public ads!: AdsAPI;
    /** Analytics module */
    public analytics!: AnalyticsAPI;
    /** Context module */
    public context!: ContextAPI;
    /** In-app purchase module */
    public iap!: InAppPurchaseAPI;
    /** Leaderboard module */
    public leaderboard!: LeaderboardAPI;
    /** Notifications module */
    public notifications!: NotificationsAPI;
    /** Player module */
    public player!: PlayerAPI;
    /** Session module */
    public session!: SessionAPI;
    /** Stats module */
    public stats!: StatsAPI;
    /** Tournament module */
    public tournament!: TournamentAPI;

    /**
     * Returns true if the SDK has been initialized.
     *
     * **No APIs should be called before the SDK has been initialized.**
     */
    public isInitialized: boolean = false;

    /**
     * Initializes the SDK. This should be called before any other SDK functions. It is recommended to call this
     * as soon as the script has been loaded to shorten the initialization time.
     *
     * NOTE: This is only available if the manual initialization option is set to true. Otherwise, the SDK will initialize automatically.
     * @example
     * Wortal.initializeAsync().then(() => {
     *    // SDK is ready to use, wait for game to finish loading.
     *    Wortal.setLoadingProgress(100);
     *    Wortal.startGameAsync();
     * });
     * @returns {Promise<void>} Promise that resolves when the SDK initialized successfully.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>INITIALIZATION_ERROR</li>
     * <li>NOT_SUPPORTED</li>
     * </ul>
     */
    public async initializeAsync(): Promise<void> {
        // The developer may call this as soon as the page loads, but it will not be available until the core
        if (typeof this._core === "undefined") {
            await delayUntilConditionMet(() => {
                return typeof this._core !== "undefined";
            }, "Core module not loaded. Waiting for it to load before calling initializeAsync...");
        }

        return this._core.initializeAsync();
    }

    /**
     * This indicates that the game has finished initial loading and is ready to start. Context information will be
     * up-to-date when the returned promise resolves. The loading screen will be removed after this is called along with
     * the following conditions:
     * <ul>
     * <li>initializeAsync has been called and resolved</li>
     * <li>setLoadingProgress has been called with a value of 100</li>
     * </ul>
     *
     * NOTE: This is only available if the manual initialization option is set to true. Otherwise, the game will start automatically.
     * @example
     * Wortal.startGameAsync().then(() => {
     *    // Game is rendered to player.
     * });
     * @returns {Promise<void>} Promise that resolves when the game has started successfully.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>INITIALIZATION_ERROR</li>
     * <li>NOT_SUPPORTED</li>
     * </ul>
     */
    public async startGameAsync(): Promise<void> {
        return this._core.startGameAsync();
    }

    /**
     * Starts the authentication process for the player. If the current platform has its own authentication prompt then
     * this will be displayed.
     * @example
     * Wortal.authenticateAsync()
     * .then(response => console.log(response));
     * @param {AuthPayload} payload Optional payload for the authentication process.
     * @returns {Promise<AuthResponse>} Promise that resolves with the response from the authentication process.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>AUTH_IN_PROGRESS</li>
     * <li>USER_ALREADY_AUTHENTICATED</li>
     * <li>USER_INPUT</li>
     * <li>NOT_SUPPORTED</li>
     * </ul>
     */
    public authenticateAsync(payload?: AuthPayload): Promise<AuthResponse> {
        return this._core.authenticateAsync(payload);
    }

    /**
     * Starts the account linking process for the player. If the current platform has its own account linking prompt then
     * this will be displayed.
     * @example
     * Wortal.linkAccountAsync()
     * .then(isLinked => console.log("Player linked account: " + isLinked));
     * @returns {Promise<boolean>} Promise that resolves when the player has finished the account linking process. The
     * promise will resolve with true if the player linked their account and false if they did not.
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>LINK_IN_PROGRESS</li>
     * <li>USER_NOT_AUTHENTICATED</li>
     * <li>NOT_SUPPORTED</li>
     * </ul>
     */
    public linkAccountAsync(): Promise<boolean> {
        return this._core.linkAccountAsync();
    }

    /**
     * Sets the loading progress value for the game. This is required for the game to start. Failure to call this with 100
     * once the game is fully loaded will prevent the game from starting.
     * @example
     * onGameLoadProgress(percent) {
     *     Wortal.setLoadingProgress(percent);
     * }
     *
     * onGameLoaded() {
     *     Wortal.setLoadingProgress(100);
     * }
     * @param value Percentage of loading complete. Range is 0 to 100.
     */
    public setLoadingProgress(value: number): void {
        this._core.setLoadingProgress(value);
    }

    /**
     * Sets a callback which will be invoked when the app is brought to the background.
     * @param callback Callback to invoke.
     */
    public onPause(callback: () => void): void {
        this._core.onPause(callback);
    }

    /**
     * Requests and performs haptic feedback on supported devices.
     * @returns {Promise<void>} Haptic feedback requested successfully
     * @throws {ErrorMessage} See error.message for details.
     * <ul>
     * <li>NOT_SUPPORTED</li>
     * <li>CLIENT_UNSUPPORTED_OPERATION</li>
     * <li>INVALID_OPERATION</li>
     * </ul>
     */
    public performHapticFeedbackAsync(): Promise<void> {
        return this._core.performHapticFeedbackAsync();
    }

    /**
     * Gets the supported APIs for the current platform. Debug platform will return an empty array but supports all APIs.
     * @example
     * const supportedAPIs = Wortal.getSupportedAPIs();
     * if (supportedAPIs.includes("context.shareAsync")) {
     *    shareWithFriendsDialog.show();
     * }
     * @returns {string[]} Array of supported APIs.
     */
    public getSupportedAPIs(): string[] {
        return this._core.getSupportedAPIs();
    }

//#endregion
//#region Internal API

    /**
     * Initializes the core module. This should be called as soon as the platform is known. This will import
     * and initialize the SDK for the given platform. Nothing should be done before this returns as the SDK
     * may need to perform some initialization before it can be used.
     * @param {InitializationOptions} options Initialization options. This can include options for debugging and testing
     * or to override the SDK initialization process and allow for manual initialization when the game is ready.
     * @returns Promise that resolves when the core module has been initialized.
     * @internal
     * @hidden
     */
    async _loadCoreAsync(options: InitializationOptions): Promise<void> {
        this._log.internalCall("_loadCoreAsync");
        if (this._isInitialized) {
            return Promise.reject(initializationError("SDK already initialized.", "_loadCoreAsync"));
        }

        // Parse the initialization options first.
        this._log.info("Initializing SDK " + __VERSION__);
        this._platform = options.platform;
        if (!options.autoInitialize) {
            this._isAutoInit = false;
        }
        this._log.debug("Platform: " + this._platform);

        // We might end the initialization process in several different places, we just listen for this event to know
        // when the SDK is finished initializing.
        const sdkStartTime: number = performance.now();
        window.addEventListener("wortal-sdk-initialized", () => {
            const sdkEndTime: number = performance.now();
            const sdkExecutionTime: number = sdkEndTime - sdkStartTime;
            this._log.performanceLog(`Wortal SDK initialized in ${sdkExecutionTime}ms.`);
        });

        // First we load the chunks we need for this platform. This includes wortal-common and the platform specific chunk.
        try {
            this._log.status("Loading chunks...");
            const startTime: number = performance.now();

            // Debug mode requires the chunks to be included in the bundle.
            if (!options.debugMode) {
                await this._loadChunksAsync(this._platform);
            }

            const endTime: number = performance.now();
            const executionTime: number = endTime - startTime;

            this._log.performanceLog(`Chunks loaded in ${executionTime}ms.`);
        } catch (error: any) {
            return Promise.reject(initializationError(`Failed to initialize SDK during loadChunksAsync: ${error.message}`, "_loadCoreAsync"));
        }

        // Next we dynamically import the API implementations for the current platform.
        try {
            this._log.status("Loading APIs...");
            const startTime: number = performance.now();

            await this._loadAPIsAsync(this._platform);

            const endTime: number = performance.now();
            const executionTime: number = endTime - startTime;

            this._log.performanceLog(`APIs loaded in ${executionTime}ms.`);
        } catch (error: any) {
            return Promise.reject(initializationError(`Failed to initialize SDK during loadAPIsAsync: ${error.message}`, "_loadCoreAsync"));
        }

        // Set listeners and analytics.
        this.session._gameLoadingStart(); // Track the game loading time.
        addLoadingListener(); // This is to add the loading cover when the page loads, in case the body isn't loaded yet.
        addGameEndEventListener(); // Track the game end event to send analytics. This is not reliable as it relies on the game losing focus.
        addPauseListener(); // Track the game losing focus to trigger the onPause callback.

        // Now we can initialize the platform. This will initialize the platform's SDK any do any other initialization
        // required on the current platform.
        try {
            this._log.status("Initializing platform...");
            const startTime: number = performance.now();

            await this._core._initializePlatformAsync();

            const endTime: number = performance.now();
            const executionTime: number = endTime - startTime;

            this._log.performanceLog(`Platform initialized in ${executionTime}ms.`);
        } catch (error: any) {
            return Promise.reject(initializationError(`Failed to initialize SDK during initializePlatformAsync: ${error.message}`, "_loadCoreAsync"));
        }

        // If the developer calls initializeAsync earlier than this, we need to wait for the platform to be initialized.
        // This flag will make initializeAsync await the platform initialization before continuing.
        this._isPlatformInitialized = true;

        // We've finished the internal initialization that's still necessary in manual initialization mode, so we can
        // resolve here and wait for the developer to finish the initialization process.
        if (!this._isAutoInit) {
            this._log.debug("Manual initialization requested. Platform initialization finished, awaiting manual initialization..");
            return Promise.resolve();
        }

        // Finally we can finish the SDK initialization. This may depend on the platform being initialized first to
        // access a platform specific API.
        try {
            await this._core._initializeSDKAsync();
        } catch (error: any) {
            return Promise.reject(initializationError(`Failed to initialize SDK during initializeSDKAsync: ${error.message}`, "_loadCoreAsync"));
        }

        // Now we can finish the initialization process and let the developer know the SDK is ready to use.
        this.session._gameLoadingStop();
        this.analytics._logGameStart();

        this.isInitialized = true;
        window.dispatchEvent(new Event("wortal-sdk-initialized"));

        this._log.info("SDK initialization complete.");
    }

    async _loadChunksAsync(platform: Platform): Promise<void> {
        this._log.internalCall("_loadChunksAsync");

        // Some platforms impose CSP restrictions that prevent us from loading chunks from a CDN. In these cases
        // we need to load the chunks locally.
        for (const localOnlyPlatform of LOCAL_CHUNKS_ONLY) {
            if (platform === localOnlyPlatform) {
                this._log.debug("Loading chunks locally for platform: " + platform);
                return Promise.resolve();
            }
        }

        const baseURL: string = "https://storage.googleapis.com/html5gameportal.com/wortal-sdk/v1/";
        const chunks: string[] = [];
        const promises: Promise<void>[] = [];

        // wortal-common and analytics are always required.
        chunks.push("wortal-common.js");
        chunks.push("analytics.js");
        chunks.push(`${platform}.js`);

        for (const chunk of chunks) {
            promises.push(new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = baseURL + chunk;

                script.onload = () => {
                    resolve();
                };

                script.onerror = () => {
                    reject(initializationError(`Failed to load chunk: ${chunk}`, "_loadChunksAsync"));
                };

                document.head.appendChild(script);
            }));
        }

        return Promise.all(promises).then(() => {
            return;
        });
    }

    protected _loadWavesClientDeps(platform: Platform): void {
        this._log.internalCall("_loadWavesClientDeps");

        // Not all platforms will allows us to use Waves, we need to check each platform's TOS to ensure
        // we're playing by the rules.
        //TODO: determine platform support for Waves

        const wavesSDK = document.createElement("script");
        wavesSDK.src = `${SDK_SRC.WAVES_BASE_URL}/waves.umd.js`;

        wavesSDK.onload = () => {
            this._log.debug("Waves SDK loaded.");
            this._isWavesEnabled = true;
        }

        wavesSDK.onerror = () => {
            // Not fatal, but we should log it and disable Waves.
            this._log.exception("Failed to load Waves SDK.");
            this._isWavesEnabled = false;
        }

        document.head.prepend(wavesSDK);
    }

    // This is a big ugly mess. We should probably refactor this to be more elegant and less repetitive, but
    // we don't want to break the dynamic import and chunking, so we'll leave it for now until we have a
    // better idea of how to do it.
    //TODO: find a better way to do this without breaking the dynamic import and chunking
    async _loadAPIsAsync(platform: Platform): Promise<void> {
        this._log.internalCall("_loadAPIsAsync");

        const {AnalyticsWombat} = await import(/* webpackChunkName: "analytics" */ "../analytics/impl/analytics-wombat");
        const {AnalyticsDisabled} = await import(/* webpackChunkName: "analytics" */ "../analytics/impl/analytics-disabled");

        this._log.status("Loading Waves SDK...");
        this._loadWavesClientDeps(platform);

        switch (platform) {
            case "addictinggames": {
                const {CoreAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "./impl/core-addictinggames");
                const {AchievementsAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../achievements/impl/achievements-addictinggames");
                const {AdsAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../ads/impl/ads-addictinggames");
                const {ContextAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../context/impl/context-addictinggames");
                const {IAPAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../iap/impl/iap-addictinggames");
                const {LeaderboardAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../leaderboard/impl/leaderboard-addictinggames");
                const {NotificationsAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../notifications/impl/notifications-addictinggames");
                const {PlayerAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../player/impl/player-addictinggames");
                const {SessionAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../session/impl/session-addictinggames");
                const {StatsAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../stats/impl/stats-addictinggames");
                const {TournamentAddictingGames} = await import(/* webpackChunkName: "addictinggames" */ "../tournament/impl/tournament-addictinggames");

                this._core = new CoreAddictingGames();
                this.achievements = new AchievementsAPI(new AchievementsAddictingGames());
                this.ads = new AdsAPI(new AdsAddictingGames(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextAddictingGames());
                this.iap = new InAppPurchaseAPI(new IAPAddictingGames());
                this.leaderboard = new LeaderboardAPI(new LeaderboardAddictingGames());
                this.notifications = new NotificationsAPI(new NotificationsAddictingGames());
                this.player = new PlayerAPI(new PlayerAddictingGames(new Player()));
                this.session = new SessionAPI(new SessionAddictingGames(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsAddictingGames());
                this.tournament = new TournamentAPI(new TournamentAddictingGames());

                break;
            }
            case "crazygames": {
                const {CoreCrazyGames} = await import(/* webpackChunkName: "crazygames" */ "./impl/core-crazygames");
                const {AchievementsCrazyGames} = await import(/* webpackChunkName: "crazygames" */ "../achievements/impl/achievements-crazygames");
                const {AdsCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../ads/impl/ads-crazygames");
                const {ContextCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../context/impl/context-crazygames");
                const {IAPCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../iap/impl/iap-crazygames");
                const {LeaderboardCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../leaderboard/impl/leaderboard-crazygames");
                const {NotificationsCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../notifications/impl/notifications-crazygames");
                const {PlayerCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../player/impl/player-crazygames");
                const {SessionCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../session/impl/session-crazygames");
                const {StatsCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../stats/impl/stats-crazygames");
                const {TournamentCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../tournament/impl/tournament-crazygames");

                this._core = new CoreCrazyGames();
                this.achievements = new AchievementsAPI(new AchievementsCrazyGames());
                this.ads = new AdsAPI(new AdsCrazyGames(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextCrazyGames());
                this.iap = new InAppPurchaseAPI(new IAPCrazyGames());
                this.leaderboard = new LeaderboardAPI(new LeaderboardCrazyGames());
                this.notifications = new NotificationsAPI(new NotificationsCrazyGames());
                this.player = new PlayerAPI(new PlayerCrazyGames(new CrazyGamesPlayer()));
                this.session = new SessionAPI(new SessionCrazyGames(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsCrazyGames());
                this.tournament = new TournamentAPI(new TournamentCrazyGames());

                break;
            }
            case "facebook": {
                const {CoreFacebook} = await import(/* webpackChunkName: "facebook" */ "./impl/core-facebook");
                const {AchievementsFacebook} = await import(/* webpackChunkName: "facebook" */ "../achievements/impl/achievements-facebook");
                const {AdsFacebook} = await import(/* webpackChunkName: "facebook" */ "../ads/impl/ads-facebook");
                const {ContextFacebook} = await import(/* webpackChunkName: "facebook" */ "../context/impl/context-facebook");
                const {IAPFacebook} = await import(/* webpackChunkName: "facebook" */ "../iap/impl/iap-facebook");
                const {LeaderboardFacebook} = await import(/* webpackChunkName: "facebook" */ "../leaderboard/impl/leaderboard-facebook");
                const {NotificationsFacebook} = await import(/* webpackChunkName: "facebook" */ "../notifications/impl/notifications-facebook");
                const {PlayerFacebook} = await import(/* webpackChunkName: "facebook" */ "../player/impl/player-facebook");
                const {SessionFacebook} = await import(/* webpackChunkName: "facebook" */ "../session/impl/session-facebook");
                const {StatsFacebook} = await import(/* webpackChunkName: "facebook" */ "../stats/impl/stats-facebook");
                const {TournamentFacebook} = await import(/* webpackChunkName: "facebook" */ "../tournament/impl/tournament-facebook");

                this._core = new CoreFacebook();
                this.achievements = new AchievementsAPI(new AchievementsFacebook());
                this.ads = new AdsAPI(new AdsFacebook(new AdConfigFacebook()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextFacebook());
                this.iap = new InAppPurchaseAPI(new IAPFacebook());
                this.leaderboard = new LeaderboardAPI(new LeaderboardFacebook());
                this.notifications = new NotificationsAPI(new NotificationsFacebook());
                this.player = new PlayerAPI(new PlayerFacebook(new FacebookPlayer()));
                this.session = new SessionAPI(new SessionFacebook(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsFacebook());
                this.tournament = new TournamentAPI(new TournamentFacebook());

                break;
            }
            case "gamemonetize": {
                const {CoreGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "./impl/core-gamemonetize");
                const {AchievementsGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../achievements/impl/achievements-gamemonetize");
                const {AdsGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../ads/impl/ads-gamemonetize");
                const {ContextGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../context/impl/context-gamemonetize");
                const {IAPGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../iap/impl/iap-gamemonetize");
                const {LeaderboardGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../leaderboard/impl/leaderboard-gamemonetize");
                const {NotificationsGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../notifications/impl/notifications-gamemonetize");
                const {PlayerGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../player/impl/player-gamemonetize");
                const {SessionGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../session/impl/session-gamemonetize");
                const {StatsGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../stats/impl/stats-gamemonetize");
                const {TournamentGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../tournament/impl/tournament-gamemonetize");

                this._core = new CoreGameMonetize();
                this.achievements = new AchievementsAPI(new AchievementsGameMonetize());
                this.ads = new AdsAPI(new AdsGameMonetize(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextGameMonetize());
                this.iap = new InAppPurchaseAPI(new IAPGameMonetize());
                this.leaderboard = new LeaderboardAPI(new LeaderboardGameMonetize());
                this.notifications = new NotificationsAPI(new NotificationsGameMonetize());
                this.player = new PlayerAPI(new PlayerGameMonetize(new Player()));
                this.session = new SessionAPI(new SessionGameMonetize(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsGameMonetize());
                this.tournament = new TournamentAPI(new TournamentGameMonetize());

                break;
            }
            case "gamepix": {
                const {CoreGamePix} = await import(/* webpackChunkName: "gamepix" */ "./impl/core-gamepix");
                const {AchievementsGamePix} = await import(/* webpackChunkName: "gamepix" */ "../achievements/impl/achievements-gamepix");
                const {AdsGamePix} = await import(/* webpackChunkName: "gamepix" */ "../ads/impl/ads-gamepix");
                const {ContextGamePix} = await import(/* webpackChunkName: "gamepix" */ "../context/impl/context-gamepix");
                const {IAPGamePix} = await import(/* webpackChunkName: "gamepix" */ "../iap/impl/iap-gamepix");
                const {LeaderboardGamePix} = await import(/* webpackChunkName: "gamepix" */ "../leaderboard/impl/leaderboard-gamepix");
                const {NotificationsGamePix} = await import(/* webpackChunkName: "gamepix" */ "../notifications/impl/notifications-gamepix");
                const {PlayerGamePix} = await import(/* webpackChunkName: "gamepix" */ "../player/impl/player-gamepix");
                const {SessionGamePix} = await import(/* webpackChunkName: "gamepix" */ "../session/impl/session-gamepix");
                const {StatsGamePix} = await import(/* webpackChunkName: "gamepix" */ "../stats/impl/stats-gamepix");
                const {TournamentGamePix} = await import(/* webpackChunkName: "gamepix" */ "../tournament/impl/tournament-gamepix");

                this._core = new CoreGamePix();
                this.achievements = new AchievementsAPI(new AchievementsGamePix());
                this.ads = new AdsAPI(new AdsGamePix(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsDisabled());
                this.context = new ContextAPI(new ContextGamePix());
                this.iap = new InAppPurchaseAPI(new IAPGamePix());
                this.leaderboard = new LeaderboardAPI(new LeaderboardGamePix());
                this.notifications = new NotificationsAPI(new NotificationsGamePix());
                this.player = new PlayerAPI(new PlayerGamePix(new Player()));
                this.session = new SessionAPI(new SessionGamePix(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsGamePix());
                this.tournament = new TournamentAPI(new TournamentGamePix());

                break;
            }
            case "gd": {
                const {CoreGD} = await import(/* webpackChunkName: "gd" */ "./impl/core-gd");
                const {AchievementsGD} = await import(/* webpackChunkName: "gd" */ "../achievements/impl/achievements-gd");
                const {AdsGD} = await import(/* webpackChunkName: "gd" */ "../ads/impl/ads-gd");
                const {ContextGD} = await import(/* webpackChunkName: "gd" */ "../context/impl/context-gd");
                const {IAPGD} = await import(/* webpackChunkName: "gd" */ "../iap/impl/iap-gd");
                const {LeaderboardGD} = await import(/* webpackChunkName: "gd" */ "../leaderboard/impl/leaderboard-gd");
                const {NotificationsGD} = await import(/* webpackChunkName: "gd" */ "../notifications/impl/notifications-gd");
                const {PlayerGD} = await import(/* webpackChunkName: "gd" */ "../player/impl/player-gd");
                const {SessionGD} = await import(/* webpackChunkName: "gd" */ "../session/impl/session-gd");
                const {StatsGD} = await import(/* webpackChunkName: "gd" */ "../stats/impl/stats-gd");
                const {TournamentGD} = await import(/* webpackChunkName: "gd" */ "../tournament/impl/tournament-gd");

                this._core = new CoreGD();
                this.achievements = new AchievementsAPI(new AchievementsGD());
                this.ads = new AdsAPI(new AdsGD(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsDisabled());
                this.context = new ContextAPI(new ContextGD());
                this.iap = new InAppPurchaseAPI(new IAPGD());
                this.leaderboard = new LeaderboardAPI(new LeaderboardGD());
                this.notifications = new NotificationsAPI(new NotificationsGD());
                this.player = new PlayerAPI(new PlayerGD(new Player()));
                this.session = new SessionAPI(new SessionGD(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsGD());
                this.tournament = new TournamentAPI(new TournamentGD());

                break;
            }
            case "link": {
                const {CoreLink} = await import(/* webpackChunkName: "link" */ "./impl/core-link");
                const {AchievementsLink} = await import(/* webpackChunkName: "link" */ "../achievements/impl/achievements-link");
                const {AdsLink} = await import(/* webpackChunkName: "link" */ "../ads/impl/ads-link");
                const {ContextLink} = await import(/* webpackChunkName: "link" */ "../context/impl/context-link");
                const {IAPLink} = await import(/* webpackChunkName: "link" */ "../iap/impl/iap-link");
                const {LeaderboardLink} = await import(/* webpackChunkName: "link" */ "../leaderboard/impl/leaderboard-link");
                const {NotificationsLink} = await import(/* webpackChunkName: "link" */ "../notifications/impl/notifications-link");
                const {PlayerLink} = await import(/* webpackChunkName: "link" */ "../player/impl/player-link");
                const {SessionLink} = await import(/* webpackChunkName: "link" */ "../session/impl/session-link");
                const {StatsLink} = await import(/* webpackChunkName: "link" */ "../stats/impl/stats-link");
                const {TournamentLink} = await import(/* webpackChunkName: "link" */ "../tournament/impl/tournament-link");

                this._core = new CoreLink();
                this.achievements = new AchievementsAPI(new AchievementsLink());
                this.ads = new AdsAPI(new AdsLink(new AdConfigLink()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextLink());
                this.iap = new InAppPurchaseAPI(new IAPLink());
                this.leaderboard = new LeaderboardAPI(new LeaderboardLink());
                this.notifications = new NotificationsAPI(new NotificationsLink());
                this.player = new PlayerAPI(new PlayerLink(new LinkPlayer()));
                this.session = new SessionAPI(new SessionLink(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsLink());
                this.tournament = new TournamentAPI(new TournamentLink());

                break;
            }
            case "poki": {
                const {CorePoki} = await import(/* webpackChunkName: "poki" */ "./impl/core-poki");
                const {AchievementsPoki} = await import(/* webpackChunkName: "poki" */ "../achievements/impl/achievements-poki");
                const {AdsPoki} = await import(/* webpackChunkName: "poki" */ "../ads/impl/ads-poki");
                const {ContextPoki} = await import(/* webpackChunkName: "poki" */ "../context/impl/context-poki");
                const {IAPPoki} = await import(/* webpackChunkName: "poki" */ "../iap/impl/iap-poki");
                const {LeaderboardPoki} = await import(/* webpackChunkName: "poki" */ "../leaderboard/impl/leaderboard-poki");
                const {NotificationsPoki} = await import(/* webpackChunkName: "poki" */ "../notifications/impl/notifications-poki");
                const {PlayerPoki} = await import(/* webpackChunkName: "poki" */ "../player/impl/player-poki");
                const {SessionPoki} = await import(/* webpackChunkName: "poki" */ "../session/impl/session-poki");
                const {StatsPoki} = await import(/* webpackChunkName: "poki" */ "../stats/impl/stats-poki");
                const {TournamentPoki} = await import(/* webpackChunkName: "poki" */ "../tournament/impl/tournament-poki");

                this._core = new CorePoki();
                this.achievements = new AchievementsAPI(new AchievementsPoki());
                this.ads = new AdsAPI(new AdsPoki(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextPoki());
                this.iap = new InAppPurchaseAPI(new IAPPoki());
                this.leaderboard = new LeaderboardAPI(new LeaderboardPoki());
                this.notifications = new NotificationsAPI(new NotificationsPoki());
                this.player = new PlayerAPI(new PlayerPoki(new Player()));
                this.session = new SessionAPI(new SessionPoki(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsPoki());
                this.tournament = new TournamentAPI(new TournamentPoki());

                break;
            }
            case "telegram": {
                const {CoreTelegram} = await import(/* webpackChunkName: "telegram" */ "./impl/core-telegram");
                const {AchievementsTelegram} = await import(/* webpackChunkName: "telegram" */ "../achievements/impl/achievements-telegram");
                const {AdsTelegram} = await import(/* webpackChunkName: "telegram" */ "../ads/impl/ads-telegram");
                const {ContextTelegram} = await import(/* webpackChunkName: "telegram" */ "../context/impl/context-telegram");
                const {IAPTelegram} = await import(/* webpackChunkName: "telegram" */ "../iap/impl/iap-telegram");
                const {LeaderboardTelegram} = await import(/* webpackChunkName: "telegram" */ "../leaderboard/impl/leaderboard-telegram");
                const {NotificationsTelegram} = await import(/* webpackChunkName: "telegram" */ "../notifications/impl/notifications-telegram");
                const {PlayerTelegram} = await import(/* webpackChunkName: "telegram" */ "../player/impl/player-telegram");
                const {SessionTelegram} = await import(/* webpackChunkName: "telegram" */ "../session/impl/session-telegram");
                const {StatsTelegram} = await import(/* webpackChunkName: "telegram" */ "../stats/impl/stats-telegram");
                const {TournamentTelegram} = await import(/* webpackChunkName: "telegram" */ "../tournament/impl/tournament-telegram");

                this._core = new CoreTelegram();
                this.achievements = new AchievementsAPI(new AchievementsTelegram());
                this.ads = new AdsAPI(new AdsTelegram(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextTelegram());
                this.iap = new InAppPurchaseAPI(new IAPTelegram());
                this.leaderboard = new LeaderboardAPI(new LeaderboardTelegram());
                this.notifications = new NotificationsAPI(new NotificationsTelegram());
                this.player = new PlayerAPI(new PlayerTelegram(new Player())); // We can't include the TelegramPlayer here because it will block the demo project upload to FB.
                this.session = new SessionAPI(new SessionTelegram(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsTelegram());
                this.tournament = new TournamentAPI(new TournamentTelegram());

                break;
            }
            case "viber": {
                const {CoreViber} = await import(/* webpackChunkName: "viber" */ "./impl/core-viber");
                const {AchievementsViber} = await import(/* webpackChunkName: "viber" */ "../achievements/impl/achievements-viber");
                const {AdsViber} = await import(/* webpackChunkName: "viber" */ "../ads/impl/ads-viber");
                const {ContextViber} = await import(/* webpackChunkName: "viber" */ "../context/impl/context-viber");
                const {IAPViber} = await import(/* webpackChunkName: "viber" */ "../iap/impl/iap-viber");
                const {LeaderboardViber} = await import(/* webpackChunkName: "viber" */ "../leaderboard/impl/leaderboard-viber");
                const {NotificationsViber} = await import(/* webpackChunkName: "viber" */ "../notifications/impl/notifications-viber");
                const {PlayerViber} = await import(/* webpackChunkName: "viber" */ "../player/impl/player-viber");
                const {SessionViber} = await import(/* webpackChunkName: "viber" */ "../session/impl/session-viber");
                const {StatsViber} = await import(/* webpackChunkName: "viber" */ "../stats/impl/stats-viber");
                const {TournamentViber} = await import(/* webpackChunkName: "viber" */ "../tournament/impl/tournament-viber");

                this._core = new CoreViber();
                this.achievements = new AchievementsAPI(new AchievementsViber());
                this.ads = new AdsAPI(new AdsViber(new AdConfigViber()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextViber());
                this.iap = new InAppPurchaseAPI(new IAPViber());
                this.leaderboard = new LeaderboardAPI(new LeaderboardViber());
                this.notifications = new NotificationsAPI(new NotificationsViber());
                this.player = new PlayerAPI(new PlayerViber(new ViberPlayer()));
                this.session = new SessionAPI(new SessionViber(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsViber());
                this.tournament = new TournamentAPI(new TournamentViber());

                break;
            }
            case "wortal": {
                const {CoreWortal} = await import(/* webpackChunkName: "wortal" */ "./impl/core-wortal");
                const {AchievementsWortal} = await import(/* webpackChunkName: "wortal" */ "../achievements/impl/achievements-wortal");
                const {AdsWortal} = await import(/* webpackChunkName: "wortal" */ "../ads/impl/ads-wortal");
                const {ContextWortal} = await import(/* webpackChunkName: "wortal" */ "../context/impl/context-wortal");
                const {IAPWortal} = await import(/* webpackChunkName: "wortal" */ "../iap/impl/iap-wortal");
                const {LeaderboardWortal} = await import(/* webpackChunkName: "wortal" */ "../leaderboard/impl/leaderboard-wortal");
                const {NotificationsWortal} = await import(/* webpackChunkName: "wortal" */ "../notifications/impl/notifications-wortal");
                const {PlayerWortal} = await import(/* webpackChunkName: "wortal" */ "../player/impl/player-wortal");
                const {SessionWortal} = await import(/* webpackChunkName: "wortal" */ "../session/impl/session-wortal");
                const {StatsWortal} = await import(/* webpackChunkName: "wortal" */ "../stats/impl/stats-wortal");
                const {TournamentWortal} = await import(/* webpackChunkName: "wortal" */ "../tournament/impl/tournament-wortal");

                this._core = new CoreWortal();
                this.achievements = new AchievementsAPI(new AchievementsWortal());
                this.ads = new AdsAPI(new AdsWortal(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextWortal());
                this.iap = new InAppPurchaseAPI(new IAPWortal());
                this.leaderboard = new LeaderboardAPI(new LeaderboardWortal());
                this.notifications = new NotificationsAPI(new NotificationsWortal());
                this.player = new PlayerAPI(new PlayerWortal(new Player()));
                this.session = new SessionAPI(new SessionWortal(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsWortal());
                this.tournament = new TournamentAPI(new TournamentWortal());

                break;
            }
            case "yandex": {
                const {CoreYandex} = await import(/* webpackChunkName: "yandex" */ "./impl/core-yandex");
                const {AchievementsYandex} = await import(/* webpackChunkName: "yandex" */ "../achievements/impl/achievements-yandex");
                const {AdsYandex} = await import(/* webpackChunkName: "yandex" */ "../ads/impl/ads-yandex");
                const {ContextYandex} = await import(/* webpackChunkName: "yandex" */ "../context/impl/context-yandex");
                const {IAPYandex} = await import(/* webpackChunkName: "yandex" */ "../iap/impl/iap-yandex");
                const {LeaderboardYandex} = await import(/* webpackChunkName: "yandex" */ "../leaderboard/impl/leaderboard-yandex");
                const {NotificationsYandex} = await import(/* webpackChunkName: "yandex" */ "../notifications/impl/notifications-yandex");
                const {PlayerYandex} = await import(/* webpackChunkName: "yandex" */ "../player/impl/player-yandex");
                const {SessionYandex} = await import(/* webpackChunkName: "yandex" */ "../session/impl/session-yandex");
                const {StatsYandex} = await import(/* webpackChunkName: "yandex" */ "../stats/impl/stats-yandex");
                const {TournamentYandex} = await import(/* webpackChunkName: "yandex" */ "../tournament/impl/tournament-yandex");

                this._core = new CoreYandex();
                this.achievements = new AchievementsAPI(new AchievementsYandex());
                this.ads = new AdsAPI(new AdsYandex(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextYandex());
                this.iap = new InAppPurchaseAPI(new IAPYandex());
                this.leaderboard = new LeaderboardAPI(new LeaderboardYandex());
                this.notifications = new NotificationsAPI(new NotificationsYandex());
                this.player = new PlayerAPI(new PlayerYandex(new YandexPlayer()));
                this.session = new SessionAPI(new SessionYandex(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsYandex());
                this.tournament = new TournamentAPI(new TournamentYandex());

                break;
            }
            case "debug": {
                const {CoreDebug} = await import(/* webpackChunkName: "debug" */ "./impl/core-debug");
                const {AchievementsDebug} = await import(/* webpackChunkName: "debug" */ "../achievements/impl/achievements-debug");
                const {AdsDebug} = await import(/* webpackChunkName: "debug" */ "../ads/impl/ads-debug");
                const {ContextDebug} = await import(/* webpackChunkName: "debug" */ "../context/impl/context-debug");
                const {IAPDebug} = await import(/* webpackChunkName: "debug" */ "../iap/impl/iap-debug");
                const {LeaderboardDebug} = await import(/* webpackChunkName: "debug" */ "../leaderboard/impl/leaderboard-debug");
                const {NotificationsDebug} = await import(/* webpackChunkName: "debug" */ "../notifications/impl/notifications-debug");
                const {PlayerDebug} = await import(/* webpackChunkName: "debug" */ "../player/impl/player-debug");
                const {SessionDebug} = await import(/* webpackChunkName: "debug" */ "../session/impl/session-debug");
                const {StatsDebug} = await import(/* webpackChunkName: "debug" */ "../stats/impl/stats-debug");
                const {TournamentDebug} = await import(/* webpackChunkName: "debug" */ "../tournament/impl/tournament-debug");

                this._core = new CoreDebug();
                this.achievements = new AchievementsAPI(new AchievementsDebug());
                this.ads = new AdsAPI(new AdsDebug(new AdConfig()));
                this.analytics = new AnalyticsAPI(new AnalyticsDisabled());
                this.context = new ContextAPI(new ContextDebug());
                this.iap = new InAppPurchaseAPI(new IAPDebug());
                this.leaderboard = new LeaderboardAPI(new LeaderboardDebug());
                this.notifications = new NotificationsAPI(new NotificationsDebug());
                this.player = new PlayerAPI(new PlayerDebug(new Player()));
                this.session = new SessionAPI(new SessionDebug(new GameState(), new Session()));
                this.stats = new StatsAPI(new StatsDebug());
                this.tournament = new TournamentAPI(new TournamentDebug());

                break;
            }
            default:
                return Promise.reject(initializationError(`Unsupported platform: ${platform}`, "_loadCoreAsync"));
        }
    }

//#endregion
}
