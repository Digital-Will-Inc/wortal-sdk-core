import { Leaderboard, LeaderboardEntry } from "../classes/leaderboard";
import Wortal from "../index";
import {
    facebookLeaderboardEntryToWortal,
    facebookLeaderboardToWortal,
    rakutenLeaderboardEntryToWortal,
    rakutenLeaderboardToWortal
} from "../utils/converters";
import { invalidOperation, invalidParams, notSupported, rethrowPlatformError } from "../utils/error-handler";
import { isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Fetch a specific leaderboard belonging to this game.
 * @example
 * Wortal.leaderboard.getLeaderboardAsync('global')
 *  .then(leaderboard => console.log(leaderboard.name()));
 * @param name The name of the leaderboard. Each leaderboard for a game must have its own distinct name.
 * @returns {Promise<Leaderboard>} Promise that resolves with the matching leaderboard, rejecting if one is not found.
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
            throw invalidParams("name cannot be null or empty. Please provide a valid string for the name parameter.",
                "leaderboard.getLeaderboardAsync",
                "https://sdk.html5gameportal.com/api/leaderboard/#parameters_3");
        }

        if (platform === "facebook") {
            const id = Wortal.context.getId();
            if (!isValidString(id)) {
                throw invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                    "leaderboard.getLeaderboardAsync",
                    "https://sdk.html5gameportal.com/api/leaderboard/");
            }
            name += `.${id}`;
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.getLeaderboardAsync(name)
                .then((result: any) => {
                    if (platform === "link" || platform === "viber") {
                        return rakutenLeaderboardToWortal(result);
                    } else if (platform === "facebook") {
                        return facebookLeaderboardToWortal(result);
                    }
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e,
                        "leaderboard.getLeaderboardAsync",
                        "https://sdk.html5gameportal.com/api/leaderboard/#getleaderboardasync");
                });
        } else {
            throw notSupported(`Leaderboard API not currently supported on platform: ${platform}`,
                "leaderboard.getLeaderboardAsync");
        }
    });
}

/**
 * Updates the player's score. If the player has an existing score, the old score will only be replaced if the new
 * score is better than it. NOTE: If the leaderboard is associated with a specific context, the game must be in that
 * context to set a score for the player.
 * @example
 * Wortal.leaderboard.sendEntryAsync('global', 100);
 * @param name The name of the leaderboard.
 * @param score Score for the entry. Must be a 64-bit integer number.
 * @param details Optional metadata to associate with the stored score. Must be less than 2KB in size.
 * @returns {Promise<LeaderboardEntry>} Promise that resolves with the current leaderboard entry for the player after the update.
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
            throw invalidParams("name cannot be null or empty. Please provide a valid string for the name parameter.",
                "leaderboard.sendEntryAsync",
                "https://sdk.html5gameportal.com/api/leaderboard/#parameters_5");
        }

        if (platform === "facebook") {
            const id = Wortal.context.getId();
            if (!isValidString(id)) {
                throw invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                    "leaderboard.sendEntryAsync",
                    "https://sdk.html5gameportal.com/api/leaderboard/");
            }
            name += `.${id}`;
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.getLeaderboardAsync(name)
                .then((leaderboard: any) => leaderboard.setScoreAsync(score, details))
                .then((entry: any) => {
                    if (platform === "link" || platform === "viber") {
                        return rakutenLeaderboardEntryToWortal(entry);
                    } else if (platform === "facebook") {
                        return facebookLeaderboardEntryToWortal(entry);
                    }
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e,
                        "leaderboard.sendEntryAsync",
                        "https://sdk.html5gameportal.com/api/leaderboard/#sendentryasync");
                });
        } else {
            throw notSupported(`Leaderboard API not currently supported on platform: ${platform}`,
                "leaderboard.sendEntryAsync");
        }
    });
}

/**
 * Retrieves a set of leaderboard entries, ordered by score ranking in the leaderboard.
 * @example
 * Wortal.leaderboard.getEntriesAsync('global', 10)
 *  .then(entries => console.log(entries));
 * @param name The name of the leaderboard.
 * @param count The number of entries to attempt to fetch from the leaderboard. Defaults to 10 if not specified.
 * Currently, up to a maximum of 100 entries may be fetched per query.
 * @param offset The offset from the top of the leaderboard that entries will be fetched from. Default is 0.
 * @returns {Promise<LeaderboardEntry[]>} Promise that resolves with the leaderboard entries that match the query.
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
            throw invalidParams("name cannot be null or empty. Please provide a valid string for the name parameter.",
                "leaderboard.getEntriesAsync",
                "https://sdk.html5gameportal.com/api/leaderboard/#parameters_1");
        }

        if (platform === "facebook") {
            const id = Wortal.context.getId();
            if (!isValidString(id)) {
                throw invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                    "leaderboard.getEntriesAsync",
                    "https://sdk.html5gameportal.com/api/leaderboard/");
            }
            name += `.${id}`;
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.getLeaderboardAsync(name)
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
                    throw rethrowPlatformError(e,
                        "leaderboard.getEntriesAsync",
                        "https://sdk.html5gameportal.com/api/leaderboard/#getentriesasync");
                });
        } else {
            throw notSupported(`Leaderboard API not currently supported on platform: ${platform}`,
                "leaderboard.getEntriesAsync");
        }
    });
}

/**
 * Retrieves the leaderboard's entry for the current player, or null if the player has not set one yet.
 * @example
 * Wortal.leaderboard.getPlayerEntryAsync('global')
 *  .then(entry => console.log(entry.rank()));
 * @param name The name of the leaderboard.
 * @returns {Promise<LeaderboardEntry>} Promise that resolves with the current leaderboard entry for the player.
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
            throw invalidParams("name cannot be null or empty. Please provide a valid string for the name parameter.",
                "leaderboard.getPlayerEntryAsync",
                "https://sdk.html5gameportal.com/api/leaderboard/#parameters_4");
        }

        if (platform === "facebook") {
            const id = Wortal.context.getId();
            if (!isValidString(id)) {
                throw invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                    "leaderboard.getPlayerEntryAsync",
                    "https://sdk.html5gameportal.com/api/leaderboard/");
            }
            name += `.${id}`;
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.getLeaderboardAsync(name)
                .then((leaderboard: any) => leaderboard.getPlayerEntryAsync())
                .then((entry: any) => {
                    if (platform === "link" || platform === "viber") {
                        return rakutenLeaderboardEntryToWortal(entry);
                    } else if (platform === "facebook") {
                        return facebookLeaderboardEntryToWortal(entry);
                    }
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e,
                        "leaderboard.getPlayerEntryAsync",
                        "https://sdk.html5gameportal.com/api/leaderboard/#getplayerentryasync");
                });
        } else {
            throw notSupported(`Leaderboard API not currently supported on platform: ${platform}`,
                "leaderboard.getPlayerEntryAsync");
        }
    });
}

/**
 * Gets the total number of entries in the leaderboard.
 * @example
 * Wortal.leaderboard.getEntryCountAsync('global')
 *  .then(entries => console.log(entries));
 * @param name The name of the leaderboard.
 * @returns {Promise<number>} Promise that resolves with the number of entries.
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
            throw invalidParams("name cannot be null or empty. Please provide a valid string for the name parameter.",
                "leaderboard.getEntryCountAsync",
                "https://sdk.html5gameportal.com/api/leaderboard/#parameters_2");
        }

        if (platform === "facebook") {
            const id = Wortal.context.getId();
            if (!isValidString(id)) {
                throw invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                    "leaderboard.getEntryCountAsync",
                    "https://sdk.html5gameportal.com/api/leaderboard/");
            }
            name += `.${id}`;
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.getLeaderboardAsync(name)
                .then((leaderboard: any) => leaderboard.getEntryCountAsync())
                .then((count: any) => {
                    return count;
                })
                .catch((e: any) => {
                    throw rethrowPlatformError(e,
                        "leaderboard.getEntryCountAsync",
                        "https://sdk.html5gameportal.com/api/leaderboard/#getentrycountasync");
                });
        } else {
            throw notSupported(`Leaderboard API not currently supported on platform: ${platform}`,
                "leaderboard.getEntryCountAsync");
        }
    });
}

/**
 * Retrieves the leaderboard score entries of the current player's connected players (including the current player),
 * ordered by local rank within the set of connected players.
 * @example
 * Wortal.leaderboard.getConnectedPlayersEntriesAsync('global')
 *  .then(entries => console.log(entries));
 * @param name The name of the leaderboard.
 * @param count The number of entries to attempt to fetch from the leaderboard. Defaults to 10 if not specified.
 * Currently, up to a maximum of 100 entries may be fetched per query.
 * @param offset The offset from the set of ordered connected player score entries to fetch from.
 * @returns {Promise<LeaderboardEntry[]>} Promise that resolves with the leaderboard entries that match the query.
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
            throw invalidParams("name cannot be null or empty. Please provide a valid string for the name parameter.",
                "leaderboard.getConnectedPlayersEntriesAsync",
                "https://sdk.html5gameportal.com/api/leaderboard/#parameters");
        }

        if (platform === "facebook") {
            const id = Wortal.context.getId();
            if (!isValidString(id)) {
                throw invalidOperation("Global leaderboards are not supported on Facebook. Switch to a context before calling this API.",
                    "leaderboard.getConnectedPlayersEntriesAsync",
                    "https://sdk.html5gameportal.com/api/leaderboard/");
            }
            name += `.${id}`;
        }

        if (platform === "link" || platform === "viber" || platform === "facebook") {
            return config.platformSDK.getLeaderboardAsync(name)
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
                    throw rethrowPlatformError(e,
                        "leaderboard.getConnectedPlayersEntriesAsync",
                        "https://sdk.html5gameportal.com/api/leaderboard/#getconnectedplayersentriesasync");
                });
        } else {
            throw notSupported(`Leaderboard API not currently supported on platform: ${platform}`,
                "leaderboard.getConnectedPlayersEntriesAsync");
        }
    });
}
