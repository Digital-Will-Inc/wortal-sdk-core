import { AdInstance_Facebook } from "../../ads/interfaces/facebook-ads";
import { BannerPosition } from "../../ads/types/banner-position";
import { ChoosePayload } from "../../context/interfaces/choose-payload";
import { ContextSizeResponse } from "../../context/interfaces/context-size-response";
import { InvitePayload } from "../../context/interfaces/invite-payload";
import { LinkSharePayload } from "../../context/interfaces/link-share-payload";
import { SharePayload } from "../../context/interfaces/share-payload";
import { Product } from "../../iap/interfaces/product";
import { Purchase } from "../../iap/interfaces/purchase";
import { PurchaseConfig } from "../../iap/interfaces/purchase-config";
import { SubscribableProduct } from "../../iap/interfaces/subscribable-product";
import { Subscription } from "../../iap/interfaces/subscription";
import { Leaderboard_Facebook } from "../../leaderboard/interfaces/facebook-leaderboard";
import { ConnectedPlayerPayload } from "../../player/interfaces/connected-player-payload";
import { ConnectedPlayer_Facebook, SignedASID_Facebook, SignedPlayerInfo_Facebook } from "../../player/interfaces/facebook-player";
import { Device } from "../../session/types/session-types";
import { Tournament } from "../../tournament/classes/tournament";
import { CreateTournamentPayload } from "../../tournament/interfaces/create-tournament-payload";
import { FacebookTournament } from "../../tournament/interfaces/facebook-tournament";
import { ShareTournamentPayload } from "../../tournament/interfaces/share-tournament-payload";

/**
 * FB Instant Games SDK interface
 * @hidden
 */
export interface FacebookSDK {
    initializeAsync(): Promise<void>;
    startGameAsync(): Promise<void>;
    onPause(callback: () => void): void;
    setLoadingProgress(progress: number): void;
    performHapticFeedbackAsync(): Promise<void>;

    // Ads
    getInterstitialAdAsync(id: string): Promise<AdInstance_Facebook>;
    getRewardedVideoAsync(id: string): Promise<AdInstance_Facebook>;
    loadBannerAdAsync(id: string, position: BannerPosition): Promise<void>;

    // Context
    inviteAsync(payload: InvitePayload): Promise<void>;
    shareAsync(payload: SharePayload): Promise<void>;
    shareLinkAsyncImpl(payload: LinkSharePayload): Promise<void>;
    context: {
        chooseAsync(payload?: ChoosePayload): Promise<void>;
        createAsync(playerID?: string | string[]): Promise<void>;
        getID(): string;
        getPlayersAsync(): Promise<ConnectedPlayer_Facebook[]>;
        getType(): string;
        isSizeBetween(minSize: number, maxSize: number): ContextSizeResponse;
    };

    // IAP
    payments: {
        consumePurchaseAsync(token: string): Promise<void>;
        getCatalogAsync(): Promise<Product[]>;
        getPurchasesAsync(): Promise<Purchase[]>;
        getSubscribableCatalogAsync(): Promise<SubscribableProduct[]>;
        getSubscriptionsAsync(): Promise<Subscription[]>;
        purchaseAsync(purchaseConfig: PurchaseConfig): Promise<Purchase>;
        purchaseSubscribableAsync(purchaseConfig: PurchaseConfig): Promise<Purchase>;
        setProductListener(listener: (products: Product[]) => void): void;
        setPurchaseListener(listener: (purchases: Purchase[]) => void): void;
        setSubscriptionsListener(listener: (subscriptions: Subscription[]) => void): void;
        onReady(callback: () => void): void;
    };

    // Leaderboard
    getLeaderboardAsync(name: string): Promise<Leaderboard_Facebook>;

    // Player
    player: {
        canSubscribeBotAsync(): Promise<boolean>;
        flushDataAsync(): Promise<void>;
        getASIDAsync(): Promise<string>;
        getConnectedPlayersAsync(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer_Facebook[]>;
        getDataAsync(keys: string[]): Promise<any>;
        getID(): string;
        getName(): string;
        getPhoto(): string;
        getSignedASIDAsync(): Promise<SignedASID_Facebook>;
        getSignedPlayerInfoAsync(): Promise<SignedPlayerInfo_Facebook>;
        setDataAsync(data: Record<string, unknown>): Promise<void>;
        subscribeBotAsync(): Promise<void>;
    };

    // Session
    getEntryPointAsync(): Promise<string>;
    getEntryPointData(): Record<string, unknown>;
    getPlatform(): Device;
    setSessionData(data: Record<string, unknown>): void;
    switchGameAsync(gameID: string, data?: object): Promise<void>;

    // Tournament
    tournament: {
        createAsync(payload: CreateTournamentPayload): Promise<Tournament>;
        getTournamentsAsync(): Promise<FacebookTournament[]>;
        joinAsync(tournamentID: string): Promise<void>;
        postScoreAsync(score: number, extraData?: string): Promise<void>;
        shareAsync(payload: ShareTournamentPayload): Promise<void>;
    }
}
