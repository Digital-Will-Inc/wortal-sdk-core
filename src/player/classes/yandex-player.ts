import { YandexPlayerObject } from "../../core/interfaces/yandex-sdk";
import { rethrowError_Yandex } from "../../errors/error-handler";
import Wortal from "../../index";
import { delayUntilConditionMet } from "../../utils/wortal-utils";
import { PlayerData } from "../interfaces/player-data";
import { Player } from "./player";

/**
 * Represents a Yandex player.
 * @hidden
 */
export class YandexPlayer extends Player {
    // This is used to call the player API within the Yandex SDK. We store a reference
    // to this object because there appears to be some initialization logic that occurs when we call for it, and
    // we don't want to repeat that logic every time we need to call the player API.
    private _playerObject!: YandexPlayerObject;

    constructor() {
        super();
    }

    /**
     * Gets the Yandex player object.
     * @hidden
     */
    get playerObject(): YandexPlayerObject {
        return this._playerObject;
    }

    public override async initialize(): Promise<void> {
        await this._setPlayerObject()
            .then(() => {
                const playerData: PlayerData = {
                    id: this._playerObject.getUniqueID(),
                    name: this._playerObject.getName(),
                    photo: this._playerObject.getPhoto("medium"), //TODO: check if this is the right size
                    isFirstPlay: false,
                    daysSinceFirstPlay: 0,
                };

                this._data = playerData;
            })
            .catch((error: any) => {
                throw rethrowError_Yandex(error, "initializeImpl");
            });
    }

    private async _setPlayerObject(): Promise<void> {
        if (typeof this._playerObject !== "undefined") {
            return;
        }

        // This might be called before the platform SDK is available.
        if (typeof Wortal._internalPlatformSDK === "undefined") {
            await delayUntilConditionMet(() => typeof Wortal._internalPlatformSDK !== "undefined",
                "Waiting for Wortal._internalPlatformSDK to be defined.");
        }

        await Wortal._internalPlatformSDK.getPlayer()
            .then((playerObject: YandexPlayerObject) => {
                this._playerObject = playerObject;
            })
            .catch((error: any) => {
                throw rethrowError_Yandex(error, "_setPlayerObject");
            });
    }
}
