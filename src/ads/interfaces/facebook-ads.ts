import { AdType_Facebook } from "../types/ad-type";

/**
 * Ad unit provided by Facebook. These are passed into ad request calls to Facebook.
 * @hidden
 */
export interface AdUnit_Facebook {
    display_format: AdType_Facebook;
    placement_id: string;
}

/**
 * Response from the Wortal API that contains the ad units for Facebook.
 * @hidden
 */
export interface AdUnitsResponse_Facebook {
    ads: AdUnit_Facebook[];
}

/**
 * Ad instance on Facebook. This is used to load and show ads.
 * @hidden
 */
export interface AdInstance_Facebook {
    getPlacementID(): string;
    loadAsync(): Promise<void>;
    showAsync(): Promise<void>;
}
