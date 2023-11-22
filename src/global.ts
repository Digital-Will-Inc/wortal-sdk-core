import { CoreAPI } from "./core/core-api";
import { AddictingGamesSDK } from "./core/interfaces/addictinggames-sdk";
import { FacebookSDK } from "./core/interfaces/facebook-sdk";
import { GameMonetizeSDK } from "./core/interfaces/gamemonetize-sdk";
import { GamePixSDK } from "./core/interfaces/gamepix-sdk";
import { GDSDK } from "./core/interfaces/gd-sdk";
import { LinkSDK } from "./core/interfaces/link-sdk";
import { PokiSDK } from "./core/interfaces/poki-sdk";
import { ViberSDK } from "./core/interfaces/viber-sdk";
import { YandexSDK } from "./core/interfaces/yandex-sdk";
import { ShareTo } from "./utils/wortal-utils";
import type { Platform } from "./session/types/session-types";

declare global {
    const __VERSION__: string;

    const LinkGame: LinkSDK;
    const ViberPlay: ViberSDK;
    const FBInstant: FacebookSDK;
    const gdsdk: GDSDK;
    const GamePix: GamePixSDK;
    const sdk: GameMonetizeSDK;
    const PokiSDK: PokiSDK;
    const SWAGAPI: AddictingGamesSDK;
    const waves: WavesSDK;
    const YaGames: YandexSDK;

    interface Window {
        /**
         * Wortal SDK
         * @hidden
         */
        Wortal: CoreAPI;
        /**
         * ID of the game as set by wortal-data.js. This is used to identify the game on the Wortal backend.
         * @hidden
         */
        wortalGameID: string;
        /**
         * ID of the game as set by AddictingGames. This is included in wortal-data.js.
         * @hidden
         */
        addictingGamesID: string;
        /**
         * This is set by the Wortal backend and is used to identify a Wortal player via session.
         * @hidden
         */
        wortalSessionId: string;
        /**
         * Google Adsense SDK. Push ads to this array to display them.
         * See: https://developers.google.com/ad-placement/docs/example#indexhtml_web
         * @hidden
         */
        adsbygoogle: object[];
        /**
         * Calls for an ad break. This is used by the Google Adsense SDK.
         * @hidden
         */
        adBreak: (params: object) => void;
        /**
         * Ad configuration. This is used by the Google Adsense SDK.
         * @hidden
         */
        adConfig: (params: object) => void;
        /**
         * GD SDK requires an options object to be set in the window that holds their configuration and events.
         * The onEvent property is where we can listen for their SDK events.
         * We use this to map their events to our own callbacks.
         * @hidden
         */
        GD_OPTIONS: object;
        /**
         * GameMonetize SDK requires an options object to be set in the window that holds their configuration and events.
         * The onEvent property is where we can listen for their SDK events.
         * We use this to map their events to our own callbacks.
         * @hidden
         */
        SDK_OPTIONS: object;
        /**
         * CrazyGames SDK
         * @hidden
         */
        CrazyGames: CrazyGamesSDK;
        /**
         * Yandex SDK
         * @hidden
         */
        ysdk: YandexSDK;
        /**
         * Shares the game on the specified platform. This is only supported on Wortal and was ported over from the now
         * deprecated wortal.js. It is not recommended to use this function, as it is called from the page
         * displaying the game.
         * @hidden
         */
        shareGame: (destination: ShareTo, message: string) => void;
    }

    interface CrazyGamesSDK {
        SDK: any;
    }


    interface WavesInitializationOptions {
        baseUrl?: string;
        platform?: Platform;
        gameId?: number;
        authToken?: string;
    }

    interface WavesSDK {
        init(options: WavesInitializationOptions): void;
        /**
         * authenticate will check if there is no authToken it will open a dialog
         * to prompt the user to login and save the auth token
         * @param forceDialog if true, will always prompt the user to login
         */
        authenticate(forceDialog?: boolean): Promise<void>;
        get authToken(): string | undefined;
        set authToken(token: string | undefined);
        saveData<T = any>(gameData: T): Promise<{
            message: string;
        }>;
        savePartialData<T = any>(gameData: Partial<T>): Promise<{
            message: string;
        }>;
        getData<T = any>(): Promise<T>;
    }
}

export {};
