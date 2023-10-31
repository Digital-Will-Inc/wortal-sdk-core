import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { delayUntilConditionMet, detectDevice, getAllQueryParameters } from "../../utils/wortal-utils";
import { TrafficSource } from "../interfaces/traffic-source";
import { SessionBase } from "../session-base";
import { Device } from "../types/session-types";

/**
 * CrazyGames implementation of Session API.
 * @hidden
 */
export class SessionCrazyGames extends SessionBase {
    constructor() {
        super();
    }

    protected gameplayStartImpl(): void {
        return window.Wortal._internalPlatformSDK.game.gameplayStart();
    }

    protected gameplayStopImpl(): void {
        return window.Wortal._internalPlatformSDK.game.gameplayStop();
    }

    protected getDeviceImpl(): Device {
        return detectDevice();
    }

    protected getEntryPointAsyncImpl(): Promise<string> {
        throw notSupported(undefined, WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC, API_URL.SESSION_GET_ENTRY_POINT_ASYNC);
    }

    protected getEntryPointDataImpl(): Record<string, unknown> {
        return getAllQueryParameters();
    }

    protected getLocaleImpl(): string {
        return navigator.language;
    }

    protected getTrafficSourceImpl(): TrafficSource {
        return {};
    }

    protected happyTimeImpl(): void {
        return window.Wortal._internalPlatformSDK.game.happytime();
    }

    protected setSessionDataImpl(data: Record<string, unknown>): void {
        return;
    }

    protected switchGameAsyncImpl(gameID: string, data?: object): Promise<void> {
        throw notSupported(undefined, WORTAL_API.SESSION_SWITCH_GAME_ASYNC, API_URL.SESSION_SWITCH_GAME_ASYNC);
    }

    protected _gameLoadingStartImpl(): void {
        if (!window.Wortal._internalIsPlatformInitialized) {
            delayUntilConditionMet(() => window.Wortal._internalIsPlatformInitialized).then(() => {
                return window.Wortal._internalPlatformSDK.game.sdkGameLoadingStart();
            });
        } else {
            return window.Wortal._internalPlatformSDK.game.sdkGameLoadingStart();
        }
    }

    protected _gameLoadingStopImpl(): void {
        return window.Wortal._internalPlatformSDK.game.sdkGameLoadingStop();
    }

}
