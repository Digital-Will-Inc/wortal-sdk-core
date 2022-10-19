import {GameData} from "./data";
import {Platform} from "./platform";
import {Ads, DebugAds, LinkAds, Placement, ViberAds, WortalAds} from "./ads";
import {Analytics, DebugAnalytics, WortalAnalytics} from "./analytics";
import {Auth, DebugAuth, LinkAuth, ViberAuth, WortalAuth} from "./auth";
import {DebugLeaderboard, Leaderboard, LinkLeaderboard, ViberLeaderboard, WortalLeaderboard} from "./leaderboard";
import {DebugSocial, LinkSocial, Social, ViberSocial, WortalSocial} from "./social";

export class Wortal {
    public static data: GameData;
    public static ads: Ads;
    public static analytics: Analytics;
    public static auth: Auth;
    public static leaderboard: Leaderboard;
    public static social: Social;

    public static isInit: boolean = false;
    public static isAdShowing: boolean = false;
    public static hasShownPreroll: boolean = false;

    private static readonly LOG_PREFIX: string = "[Wortal] ";
    private static _isDebugLog: boolean = false;

    /**
     * Initializes the Wortal SDK Core. This will check what platform the game is currently running on and
     * initialize the appropriate service implementations.
     *
     * @param isDebug Enables debug logging. This is disabled by default but can be turned on in development for
     * more verbose logging.
     */
    static init(isDebug: boolean = true): void {
        if (Wortal.isInit) {
            Wortal.warn("SDK Core already initialized.");
            return;
        }

        Wortal.log("Initializing SDK Core..");
        Wortal._isDebugLog = isDebug;
        Wortal.data = new GameData();

        switch (Wortal.data.platform) {
            case Platform.WORTAL:
                Wortal.log("Platform: Wortal");
                Wortal.initCoreWortal();
                break;
            case Platform.LINK:
                Wortal.log("Platform: Link");
                Wortal.initCoreLink();
                break;
            case Platform.VIBER:
                Wortal.log("Platform: Viber");
                Wortal.initCoreViber();
                break;
            case Platform.DEBUG:
                Wortal.log("Platform: Debug");
                Wortal.initCoreDebug();
                break;
        }

        // Preroll ads will only play on Platform.WORTAL currently. We set this flag anyway so that we can't pass
        // Placement.PREROLL into a showInterstitial call later.
        Wortal.hasShownPreroll = true;

        window.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") {
                Wortal.analytics.logGameEnd();
            }
        });
    }

    /**
     * Sets the loading progress of the game build.
     * @param value Percentage of loading progress completed. Range is 0 to 1.
     */
    static setLoadProgress(value: number): void {
        if (value > 1) {
            value *= 0.01;
        }

        if ((window as any).wortalGame) {
            (window as any).wortalGame.setLoadingProgress(value);
        }
    }

    /**
     * Logs a prefixed debug message to the console if debug mode is enabled.
     * @param message Message to log.
     */
    static debug(message: string): void {
        if (Wortal._isDebugLog) {
            console.log(Wortal.LOG_PREFIX + message);
        }
    }

    /**
     * Logs a prefixed message to the console.
     * @param message Message to log.
     */
    static log(message: string): void {
        console.log(Wortal.LOG_PREFIX + message);
    }

    /**
     * Logs a prefixed warning to the console.
     * @param message Message to log.
     */
    static warn(message: string): void {
        console.warn(Wortal.LOG_PREFIX + message);
    }

    /**
     * Logs a prefixed error to the console.
     * @param message Message to log.
     */
    static error(message: string): void {
        console.error(Wortal.LOG_PREFIX + message);
    }

    private static initCoreWortal(): void {
        Wortal.ads = new WortalAds();
        Wortal.analytics = new WortalAnalytics();
        Wortal.auth = new WortalAuth();
        Wortal.leaderboard = new WortalLeaderboard();
        Wortal.social = new WortalSocial();

        (window as any).initWortal(() => {
            Wortal.ads.showInterstitial(
                Placement.PREROLL, "Preroll", null, Wortal.removeLoadingCover);
        }, () => {
            Wortal.removeLoadingCover();
            Wortal.log("Ad blocker detected.");
            Wortal.data.isAdBlocked = true;
        });

        Wortal.log("SDK Core initialized.");
    }

    private static initCoreLink(): void {
        Wortal.ads = new LinkAds();
        Wortal.analytics = new WortalAnalytics();
        Wortal.auth = new LinkAuth();
        Wortal.leaderboard = new LinkLeaderboard();
        Wortal.social = new LinkSocial();

        Wortal.removeLoadingCover();
        (window as any).initWortal(() => {
            if ((window as any).wortalGame) {
                (window as any).wortalGame.initializeAsync().then(() => {
                    (window as any).wortalGame.startGameAsync();
                });
            }
        }, () => {
            Wortal.log("Ad blocker detected.");
            Wortal.data.isAdBlocked = true;
        });

        Wortal.log("SDK Core initialized.");
    }

    private static initCoreViber(): void {
        Wortal.ads = new ViberAds();
        Wortal.analytics = new WortalAnalytics();
        Wortal.auth = new ViberAuth();
        Wortal.leaderboard = new ViberLeaderboard();
        Wortal.social = new ViberSocial();

        Wortal.removeLoadingCover();
        (window as any).initWortal(() => {
            if ((window as any).wortalGame) {
                (window as any).wortalGame.initializeAsync().then(() => {
                    (window as any).wortalGame.startGameAsync();
                });
            }
        }, () => {
            Wortal.log("Ad blocker detected.");
            Wortal.data.isAdBlocked = true;
        });

        Wortal.log("SDK Core initialized.");
    }

    private static initCoreDebug(): void {
        Wortal._isDebugLog = true;

        Wortal.ads = new DebugAds();
        Wortal.analytics = new DebugAnalytics();
        Wortal.auth = new DebugAuth();
        Wortal.leaderboard = new DebugLeaderboard();
        Wortal.social = new DebugSocial();

        Wortal.log("SDK Core initialized.");
    }

    private static removeLoadingCover(): void {
        if (document.getElementById("loading-cover")) {
            document.getElementById("loading-cover").style.display = "none";
        }
    }
}
