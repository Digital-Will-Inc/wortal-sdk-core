import { Leaderboard, LeaderboardEntry } from "../classes/leaderboard";
import {
    facebookLeaderboardEntryToWortal,
    facebookLeaderboardToWortal,
    rakutenLeaderboardEntryToWortal,
    rakutenLeaderboardToWortal
} from "../utils/converters";
import { invalidParams, notSupported, rethrowPlatformError } from "../utils/error-handler";
import { isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Gets the leaderboard with the given name. Access the leaderboard API via the Leaderboard returned here.
 * @example
 * Wortal.leaderboard.getLeaderboardAsync('global')
 *  .then(leaderboard => console.log(leaderboard.name()));
 * @param name Name of the leaderboard.
 * @returns {Promise<Leaderboard>} A promise that resolves with the matching leaderboard, rejecting if one is not found.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>LEADERBOARD_NOT_FOUND</li>
 * <li>NETWORK_FAILURE</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * <li>INVALID_OPERATION</li>
 * <li>INVALID_PARAM</li>
 * </ul>
 */
export function getLeaderboardAsync(name: string): Promise<Leaderboard> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(name)) {
            throw invalidParams("name cannot be null or empty.", "leaderboard.getLeaderboardAsync");
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.getLeaderboardAsync(name)
                .then((result: any) => {
                    if (platform === "link" || platform === "viber") {
                        return rakutenLeaderboardToWortal(result);
                    } else if (platform === "facebook") {
                        return facebookLeaderboardToWortal(result);
                    }
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "leaderboard.getLeaderboardAsync");
                });
        } else {
            throw notSupported("Leaderboard API not currently supported on platform: " + platform, "leaderboard.getLeaderboardAsync");
        }
    });
}

/**
 * Updates the player's score. If the player has an existing score, the old score will only be replaced if the new
 * score is better than it. NOTE: If the leaderboard is associated with a specific context, the game must be in that
 * context to set a score for the player.
 * @example
 * Wortal.leaderboard.sendEntryAsync('global', 100);
 * @param name Name of the leaderboard.
 * @param score Score for the entry. Must be a 64-bit integer number.
 * @param details Optional metadata to associate with the stored score. Must be less than 2KB in size.
 * @returns {Promise<LeaderboardEntry>} Resolves with the current leaderboard entry for the player after the update.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>LEADERBOARD_WRONG_CONTEXT</li>
 * <li>NETWORK_FAILURE</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * <li>INVALID_PARAM</li>
 * <li>INVALID_OPERATION</li>
 * <li>RATE_LIMITED</li>
 * </ul>
 */
export function sendEntryAsync(name: string, score: number, details: string = ""): Promise<LeaderboardEntry> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(name)) {
            throw invalidParams("name cannot be null or empty.", "leaderboard.sendEntryAsync");
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.getLeaderboardAsync(name)
                .then((leaderboard: any) => leaderboard.setScoreAsync(score, details))
                .then((entry: any) => {
                    if (platform === "link" || platform === "viber") {
                        return rakutenLeaderboardEntryToWortal(entry);
                    } else if (platform === "facebook") {
                        return facebookLeaderboardEntryToWortal(entry);
                    }
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "leaderboard.sendEntryAsync");
                });
        } else {
            throw notSupported("Leaderboard API not currently supported on platform: " + platform, "leaderboard.sendEntryAsync");
        }
    });
}

/**
 * Retrieves a set of leaderboard entries, ordered by score ranking in the leaderboard.
 * @example
 * Wortal.leaderboard.getEntriesAsync('global', 10)
 *  .then(entries => console.log(entries));
 * @param name Name of the leaderboard.
 * @param count Number of entries to get.
 * @param offset Offset from the first entry (top rank) to start the count from. Default is 0.
 * @returns {Promise<LeaderboardEntry[]>} Resolves with the leaderboard entries that match the query.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>NETWORK_FAILURE</li>
 * <li>RATE_LIMITED</li>
 * </ul>
 */
export function getEntriesAsync(name: string, count: number, offset: number = 0): Promise<LeaderboardEntry[]> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(name)) {
            throw invalidParams("name cannot be null or empty.", "leaderboard.getEntriesAsync");
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.getLeaderboardAsync(name)
                .then((leaderboard: any) => leaderboard.getEntriesAsync(count, offset))
                .then((entries: any) => {
                    return entries.map((entry: any) => {
                        if (platform === "link" || platform === "viber") {
                            return rakutenLeaderboardEntryToWortal(entry);
                        } else if (platform === "facebook") {
                            return facebookLeaderboardEntryToWortal(entry);
                        }
                    })
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "leaderboard.getEntriesAsync");
                });
        } else {
            throw notSupported("Leaderboard API not currently supported on platform: " + platform, "leaderboard.getEntriesAsync");
        }
    });
}

/**
 * Retrieves the leaderboard's entry for the current player, or null if the player has not set one yet.
 * @example
 * Wortal.leaderboard.getPlayerEntryAsync('global')
 *  .then(entry => console.log(entry.rank()));
 * @param name Name of the leaderboard.
 * @returns {Promise<LeaderboardEntry>} Resolves with the current leaderboard entry for the player.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>INVALID_OPERATION</li>
 * <li>NETWORK_FAILURE</li>
 * <li>RATE_LIMITED</li>
 * </ul>
 */
export function getPlayerEntryAsync(name: string): Promise<LeaderboardEntry> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(name)) {
            throw invalidParams("name cannot be null or empty.", "leaderboard.getPlayerEntryAsync");
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.getLeaderboardAsync(name)
                .then((leaderboard: any) => leaderboard.getPlayerEntryAsync())
                .then((entry: any) => {
                    if (platform === "link" || platform === "viber") {
                        return rakutenLeaderboardEntryToWortal(entry);
                    } else if (platform === "facebook") {
                        return facebookLeaderboardEntryToWortal(entry);
                    }
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "leaderboard.getPlayerEntryAsync");
                });
        } else {
            throw notSupported("Leaderboard API not currently supported on platform: " + platform, "leaderboard.getPlayerEntryAsync");
        }
    });
}

/**
 * Gets the total number of entries in the leaderboard.
 * @example
 * Wortal.leaderboard.getEntryCountAsync('global')
 *  .then(entries => console.log(entries));
 * @param name Name of the leaderboard.
 * @returns {Promise<number>} Number of entries.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>NETWORK_FAILURE</li>
 * <li>RATE_LIMITED</li>
 * </ul>
 */
export function getEntryCountAsync(name: string): Promise<number> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(name)) {
            throw invalidParams("name cannot be null or empty.", "leaderboard.getEntryCountAsync");
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.getLeaderboardAsync(name)
                .then((leaderboard: any) => leaderboard.getEntryCountAsync())
                .then((count: any) => {
                    return count;
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "leaderboard.getEntryCountAsync");
                });
        } else {
            throw notSupported("Leaderboard API not currently supported on platform: " + platform, "leaderboard.getEntryCountAsync");
        }
    });
}

/**
 * Retrieves the leaderboard score entries of the current player's connected players (including the current player),
 * ordered by local rank within the set of connected players.
 * @example
 * Wortal.leaderboard.getConnectedPlayersEntriesAsync('global')
 *  .then(entries => console.log(entries));
 * @param name Name of the leaderboard.
 * @param count Number of entries to get.
 * @param offset Offset from the first entry (top rank) to start the count from. Default is 0.
 * @returns {Promise<LeaderboardEntry[]>} Resolves with the leaderboard entries that match the query.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>NETWORK_FAILURE</li>
 * <li>RATE_LIMITED</li>
 * </ul>
 */
export function getConnectedPlayersEntriesAsync(name: string, count: number, offset: number): Promise<LeaderboardEntry[]> {
    const platform = config.session.platform;
    return Promise.resolve().then(() => {
        if (!isValidString(name)) {
            throw invalidParams("name cannot be null or empty.", "leaderboard.getConnectedPlayersEntriesAsync");
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return (window as any).wortalGame.getLeaderboardAsync(name)
                .then((leaderboard: any) => leaderboard.getConnectedPlayerEntriesAsync(count, offset))
                .then((entries: any) => {
                    return entries.map((entry: any) => {
                        if (platform === "link" || platform === "viber") {
                            return rakutenLeaderboardEntryToWortal(entry);
                        } else if (platform === "facebook") {
                            return facebookLeaderboardEntryToWortal(entry);
                        }
                    })
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "leaderboard.getConnectedPlayersEntriesAsync");
                });
        } else {
            throw notSupported("Leaderboard API not currently supported on platform: " + platform, "leaderboard.getConnectedPlayersEntriesAsync");
        }
    });
}
