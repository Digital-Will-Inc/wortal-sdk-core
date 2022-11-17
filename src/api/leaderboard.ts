import Leaderboard from "../models/leaderboard";
import LeaderboardEntry from "../models/leaderboard-entry";
import { config } from "./index";

/**
 * Gets the leaderboard with the given name. Access the leaderboard API via the Leaderboard returned here.
 * @example
 * Wortal.leaderboard.getLeaderboardAsync('global')
 *  .then(leaderboard => console.log(leaderboard.name());
 * @param name Name of the leaderboard.
 */
export function getLeaderboardAsync(name: string): Promise<Leaderboard> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.getLeaderboardAsync(name)
            .then((result: any) => {
                return new Leaderboard(result.getName(), result.getName(), result.getContextID());
            })
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Sends an entry to be added to the leaderboard, or updated if already existing. Will only update if the score
 * is a higher than the player's previous entry.
 * @example
 * Wortal.leaderboard.sendEntryAsync('global', 100);
 * @param name Name of the leaderboard.
 * @param score Score for the entry.
 * @param details Optional additional details about the entry.
 * @returns The new entry if one was created, updated entry if the score is higher, or the old entry if no new
 * high score was achieved.
 */
export function sendEntryAsync(name: string, score: number, details: string = ""): Promise<LeaderboardEntry> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.getLeaderboardAsync(name)
            .then((leaderboard: any) => leaderboard.setScoreAsync(score, details))
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Gets a list of leaderboard entries in the leaderboard.
 * @example
 * Wortal.leaderboard.getEntriesAsync('global', 10)
 *  .then(entries => console.log(entries);
 * @param name Name of the leaderboard.
 * @param count Number of entries to get.
 * @param offset Offset from the first entry (top rank) to start the count from. Default is 0.
 * @returns Array of LeaderboardEntry.
 */
export function getEntriesAsync(name: string, count: number, offset: number = 0): Promise<LeaderboardEntry[]> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.getLeaderboardAsync(name)
            .then((leaderboard: any) => leaderboard.getEntriesAsync(count, offset))
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Gets the player's entry in the leaderboard.
 * @example
 * Wortal.leaderboard.getPlayerEntryAsync('global')
 *  .then(entry => console.log(entry.rank());
 * @param name Name of the leaderboard.
 * @returns LeaderboardEntry for the player.
 */
export function getPlayerEntryAsync(name: string): Promise<LeaderboardEntry> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.getLeaderboardAsync(name)
            .then((leaderboard: any) => leaderboard.getPlayerEntryAsync())
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Gets the total number of entries in the leaderboard.
 * @example
 * Wortal.leaderboard.getEntryCountAsync('global')
 *  .then(entries => console.log(entries);
 * @param name Name of the leaderboard.
 * @returns Number of entries.
 */
export function getEntryCountAsync(name: string): Promise<number> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.getLeaderboardAsync(name)
            .then((leaderboard: any) => leaderboard.getEntryCountAsync())
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + config.session.platform);
    }
}

/**
 * Gets a list of leaderboard entries of connected players in the leaderboard.
 * @example
 * Wortal.leaderboard.getConnectedPlayersEntriesAsync('global')
 *  .then(entries => console.log(entries);
 * @param name Name of the leaderboard.
 * @param count Number of entries to get.
 * @param offset Offset from the first entry (top rank) to start the count from. Default is 0.
 * @returns Array of LeaderboardEntry.
 */
export function getConnectedPlayersEntriesAsync(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
    if (config.session.platform === "link" || config.session.platform === "viber") {
        return (window as any).wortalGame.getLeaderboardAsync(name)
            .then((leaderboard: any) => leaderboard.getConnectedPlayerEntriesAsync(count, offset))
            .catch((error: any) => console.error(error));
    } else {
        return Promise.reject("[Wortal] Leaderboards not currently supported on platform: " + config.session.platform);
    }
}
