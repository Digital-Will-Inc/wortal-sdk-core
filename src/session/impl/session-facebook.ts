import { API_URL, WORTAL_API } from "../../data/core-data";
import { rethrowError_Facebook_Rakuten } from "../../errors/error-handler";
import { ErrorMessage_Facebook } from "../../errors/interfaces/facebook-error";
import Wortal from "../../index";
import { TrafficSource } from "../interfaces/traffic-source";
import { SessionBase } from "../session-base";
import { Device } from "../types/session-types";

/**
 * Facebook implementation of Session API.
 * @hidden
 */
export class SessionFacebook extends SessionBase {
    constructor() {
        super();
    }

    protected gameplayStartImpl(): void {
        return;
    }

    protected gameplayStopImpl(): void {
        return;
    }

    protected getDeviceImpl(): Device {
        return Wortal._internalPlatformSDK.getPlatform();
    }

    protected getEntryPointAsyncImpl(): Promise<string> {
        return Wortal._internalPlatformSDK.getEntryPointAsync()
            .then((entryPoint: string) => {
                return entryPoint;
            })
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC, API_URL.SESSION_GET_ENTRY_POINT_ASYNC);
            });
    }

    protected getEntryPointDataImpl(): Record<string, unknown> {
        return Wortal._internalPlatformSDK.getEntryPointData();
    }

    protected getLocaleImpl(): string {
        return navigator.language;
    }

    protected getTrafficSourceImpl(): TrafficSource {
        return {};
    }

    protected happyTimeImpl(): void {
        return;
    }

    protected setSessionDataImpl(data: Record<string, unknown>): void {
        return Wortal._internalPlatformSDK.setSessionData(data);
    }

    protected switchGameAsyncImpl(gameID: string, data?: object): Promise<void> {
        return Wortal._internalPlatformSDK.switchGameAsync(gameID, data)
            .catch((error: ErrorMessage_Facebook) => {
                throw rethrowError_Facebook_Rakuten(error, WORTAL_API.SESSION_SWITCH_GAME_ASYNC, API_URL.SESSION_SWITCH_GAME_ASYNC);
            });
    }

    protected _gameLoadingStartImpl(): void {
        return Wortal.session._internalGameState.startGameLoadTimer();
    }

    protected _gameLoadingStopImpl(): void {
        return Wortal.session._internalGameState.stopGameLoadTimer();
    }

}
