declare global {
    const __VERSION__: string;

    const LinkGame: any;
    const ViberPlay: any;
    const FBInstant: any;
    const gdsdk: any;
    const GamePix: any;

    interface Window {
        /**
         * Wortal SDK
         */
        Wortal: any;
        /**
         * ID of the game as set by wortal-data.js. This is used to identify the game on the Wortal backend.
         */
        wortalGameID: string;
        /**
         * This is set by the Wortal backend and is used to identify a Wortal player via session.
         */
        wortalSessionId: string;
        /**
         * Google Adsense SDK. Push ads to this array to display them.
         * See: https://developers.google.com/ad-placement/docs/example#indexhtml_web
         */
        adsbygoogle: object[];
        /**
         * Calls for an ad break. This is used by the Google Adsense SDK.
         */
        adBreak: Function;
        /**
         * Ad configuration. This is used by the Google Adsense SDK.
         */
        adConfig: Function;
        /**
         * GD SDK requires an options object to be set in the window that holds their configuration and events.
         * he onEvent property is where we can listen for their SDK events.
         * We use this to map their events to our own callbacks.
         */
        GD_OPTIONS: object;
        /**
         * CrazyGames SDK
         */
        CrazyGames: CrazyGamesSDK;
        /**
         * Shares the game on the specified platform. This is only supported on Wortal and was ported over from the now
         * deprecated wortal.js. It is not recommended to use this function, as it is called from the page
         * displaying the game.
         * @hidden
         */
        shareGame: (destination: string, message: string) => void;
    }

    interface CrazyGamesSDK {
        SDK: any;
    }
}

export {};
