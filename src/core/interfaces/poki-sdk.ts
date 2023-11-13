/**
 * Poki SDK interface
 * @hidden
 */
export interface PokiSDK {
    init(): Promise<void>;
    gameLoadingFinished(): void;
    gameplayStart(): void;
    gameplayStop(): void;
    commercialBreak(beforeAd: () => void): Promise<void>;
    rewardedBreak(beforeAd: () => void): Promise<boolean>;
    shareableURL(params: Record<string, unknown>): Promise<string>;
    getURLParam(param: string): string;
}
