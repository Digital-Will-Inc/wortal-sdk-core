import { AdConfigData } from "../interfaces/ad-data";
import { AdSense_Config } from "../interfaces/ad-sense";

/**
 * Config for the Ads API. Holds ad unit IDs, tracks ad calls and ad impressions.
 * @hidden
 */
export abstract class AdConfig {
    protected _data: AdConfigData = {
        isAdBlocked: false,
        hasPrerollShown: false,
        interstitialId: "",
        rewardedId: "",
        bannerId: "",
        adsCalled: 0,
        adsShown: 0,
    };

    protected _adSense: AdSense_Config = {
        channelID: "",
        clientID: "",
        hostID: ""
    };

    constructor() {
    }

    public abstract initialize(): Promise<void>;

    get isAdBlocked(): boolean {
        return this._data.isAdBlocked;
    }

    setAdBlocked(isBlocked: boolean): void {
        this._data.isAdBlocked = isBlocked;
    }

    get hasPrerollShown(): boolean {
        return this._data.hasPrerollShown;
    }

    setPrerollShown(hasShown: boolean): void {
        this._data.hasPrerollShown = hasShown;
    }

    get interstitialId(): string {
        return this._data.interstitialId;
    }

    get rewardedId(): string {
        return this._data.rewardedId;
    }

    get bannerId(): string {
        return this._data.bannerId;
    }

    get clientID(): string {
        return this._adSense.clientID;
    }

    setClientID(clientID: string): void {
        this._adSense.clientID = clientID;
    }

    get hostID(): string {
        return this._adSense.hostID;
    }

    setHostID(hostID: string): void {
        this._adSense.hostID = hostID;
    }

    get channelID(): string {
        return this._adSense.channelID;
    }

    setChannelID(channelID: string): void {
        this._adSense.channelID = channelID;
    }

    get adsCalled(): number {
        return this._data.adsCalled;
    }

    get adsShown(): number {
        return this._data.adsShown;
    }

    adCalled(): void {
        this._data.adsCalled++;
    }

    adShown(): void {
        this._data.adsShown++;
    }
}
