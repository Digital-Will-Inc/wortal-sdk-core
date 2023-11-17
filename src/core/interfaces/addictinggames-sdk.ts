import { GetStatsPayload_AddictingGames } from "../../stats/interfaces/addictinggames-get-stats-payload";
import { StatConfig_AddictingGames } from "../../stats/interfaces/addictinggames-stat-config";

/**
 * AddictingGames SDK interface
 * @hidden
 */
export interface AddictingGamesSDK {
    on(event: string, callback: () => void): void;
    getInstance(options: object): AddictingGamesSDK;
    startSession(): Promise<void>;
    startGame(): Promise<void>;
    endGame(options: object): Promise<void>;
    showAd(): Promise<void>;
    getScoreCategories(): Promise<object>;
    getScores(options: GetStatsPayload_AddictingGames): Promise<StatConfig_AddictingGames[]>;
    postScore(level: string, score: number, options?: object): Promise<void>;
    postDailyScore(options: object): Promise<object>;
    hasDailyScore(options: object): Promise<object>;
    getAchievementCategories(): Promise<object>;
    postAchievement(achievement_key: string): Promise<void>;
    getUserAchievements(options: object): Promise<object>;
    postDatastore(options: object): Promise<object>;
    getUserDatastore(options: object): Promise<object>;
}
