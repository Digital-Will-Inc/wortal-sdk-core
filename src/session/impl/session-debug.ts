import Wortal from "../../index";
import { detectDevice } from "../../utils/wortal-utils";
import { TrafficSource } from "../interfaces/traffic-source";
import { SessionBase } from "../session-base";
import { Device } from "../types/session-types";

/**
 * Debug implementation of Session API.
 * @hidden
 */
export class SessionDebug extends SessionBase {
    protected gameplayStartImpl(): void {
        return;
    }

    protected gameplayStopImpl(): void {
        return;
    }

    protected getDeviceImpl(): Device {
        return detectDevice();
    }

    protected getEntryPointAsyncImpl(): Promise<string> {
        return Promise.resolve("debug");
    }

    protected getEntryPointDataImpl(): Record<string, unknown> {
        return {
            "referral_id": "debug",
            "bonus_data": "debug",
        };
    }

    protected getLocaleImpl(): string {
        return navigator.language;
    }

    protected getTrafficSourceImpl(): TrafficSource {
        return {
            "r_entrypoint": "debug",
            "utm_source": "debug",
        };
    }

    protected happyTimeImpl(): void {
        return;
    }

    protected setSessionDataImpl(data: Record<string, unknown>): void {
        return;
    }

    protected switchGameAsyncImpl(gameID: string, data?: object): Promise<void> {
        return Promise.resolve();
    }

    protected _gameLoadingStartImpl(): void {
        Wortal.session._internalGameState.startGameLoadTimer();
    }

    protected _gameLoadingStopImpl(): void {
        Wortal.session._internalGameState.stopGameLoadTimer();
    }

}
