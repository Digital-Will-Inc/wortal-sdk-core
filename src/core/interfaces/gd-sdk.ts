import { AdType } from "../../ads/types/ad-type";

/**
 * Game Distribution (GD) SDK interface
 * @hidden
 */
export interface GDSDK {
    preloadAd(type: AdType): Promise<void>;
    showAd(type: AdType): Promise<void>;
}
