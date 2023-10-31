import { ShareTo } from "./utils/wortal-utils";

declare global {
    const __VERSION__: string;

    const LinkGame: any;
    const ViberPlay: any;
    const FBInstant: any;
    const gdsdk: any;
    const GamePix: any;
    const sdk: any;

    interface Window {
        /**
         * Wortal SDK
         * @hidden
         */
        Wortal: any;
        /**
         * ID of the game as set by wortal-data.js. This is used to identify the game on the Wortal backend.
         * @hidden
         */
        wortalGameID: string;
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
}

export {};
