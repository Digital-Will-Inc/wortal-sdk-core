import { API_URL, TELEGRAM_API, WORTAL_API } from "../../data/core-data";
import { notSupported, operationFailed } from "../../errors/error-handler";
import Wortal from "../../index";
import { debug } from "../../utils/logger";
import { isValidString } from "../../utils/validators";
import { delayUntilConditionMet, waitForTelegramCallback } from "../../utils/wortal-utils";
import { ConnectedPlayer } from "../classes/connected-player";
import { Player } from "../classes/player";
import { TelegramPlayer } from "../classes/telegram-player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import { SignedASID } from "../interfaces/facebook-player";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";

/**
 * Telegram implementation of the Player API.
 * @hidden
 */
export class PlayerTelegram extends PlayerBase {
    protected _player: Player;

    constructor() {
        super();
        this._player = new TelegramPlayer();
    }

    protected canSubscribeBotAsyncImpl(): Promise<boolean> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC));
    }

    protected flushDataAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_FLUSH_DATA_ASYNC, API_URL.PLAYER_FLUSH_DATA_ASYNC));
    }

    protected getASIDAsyncImpl(): Promise<string> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_ASID_ASYNC, API_URL.PLAYER_GET_ASID_ASYNC));
    }

    protected getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC, API_URL.PLAYER_GET_CONNECTED_PLAYERS_ASYNC));
    }

    protected getDataAsyncImpl(keys: string[]): Promise<any> {
        // Telegram has a 10kb limit on the size of data that can be stored in a single kvp. To work around this,
        // we split the data into chunks and store each chunk in a separate kvp. We also store the number of chunks
        // in a separate kvp so that we know how many chunks to retrieve when we want to get the data.
        // We build a JSON string from the chunks, parse it, then return the requested keys from the resulting object.

        let chunkCount: number = 0;
        let chunks: string[] = [];

        const requestData = (key: string) => {
            window.parent.postMessage({playdeck: {method: TELEGRAM_API.GET_DATA, key,}}, "*");
        }

        const getDataCallback = ({data}: any) => {
            if (data?.playdeck?.method === TELEGRAM_API.GET_DATA) {
                // Key is: ${config.session.gameId}-save-data-${i}

                const index: number = parseInt(data.playdeck.key.split("-").pop() as string);
                if (isNaN(index)) {
                    return Promise.reject(operationFailed("Error parsing chunk index.", WORTAL_API.PLAYER_GET_DATA_ASYNC));
                }

                chunks[index] = data.playdeck.value.data;
            }
        }

        const fetchAndBuildData = async () => {
            // First get the chunkCount so that we know how many chunks to retrieve.
            requestData(`${Wortal.session._internalSession.gameID}-save-data-chunkCount`);

            const chunkCountData = await waitForTelegramCallback(TELEGRAM_API.GET_DATA);
            if (typeof chunkCountData === "undefined") {
                return Promise.reject(operationFailed("Error getting chunkCount from storage.", WORTAL_API.PLAYER_GET_DATA_ASYNC));
            }

            // Now get each chunk and store it in an array to build the data string with.
            chunkCount = parseInt(chunkCountData.data);
            if (isNaN(chunkCount)) {
                return Promise.reject(operationFailed("Error parsing chunkCount.", WORTAL_API.PLAYER_GET_DATA_ASYNC));
            }

            chunks = Array(chunkCount).fill("");
            window.addEventListener("message", getDataCallback);

            for (let i = 0; i < chunkCount; i++) {
                requestData(`${Wortal.session._internalSession.gameID}-save-data-${i}`);
            }

            // Wait for all chunks to be retrieved then clear the listener.
            await delayUntilConditionMet(() =>
                    chunks.every((chunk: string) => {
                        return isValidString(chunk);
                    }),
                "Waiting for chunks to be retrieved from storage.");

            window.removeEventListener("message", getDataCallback);

            // Now build the data string from the chunks and parse it.
            const dataString = chunks.join("");
            let dataObj = JSON.parse(dataString);

            // If the data is a string, parse it again. This is necessary because the data is stringified twice
            // so the extra escape characters keep the data from being parsed into an object the first time.
            if (typeof dataObj === "string") {
                dataObj = JSON.parse(dataObj);
                // If we still don't have an object then something went wrong.
                if (typeof dataObj !== "object") {
                    return Promise.reject(operationFailed("Error parsing data chunks.", WORTAL_API.PLAYER_GET_DATA_ASYNC));
                }
            }

            // Return the requested keys from the data object.
            const result: any = {};
            keys.forEach((key) => {
                result[key] = dataObj[key];
            });

            return result;
        }

        return fetchAndBuildData()
            .catch((error: any) => {
                throw operationFailed(`Error getting object from storage: ${error.message}`, WORTAL_API.PLAYER_GET_DATA_ASYNC);
            });
    }

    protected getSignedASIDAsyncImpl(): Promise<SignedASID> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC, API_URL.PLAYER_GET_SIGNED_ASID_ASYNC));
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC, API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC));
    }

    protected getTokenAsyncImpl(): Promise<string> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_TOKEN_ASYNC, API_URL.PLAYER_GET_TOKEN_ASYNC));
    }

    protected setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        // Telegram has a 10kb limit on the size of data that can be stored in a single kvp. To work around this,
        // we split the data into chunks and store each chunk in a separate kvp. We also store the number of chunks
        // in a separate kvp so that we know how many chunks to retrieve when we want to get the data.

        const setData = (key: string, value: string) => {
            window.parent.postMessage({playdeck: {method: TELEGRAM_API.SET_DATA, key, value,}}, "*");
        }

        // We have to account for the escape characters that get added in the PlayDeck SDK after sending the data,
        // so we'll split the data into 8kb chunks instead of 10.
        const dataString = JSON.stringify(data);
        if (this._getStringSizeInBytes(dataString) > 8000) {
            const chunks: string[] = this._splitJSONStringIntoChunks(dataString);

            setData(`${Wortal.session._internalSession.gameID}-save-data-chunkCount`, chunks.length.toString());

            chunks.forEach((chunk: string, index: number) => {
                setData(`${Wortal.session._internalSession.gameID}-save-data-${index}`, chunk);
            });
        } else {
            setData(`${Wortal.session._internalSession.gameID}-save-data-chunkCount`, "1");
            setData(`${Wortal.session._internalSession.gameID}-save-data-0`, dataString);
        }

        debug("Saved data to Telegram storage.");
        return Promise.resolve();
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC));
    }

    private _getStringSizeInBytes(str: string): number {
        const encoder = new TextEncoder();
        const encodedString = encoder.encode(str);
        return encodedString.length;
    }

    /**
     * Splits a JSON string into chunks of a specified size. This is used to split large JSON strings into chunks that
     * can be sent in multiple requests.
     * @param jsonString JSON string to split into chunks.
     * @param chunkSizeInBytes Size of each chunk in bytes. Defaults to 8KB.
     * @returns {string[]} Array of JSON strings that are each smaller than the specified chunk size.
     * @hidden
     */
    private _splitJSONStringIntoChunks(jsonString: string, chunkSizeInBytes: number = 8000): string[] {
        const chunks: string[] = [];
        let currentChunk = "";
        let currentChunkSize = 0;

        for (let i = 0; i < jsonString.length; i++) {
            const char: string = jsonString[i];
            const charSize: number = this._getStringSizeInBytes(char);

            if (currentChunkSize + charSize > chunkSizeInBytes) {
                chunks.push(currentChunk);
                currentChunk = "";
                currentChunkSize = 0;
            }

            currentChunk += char;
            currentChunkSize += charSize;
        }

        if (currentChunk !== "") {
            chunks.push(currentChunk);
        }

        return chunks;
    }

}
