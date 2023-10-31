import { AdInstance_Link_Viber, AdUnit_Link_Viber } from "../../ads/interfaces/rakuten-ads";
import { ChoosePayload } from "../../context/interfaces/choose-payload";
import { ContextSizeResponse } from "../../context/interfaces/context-size-response";
import { SharePayload } from "../../context/interfaces/share-payload";
import { UpdatePayload } from "../../context/interfaces/update-payload";
import { Leaderboard_Link } from "../../leaderboard/interfaces/link-leaderboard";
import { ConnectedPlayer_Link_Viber } from "../../player/interfaces/rakuten-player";
import { SignedPlayerInfo } from "../../player/interfaces/signed-player-info";

/**
 * Link SDK interface
 * @hidden
 */
export interface LinkSDK {
    // Core
    initializeAsync(): Promise<void>;
    startGameAsync(): Promise<void>;
    onPause(callback: () => void): void;
    setLoadingProgress(progress: number): void;

    // Ads
    getInterstitialAdAsync(id: string): Promise<AdInstance_Link_Viber>;
    getRewardedVideoAsync(id: string): Promise<AdInstance_Link_Viber>;
    getAdUnitsAsync(): Promise<AdUnit_Link_Viber[]>;

    // Context
    shareAsync(payload: SharePayload): Promise<void>;
    updateAsync(payload: UpdatePayload): Promise<void>;
    context: {
        chooseAsync(payload?: ChoosePayload): Promise<void>;
        createAsync(playerID?: string | string[]): Promise<void>;
        getID(): string;
        getPlayersAsync(): Promise<ConnectedPlayer_Link_Viber[]>;
        getType(): string;
        isSizeBetween(minSize: number, maxSize: number): ContextSizeResponse;
    };

    // Leaderboard
    getLeaderboardAsync(name: string): Promise<Leaderboard_Link>;

    // Player
    player: {
        flushDataAsync(): Promise<void>;
        getConnectedPlayersAsync(): Promise<ConnectedPlayer_Link_Viber[]>;
        getDataAsync(keys: string[]): Promise<any>;
        getSignedPlayerInfoAsync(): Promise<SignedPlayerInfo>;
        getID(): string;
        getName(): string;
        getPhoto(): string;
        hasPlayed(): boolean;
        setDataAsync(data: Record<string, unknown>): Promise<void>;
    };

    // Session
    getEntryPointAsync(): Promise<string>;
    getEntryPointData(): Record<string, unknown>;
    getTrafficSource(): string;
    getPlatform(): string;
}
