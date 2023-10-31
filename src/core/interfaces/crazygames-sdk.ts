import { AdCallbacks_CrazyGames } from "../../ads/interfaces/crazygames-ads";
import { AuthResponse_CrazyGames } from "../../auth/interfaces/crazygames-auth";
import { Error_CrazyGames } from "../../errors/types/crazygames-error-types";
import { ICrazyGamesPlayer } from "../../player/interfaces/crazygames-player";

/**
 * CrazyGames SDK interface
 * @hidden
 */
export interface CrazyGamesSDK {
    ad: {
        hasAdblock(callback: (error: Error_CrazyGames, result: any) => void): boolean;
        requestAd(type: string, callbacks: AdCallbacks_CrazyGames): void;
    };
    game: {
        inviteLink(data: any, callback: (error: Error_CrazyGames, link: string) => void): void;
        gameplayStart(): void;
        gameplayStop(): void;
        sdkGameLoadingStart(): void;
        sdkGameLoadingStop(): void;
        happytime(): void;
    };
    user: {
        showAuthPrompt(callback: (error: Error_CrazyGames, user: ICrazyGamesPlayer) => void): void;
        showAccountLinkPrompt(callback: (error: Error_CrazyGames, response: AuthResponse_CrazyGames) => void): void;
        isUserAccountAvailable(callback: (error: Error_CrazyGames, result: boolean) => void): void;
        getUser(callback: (error: Error_CrazyGames, user: ICrazyGamesPlayer) => void): void;
        getUserToken(callback: (error: Error_CrazyGames, token: string) => void): void;
    };
}
