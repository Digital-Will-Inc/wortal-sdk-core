import { AuthPayload } from "../auth/interfaces/auth-payload";
import { AuthResponse } from "../auth/interfaces/auth-response";
import { ContextWortal } from "../context/impl/context-wortal";
import { Platform } from "../session/types/session-types";
import { initializationError } from "../errors/error-handler";
import { debug, info, internalCall, performanceLog, status } from "../utils/logger";
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
import { CrazyGamesSDK } from "./interfaces/crazygames-sdk";
import { FacebookSDK } from "./interfaces/facebook-sdk";
import { GameMonetizeSDK } from "./interfaces/gamemonetize-sdk";
import { GamePixSDK } from "./interfaces/gamepix-sdk";
import { GDSDK } from "./interfaces/gd-sdk";
import { InitializationOptions } from "./interfaces/initialization-options";
import { LinkSDK } from "./interfaces/link-sdk";
import { ViberSDK } from "./interfaces/viber-sdk";

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

    // This holds the current platform SDK and access to its APIs. This is set in _initializePlatformAsync.
    // Some platforms, such as Telegram, do not require including an SDK so this will remain an empty object.
    private _platformSDK: CrazyGamesSDK | FacebookSDK | GameMonetizeSDK | GamePixSDK | GDSDK | LinkSDK | ViberSDK | any;
    private _platform: Platform = "debug";

    constructor() {
    }

    /** @internal */
    get _internalPlatformSDK(): CrazyGamesSDK | FacebookSDK | GameMonetizeSDK | GamePixSDK | GDSDK | LinkSDK | ViberSDK | any {
        return this._platformSDK;
    }

    /** @internal */
    set _internalPlatformSDK(value: CrazyGamesSDK | FacebookSDK | GameMonetizeSDK | GamePixSDK | GDSDK | LinkSDK | ViberSDK | any) {
        this._platformSDK = value;
    }

    /** @internal */
    get _internalPlatform(): Platform {
        return this._platform;
    }

    /** @internal */
    get _internalIsPlatformInitialized(): boolean {
        return this._isPlatformInitialized;
    }

    /** @internal */
    get _internalIsAutoInit(): boolean {
        return this._isAutoInit;
    }

//#endregion
//#region Public API

    public ads!: AdsAPI;
    public analytics!: AnalyticsAPI;
    public context!: ContextAPI;
    public iap!: InAppPurchaseAPI;
    public leaderboard!: LeaderboardAPI;
    public notifications!: NotificationsAPI;
    public player!: PlayerAPI;
    public session!: SessionAPI;
    public tournament!: TournamentAPI;

    /**
     * Returns true if the SDK has been initialized. No APIs should be called before the SDK has been initialized.
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
        internalCall("_loadCoreAsync");
        if (this._isInitialized) {
            return Promise.reject(initializationError("SDK already initialized.", "_loadCoreAsync"));
        }

        // Parse the initialization options first.
        info("Initializing SDK " + __VERSION__);
        this._platform = options.platform;
        if (!options.autoInitialize) {
            this._isAutoInit = false;
        }
        debug("Platform: " + this._platform);

        // We might end the initialization process in several different places, we just listen for this event to know
        // when the SDK is finished initializing.
        const sdkStartTime: number = performance.now();
        window.addEventListener("wortal-sdk-initialized", () => {
            const sdkEndTime: number = performance.now();
            const sdkExecutionTime: number = sdkEndTime - sdkStartTime;
            performanceLog(`Wortal SDK initialized in ${sdkExecutionTime}ms.`);
        });

        // First we load the chunks we need for this platform. This includes wortal-common and the platform specific chunk.
        try {
            status("Loading chunks...");
            const startTime: number = performance.now();

            await this._loadChunksAsync(this._platform);

            const endTime: number = performance.now();
            const executionTime: number = endTime - startTime;

            performanceLog(`Chunks loaded in ${executionTime}ms.`);
        } catch (error: any) {
            return Promise.reject(initializationError(`Failed to initialize SDK during loadChunksAsync: ${error.message}`, "_loadCoreAsync"));
        }

        // Next we dynamically import the API implementations for the current platform.
        try {
            status("Loading APIs...");
            const startTime: number = performance.now();

            await this._loadAPIsAsync(this._platform);

            const endTime: number = performance.now();
            const executionTime: number = endTime - startTime;

            performanceLog(`APIs loaded in ${executionTime}ms.`);
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
            status("Initializing platform...");
            const startTime: number = performance.now();

            await this._core._initializePlatformAsync();

            const endTime: number = performance.now();
            const executionTime: number = endTime - startTime;

            performanceLog(`Platform initialized in ${executionTime}ms.`);
        } catch (error: any) {
            return Promise.reject(initializationError(`Failed to initialize SDK during initializePlatformAsync: ${error.message}`, "_loadCoreAsync"));
        }

        // If the developer calls initializeAsync earlier than this, we need to wait for the platform to be initialized.
        // This flag will make initializeAsync await the platform initialization before continuing.
        this._isPlatformInitialized = true;

        // We've finished the internal initialization that's still necessary in manual initialization mode, so we can
        // resolve here and wait for the developer to finish the initialization process.
        if (!this._isAutoInit) {
            debug("Manual initialization requested. Platform initialization finished, awaiting manual initialization..");
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

        info("SDK initialization complete.");
    }

    async _loadChunksAsync(platform: Platform): Promise<void> {
        internalCall("_loadChunksAsync");
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

    async _loadAPIsAsync(platform: Platform): Promise<void> {
        internalCall("_loadAPIsAsync");
        const {AnalyticsWombat} = await import(/* webpackChunkName: "analytics" */ "../analytics/impl/analytics-wombat");
        const {AnalyticsDisabled} = await import(/* webpackChunkName: "analytics" */ "../analytics/impl/analytics-disabled");

        switch (platform) {
            case "crazygames": {
                const {CoreCrazyGames} = await import(/* webpackChunkName: "crazygames" */ "./impl/core-crazygames");
                const {AdsCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../ads/impl/ads-crazygames");
                const {ContextCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../context/impl/context-crazygames");
                const {IAPCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../iap/impl/iap-crazygames");
                const {LeaderboardCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../leaderboard/impl/leaderboard-crazygames");
                const {NotificationsCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../notifications/impl/notifications-crazygames");
                const {PlayerCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../player/impl/player-crazygames");
                const {SessionCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../session/impl/session-crazygames");
                const {TournamentCrazyGames} = await import(/* webpackChunkName: "crazygames" */"../tournament/impl/tournament-crazygames");

                this._core = new CoreCrazyGames();
                this.ads = new AdsAPI(new AdsCrazyGames());
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextCrazyGames());
                this.iap = new InAppPurchaseAPI(new IAPCrazyGames());
                this.leaderboard = new LeaderboardAPI(new LeaderboardCrazyGames());
                this.notifications = new NotificationsAPI(new NotificationsCrazyGames());
                this.player = new PlayerAPI(new PlayerCrazyGames());
                this.session = new SessionAPI(new SessionCrazyGames());
                this.tournament = new TournamentAPI(new TournamentCrazyGames());

                break;
            }
            case "facebook": {
                const {CoreFacebook} = await import(/* webpackChunkName: "facebook" */ "./impl/core-facebook");
                const {AdsFacebook} = await import(/* webpackChunkName: "facebook" */ "../ads/impl/ads-facebook");
                const {ContextFacebook} = await import(/* webpackChunkName: "facebook" */ "../context/impl/context-facebook");
                const {IAPFacebook} = await import(/* webpackChunkName: "facebook" */ "../iap/impl/iap-facebook");
                const {LeaderboardFacebook} = await import(/* webpackChunkName: "facebook" */ "../leaderboard/impl/leaderboard-facebook");
                const {NotificationsFacebook} = await import(/* webpackChunkName: "facebook" */ "../notifications/impl/notifications-facebook");
                const {PlayerFacebook} = await import(/* webpackChunkName: "facebook" */ "../player/impl/player-facebook");
                const {SessionFacebook} = await import(/* webpackChunkName: "facebook" */ "../session/impl/session-facebook");
                const {TournamentFacebook} = await import(/* webpackChunkName: "facebook" */ "../tournament/impl/tournament-facebook");

                this._core = new CoreFacebook();
                this.ads = new AdsAPI(new AdsFacebook());
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextFacebook());
                this.iap = new InAppPurchaseAPI(new IAPFacebook());
                this.leaderboard = new LeaderboardAPI(new LeaderboardFacebook());
                this.notifications = new NotificationsAPI(new NotificationsFacebook());
                this.player = new PlayerAPI(new PlayerFacebook());
                this.session = new SessionAPI(new SessionFacebook());
                this.tournament = new TournamentAPI(new TournamentFacebook());

                break;
            }
            case "gamemonetize": {
                const {CoreGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "./impl/core-gamemonetize");
                const {AdsGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../ads/impl/ads-gamemonetize");
                const {ContextGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../context/impl/context-gamemonetize");
                const {IAPGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../iap/impl/iap-gamemonetize");
                const {LeaderboardGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../leaderboard/impl/leaderboard-gamemonetize");
                const {NotificationsGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../notifications/impl/notifications-gamemonetize");
                const {PlayerGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../player/impl/player-gamemonetize");
                const {SessionGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../session/impl/session-gamemonetize");
                const {TournamentGameMonetize} = await import(/* webpackChunkName: "gamemonetize" */ "../tournament/impl/tournament-gamemonetize");

                this._core = new CoreGameMonetize();
                this.ads = new AdsAPI(new AdsGameMonetize());
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextGameMonetize());
                this.iap = new InAppPurchaseAPI(new IAPGameMonetize());
                this.leaderboard = new LeaderboardAPI(new LeaderboardGameMonetize());
                this.notifications = new NotificationsAPI(new NotificationsGameMonetize());
                this.player = new PlayerAPI(new PlayerGameMonetize());
                this.session = new SessionAPI(new SessionGameMonetize());
                this.tournament = new TournamentAPI(new TournamentGameMonetize());

                break;
            }
            case "gamepix": {
                const {CoreGamePix} = await import(/* webpackChunkName: "gamepix" */ "./impl/core-gamepix");
                const {AdsGamePix} = await import(/* webpackChunkName: "gamepix" */ "../ads/impl/ads-gamepix");
                const {ContextGamePix} = await import(/* webpackChunkName: "gamepix" */ "../context/impl/context-gamepix");
                const {IAPGamePix} = await import(/* webpackChunkName: "gamepix" */ "../iap/impl/iap-gamepix");
                const {LeaderboardGamePix} = await import(/* webpackChunkName: "gamepix" */ "../leaderboard/impl/leaderboard-gamepix");
                const {NotificationsGamePix} = await import(/* webpackChunkName: "gamepix" */ "../notifications/impl/notifications-gamepix");
                const {PlayerGamePix} = await import(/* webpackChunkName: "gamepix" */ "../player/impl/player-gamepix");
                const {SessionGamePix} = await import(/* webpackChunkName: "gamepix" */ "../session/impl/session-gamepix");
                const {TournamentGamePix} = await import(/* webpackChunkName: "gamepix" */ "../tournament/impl/tournament-gamepix");

                this._core = new CoreGamePix();
                this.ads = new AdsAPI(new AdsGamePix());
                this.analytics = new AnalyticsAPI(new AnalyticsDisabled());
                this.context = new ContextAPI(new ContextGamePix());
                this.iap = new InAppPurchaseAPI(new IAPGamePix());
                this.leaderboard = new LeaderboardAPI(new LeaderboardGamePix());
                this.notifications = new NotificationsAPI(new NotificationsGamePix());
                this.player = new PlayerAPI(new PlayerGamePix());
                this.session = new SessionAPI(new SessionGamePix());
                this.tournament = new TournamentAPI(new TournamentGamePix());

                break;
            }
            case "gd": {
                const {CoreGD} = await import(/* webpackChunkName: "gd" */ "./impl/core-gd");
                const {AdsGD} = await import(/* webpackChunkName: "gd" */ "../ads/impl/ads-gd");
                const {ContextGD} = await import(/* webpackChunkName: "gd" */ "../context/impl/context-gd");
                const {IAPGD} = await import(/* webpackChunkName: "gd" */ "../iap/impl/iap-gd");
                const {LeaderboardGD} = await import(/* webpackChunkName: "gd" */ "../leaderboard/impl/leaderboard-gd");
                const {NotificationsGD} = await import(/* webpackChunkName: "gd" */ "../notifications/impl/notifications-gd");
                const {PlayerGD} = await import(/* webpackChunkName: "gd" */ "../player/impl/player-gd");
                const {SessionGD} = await import(/* webpackChunkName: "gd" */ "../session/impl/session-gd");
                const {TournamentGD} = await import(/* webpackChunkName: "gd" */ "../tournament/impl/tournament-gd");

                this._core = new CoreGD();
                this.ads = new AdsAPI(new AdsGD());
                this.analytics = new AnalyticsAPI(new AnalyticsDisabled());
                this.context = new ContextAPI(new ContextGD());
                this.iap = new InAppPurchaseAPI(new IAPGD());
                this.leaderboard = new LeaderboardAPI(new LeaderboardGD());
                this.notifications = new NotificationsAPI(new NotificationsGD());
                this.player = new PlayerAPI(new PlayerGD());
                this.session = new SessionAPI(new SessionGD());
                this.tournament = new TournamentAPI(new TournamentGD());

                break;
            }
            case "link": {
                const {CoreLink} = await import(/* webpackChunkName: "link" */ "./impl/core-link");
                const {AdsLink} = await import(/* webpackChunkName: "link" */ "../ads/impl/ads-link");
                const {ContextLink} = await import(/* webpackChunkName: "link" */ "../context/impl/context-link");
                const {IAPLink} = await import(/* webpackChunkName: "link" */ "../iap/impl/iap-link");
                const {LeaderboardLink} = await import(/* webpackChunkName: "link" */ "../leaderboard/impl/leaderboard-link");
                const {NotificationsLink} = await import(/* webpackChunkName: "link" */ "../notifications/impl/notifications-link");
                const {PlayerLink} = await import(/* webpackChunkName: "link" */ "../player/impl/player-link");
                const {SessionLink} = await import(/* webpackChunkName: "link" */ "../session/impl/session-link");
                const {TournamentLink} = await import(/* webpackChunkName: "link" */ "../tournament/impl/tournament-link");

                this._core = new CoreLink();
                this.ads = new AdsAPI(new AdsLink());
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextLink());
                this.iap = new InAppPurchaseAPI(new IAPLink());
                this.leaderboard = new LeaderboardAPI(new LeaderboardLink());
                this.notifications = new NotificationsAPI(new NotificationsLink());
                this.player = new PlayerAPI(new PlayerLink());
                this.session = new SessionAPI(new SessionLink());
                this.tournament = new TournamentAPI(new TournamentLink());

                break;
            }
            case "telegram": {
                const {CoreTelegram} = await import(/* webpackChunkName: "telegram" */ "./impl/core-telegram");
                const {AdsTelegram} = await import(/* webpackChunkName: "telegram" */ "../ads/impl/ads-telegram");
                const {ContextTelegram} = await import(/* webpackChunkName: "telegram" */ "../context/impl/context-telegram");
                const {IAPTelegram} = await import(/* webpackChunkName: "telegram" */ "../iap/impl/iap-telegram");
                const {LeaderboardTelegram} = await import(/* webpackChunkName: "telegram" */ "../leaderboard/impl/leaderboard-telegram");
                const {NotificationsTelegram} = await import(/* webpackChunkName: "telegram" */ "../notifications/impl/notifications-telegram");
                const {PlayerTelegram} = await import(/* webpackChunkName: "telegram" */ "../player/impl/player-telegram");
                const {SessionTelegram} = await import(/* webpackChunkName: "telegram" */ "../session/impl/session-telegram");
                const {TournamentTelegram} = await import(/* webpackChunkName: "telegram" */ "../tournament/impl/tournament-telegram");

                this._core = new CoreTelegram();
                this.ads = new AdsAPI(new AdsTelegram());
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextTelegram());
                this.iap = new InAppPurchaseAPI(new IAPTelegram());
                this.leaderboard = new LeaderboardAPI(new LeaderboardTelegram());
                this.notifications = new NotificationsAPI(new NotificationsTelegram());
                this.player = new PlayerAPI(new PlayerTelegram());
                this.session = new SessionAPI(new SessionTelegram());
                this.tournament = new TournamentAPI(new TournamentTelegram());

                break;
            }
            case "viber": {
                const {CoreViber} = await import(/* webpackChunkName: "viber" */ "./impl/core-viber");
                const {AdsViber} = await import(/* webpackChunkName: "viber" */ "../ads/impl/ads-viber");
                const {ContextViber} = await import(/* webpackChunkName: "viber" */ "../context/impl/context-viber");
                const {IAPViber} = await import(/* webpackChunkName: "viber" */ "../iap/impl/iap-viber");
                const {LeaderboardViber} = await import(/* webpackChunkName: "viber" */ "../leaderboard/impl/leaderboard-viber");
                const {NotificationsViber} = await import(/* webpackChunkName: "viber" */ "../notifications/impl/notifications-viber");
                const {PlayerViber} = await import(/* webpackChunkName: "viber" */ "../player/impl/player-viber");
                const {SessionViber} = await import(/* webpackChunkName: "viber" */ "../session/impl/session-viber");
                const {TournamentViber} = await import(/* webpackChunkName: "viber" */ "../tournament/impl/tournament-viber");

                this._core = new CoreViber();
                this.ads = new AdsAPI(new AdsViber());
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextViber());
                this.iap = new InAppPurchaseAPI(new IAPViber());
                this.leaderboard = new LeaderboardAPI(new LeaderboardViber());
                this.notifications = new NotificationsAPI(new NotificationsViber());
                this.player = new PlayerAPI(new PlayerViber());
                this.session = new SessionAPI(new SessionViber());
                this.tournament = new TournamentAPI(new TournamentViber());

                break;
            }
            case "wortal": {
                const {CoreWortal} = await import(/* webpackChunkName: "wortal" */ "./impl/core-wortal");
                const {AdsWortal} = await import(/* webpackChunkName: "wortal" */ "../ads/impl/ads-wortal");
                const {ContextWortal} = await import(/* webpackChunkName: "wortal" */ "../context/impl/context-wortal");
                const {IAPWortal} = await import(/* webpackChunkName: "wortal" */ "../iap/impl/iap-wortal");
                const {LeaderboardWortal} = await import(/* webpackChunkName: "wortal" */ "../leaderboard/impl/leaderboard-wortal");
                const {NotificationsWortal} = await import(/* webpackChunkName: "wortal" */ "../notifications/impl/notifications-wortal");
                const {PlayerWortal} = await import(/* webpackChunkName: "wortal" */ "../player/impl/player-wortal");
                const {SessionWortal} = await import(/* webpackChunkName: "wortal" */ "../session/impl/session-wortal");
                const {TournamentWortal} = await import(/* webpackChunkName: "wortal" */ "../tournament/impl/tournament-wortal");

                this._core = new CoreWortal();
                this.ads = new AdsAPI(new AdsWortal());
                this.analytics = new AnalyticsAPI(new AnalyticsWombat());
                this.context = new ContextAPI(new ContextWortal());
                this.iap = new InAppPurchaseAPI(new IAPWortal());
                this.leaderboard = new LeaderboardAPI(new LeaderboardWortal());
                this.notifications = new NotificationsAPI(new NotificationsWortal());
                this.player = new PlayerAPI(new PlayerWortal());
                this.session = new SessionAPI(new SessionWortal());
                this.tournament = new TournamentAPI(new TournamentWortal());

                break;
            }
            case "debug": {
                const {CoreDebug} = await import(/* webpackChunkName: "debug" */ "./impl/core-debug");
                const {AdsDebug} = await import(/* webpackChunkName: "debug" */ "../ads/impl/ads-debug");
                const {ContextDebug} = await import(/* webpackChunkName: "debug" */ "../context/impl/context-debug");
                const {IAPDebug} = await import(/* webpackChunkName: "debug" */ "../iap/impl/iap-debug");
                const {LeaderboardDebug} = await import(/* webpackChunkName: "debug" */ "../leaderboard/impl/leaderboard-debug");
                const {NotificationsDebug} = await import(/* webpackChunkName: "debug" */ "../notifications/impl/notifications-debug");
                const {PlayerDebug} = await import(/* webpackChunkName: "debug" */ "../player/impl/player-debug");
                const {SessionDebug} = await import(/* webpackChunkName: "debug" */ "../session/impl/session-debug");
                const {TournamentDebug} = await import(/* webpackChunkName: "debug" */ "../tournament/impl/tournament-debug");

                this._core = new CoreDebug();
                this.ads = new AdsAPI(new AdsDebug());
                this.analytics = new AnalyticsAPI(new AnalyticsDisabled());
                this.context = new ContextAPI(new ContextDebug());
                this.iap = new InAppPurchaseAPI(new IAPDebug());
                this.leaderboard = new LeaderboardAPI(new LeaderboardDebug());
                this.notifications = new NotificationsAPI(new NotificationsDebug());
                this.player = new PlayerAPI(new PlayerDebug());
                this.session = new SessionAPI(new SessionDebug());
                this.tournament = new TournamentAPI(new TournamentDebug());

                break;
            }
            default:
                return Promise.reject(initializationError(`Unsupported platform: ${platform}`, "_loadCoreAsync"));
        }
    }

//#endregion
}
