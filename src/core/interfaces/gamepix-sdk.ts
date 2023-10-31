import { AdResult_GamePix } from "../../ads/interfaces/gamepix-ads";

/**
 * GamePix SDK interface
 * @hidden
 */
export interface GamePixSDK {
    interstitialAd(): Promise<AdResult_GamePix>;
    rewardAd(): Promise<AdResult_GamePix>;
    updateLevel(level: number): void;
    updateScore(score: number): void;
    lang(): string;
    happyMoment(): void;
}
