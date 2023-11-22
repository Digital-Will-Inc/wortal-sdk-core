import { rethrowError_CrazyGames } from "../../errors/error-handler";
import { ErrorMessage } from "../../errors/interfaces/error-message";
import { Error_CrazyGames } from "../../errors/types/crazygames-error-types";
import Wortal from "../../index";
import { delayUntilConditionMet, generateRandomID } from "../../utils/wortal-utils";
import { ICrazyGamesPlayer } from "../interfaces/crazygames-player";
import { Player } from "./player";

/**
 * Represents a CrazyGames player.
 * @hidden
 */
export class CrazyGamesPlayer extends Player {
    constructor(player?: ICrazyGamesPlayer) {
        super();
        this._data.id = player?.id || generateRandomID();
        this._data.name = player?.username || "Player";
        this._data.photo = player?.profilePictureUrl || "https://images.crazygames.com/userportal/avatars/4.png";
    }

    public override async initialize(): Promise<void> {
        let cgPlayer: ICrazyGamesPlayer | null = null;
        try {
            cgPlayer = await this._initializeCrazyGamesPlayer();
        } catch (error) {
            Wortal._log.exception("Error initializing CrazyGames player: ", error);
        }

        this._data.id = cgPlayer?.id || generateRandomID();
        this._data.name = cgPlayer?.username || "Player";
        this._data.photo = cgPlayer?.profilePictureUrl || "https://images.crazygames.com/userportal/avatars/4.png";

        Wortal._log.debug("Player initialized: ", this._data);
        return Promise.resolve();
    }

    private async _initializeCrazyGamesPlayer(): Promise<ICrazyGamesPlayer> {
        let isUserAPIAvailable: boolean = false;
        const defaultPlayer: ICrazyGamesPlayer = {
            id: generateRandomID(),
            username: "Player",
            profilePictureUrl: "https://images.crazygames.com/userportal/avatars/4.png",
        };

        // The CrazyGames SDK takes a little longer to initialize than the others, so we have to wait for it here.
        if (typeof Wortal._internalPlatformSDK === "undefined") {
            await delayUntilConditionMet(() => {
                return typeof Wortal._internalPlatformSDK !== "undefined";
            }, "Waiting for CrazyGames SDK to load...");
        }

        await this._checkIsUserAPIAvailable()
            .then((isAvailable: boolean) => {
                isUserAPIAvailable = isAvailable;
            })
            .catch((error: ErrorMessage) => {
                Wortal._log.exception(`Error checking if user API is available: ${error.message}`);
            });

        if (isUserAPIAvailable) {
            await this._fetchCrazyGamesPlayer()
                .then((player: ICrazyGamesPlayer) => {
                    return player;
                })
                .catch((error: ErrorMessage) => {
                    Wortal._log.exception(`Error fetching CrazyGames player: ${error.message}`);
                });
        }

        return defaultPlayer;
    }

    private _checkIsUserAPIAvailable(): Promise<boolean> {
        return new Promise((resolve) => {
            const callback = (error: Error_CrazyGames, isAvailable: boolean) => {
                if (error) {
                    rethrowError_CrazyGames(error, "isUserAccountAvailable");
                } else {
                    Wortal._log.debug("User API available: ", isAvailable);
                    resolve(isAvailable);
                }
            };

            Wortal._internalPlatformSDK.user.isUserAccountAvailable(callback);
        });
    }

    private _fetchCrazyGamesPlayer(): Promise<any> {
        return new Promise((resolve) => {
            const callback = (error: Error_CrazyGames, player: ICrazyGamesPlayer) => {
                if (error) {
                    rethrowError_CrazyGames(error, "getUser");
                } else {
                    Wortal._log.debug("CrazyGames player fetched:", player);
                    resolve(player);
                }
            };

            Wortal._internalPlatformSDK.user.getUser(callback);
        });
    }

}
