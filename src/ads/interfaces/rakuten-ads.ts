import { AdType_Link_Viber } from "../types/ad-type";

/**
 * Ad unit provided by Link/Viber. These are passed into ad request calls to Link/Viber.
 * @hidden
 */
export interface AdUnit_Link_Viber {
    id: string;
    type: AdType_Link_Viber;
}

/**
 * Ad instance on Link and Viber. This is used to load and show ads.
 * @hidden
 */
export interface AdInstance_Link_Viber {
    getPlacementID(): string;
    loadAsync(): Promise<void>;
    showAsync(): Promise<void>;
}
