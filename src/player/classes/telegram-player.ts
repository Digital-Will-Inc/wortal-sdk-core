import { TELEGRAM_API } from "../../data/core-data";
import Wortal from "../../index";
import { generateRandomID, waitForTelegramCallback } from "../../utils/wortal-utils";
import { ITelegramPlayer } from "../interfaces/telegram-player";
import { Player } from "./player";

/**
 * Represents a Telegram player.
 * @hidden
 */
export class TelegramPlayer extends Player {
    public override async initialize(): Promise<void> {
        let tgPlayer: ITelegramPlayer | null = null;
        try {
            tgPlayer = await this._initializeTelegramPlayer();
        } catch (error) {
            Wortal._log.exception("Error initializing Telegram player: ", error);
        }

        this._data.id = tgPlayer?.id || generateRandomID();
        this._data.name = tgPlayer?.username || "Player";
        this._data.photo = "https://storage.googleapis.com/html5gameportal.com/images/avatar.jpg";

        Wortal._log.debug("Player initialized: ", this._data);
    }

    private async _initializeTelegramPlayer(): Promise<ITelegramPlayer> {
        const defaultPlayer: ITelegramPlayer = {
            id: generateRandomID(),
            username: "Player",
        };

        window.parent.postMessage({playdeck: {method: TELEGRAM_API.GET_USER}}, "*");

        await waitForTelegramCallback(TELEGRAM_API.GET_USER)
            .then((player: ITelegramPlayer) => {
                return player;
            })
            .catch((error: any) => {
                Wortal._log.exception("Error fetching Telegram player: ", error);
            });

        return defaultPlayer;
    }

}
