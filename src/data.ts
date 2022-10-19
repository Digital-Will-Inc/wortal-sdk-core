import {Platform} from "./platform";
import {Wortal} from "./index";

/**
 * Container class for data about the game session.
 */
export class GameData {
    public gameId: string = "";
    public gameName: string = "";
    public platform: Platform = Platform.DEBUG;
    public playerId: string = "";

    public browser: string = "";
    public country: string = "";
    public gameTimer: number = 0;
    public levelName: string = "";
    public levelTimer: number = 0;
    public levelTimerHandle: number = 0;

    public isAdBlocked: boolean = false;
    public linkInterstitialId: string = "";
    public linkRewardedId: string = "";
    public viberInterstitialId: string = "";
    public viberRewardedId: string = "";

    constructor() {
        this.country = this.getCountry();
        this.platform = this.getPlatform((window as any).getWortalPlatform());
        this.gameName = document.title;
        this.browser = navigator.userAgent;
        this.playerId = this.getPlayerId(this.platform);
        this.gameId = this.getGameId(this.platform);
    }

    private getPlatform(platform: string): Platform {
        switch (platform) {
            case 'wortal':
                return Platform.WORTAL;
            case 'link':
                return Platform.LINK;
            case 'viber':
                return Platform.VIBER;
            default:
                return Platform.DEBUG;
        }
    }

    private getPlayerId(platform: Platform): string {
        switch (platform) {
            case Platform.LINK:
            case Platform.VIBER:
                return this.getLinkViberPlayerId();
            case Platform.WORTAL:
                return "wortal-player";
            case Platform.DEBUG:
            default:
                return "debug";
        }
    }

    private getLinkViberPlayerId(): string {
        if ((window as any).wortalGame) {
            return (window as any).wortalGame.player.getID();
        }
    }

    private getGameId(platform: Platform): string {
        switch (platform) {
            case Platform.WORTAL:
                return this.parseWortalGameId();
            case Platform.LINK:
                return this.parseLinkGameId();
            case Platform.VIBER:
                return this.parseViberGameId();
            case Platform.DEBUG:
            default:
                return "debug";
        }
    }

    private parseWortalGameId(): string {
        // Example URL: https://gameportal.digitalwill.co.jp/games/cactus-bowling/19/
        let url = document.URL.split("/");
        return url[5];
    }

    private parseLinkGameId(): string {
        // Example URL: https://one.rakuten.co.jp/miniapp/games/0ffb7f71-3bc9-47da-9071-f88f0cb36718
        let url = document.URL.split("/");
        return url[5];
    }

    private parseViberGameId(): string {
        // Example URL: https://vbrpl.io/games/mmaj1mxbmfhvw4uahd9hgyifr6cwjsd0
        let url = document.URL.split("/");
        return url[4];
    }

    private getCountry(): string {
        let intlData;
        fetch("https://cdn.html5gameportal.com/wortal-sdk/intl-data.json")
            .then(response => response.json())
            .then(data => intlData = data)
            .catch(error => console.log(error));

        if (intlData) {
            Wortal.debug(intlData);
        }

        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const arr = zone.split("/");
        const city = arr[arr.length - 1];
        if (intlData) {
            return intlData[city];
        } else {
            return "Nulltherlands";
        }
    }
}
