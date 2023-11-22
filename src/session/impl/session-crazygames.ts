import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { delayUntilConditionMet, detectDevice, getAllQueryParameters } from "../../utils/wortal-utils";
import { TrafficSource } from "../interfaces/traffic-source";
import { SessionBase } from "../session-base";
import { Device } from "../types/session-types";

/**
 * CrazyGames implementation of Session API.
 * @hidden
 */
export class SessionCrazyGames extends SessionBase {
    protected gameplayStartImpl(): void {
        return Wortal._internalPlatformSDK.game.gameplayStart();
    }

    protected gameplayStopImpl(): void {
        return Wortal._internalPlatformSDK.game.gameplayStop();
    }

    protected getDeviceImpl(): Device {
        return detectDevice();
    }

    protected getEntryPointAsyncImpl(): Promise<string> {
        return Promise.reject(notSupported(undefined, WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC, API_URL.SESSION_GET_ENTRY_POINT_ASYNC));
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
        return Wortal._internalPlatformSDK.game.happytime();
    }

    protected setSessionDataImpl(data: Record<string, unknown>): void {
        return;
    }

    protected switchGameAsyncImpl(gameID: string, data?: object): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.SESSION_SWITCH_GAME_ASYNC, API_URL.SESSION_SWITCH_GAME_ASYNC));
    }

    protected _gameLoadingStartImpl(): void {
        if (!Wortal._internalIsPlatformInitialized) {
            delayUntilConditionMet(() => Wortal._internalIsPlatformInitialized).then(() => {
                return Wortal._internalPlatformSDK.game.sdkGameLoadingStart();
            });
        } else {
            return Wortal._internalPlatformSDK.game.sdkGameLoadingStart();
        }
    }

    protected _gameLoadingStopImpl(): void {
        return Wortal._internalPlatformSDK.game.sdkGameLoadingStop();
    }

}
