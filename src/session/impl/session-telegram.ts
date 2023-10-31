import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { detectDevice } from "../../utils/wortal-utils";
import { TrafficSource } from "../interfaces/traffic-source";
import { SessionBase } from "../session-base";
import { Device } from "../types/session-types";

/**
 * Telegram implementation of Session API.
 * @hidden
 */
export class SessionTelegram extends SessionBase {
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
        return detectDevice();
    }

    protected getEntryPointAsyncImpl(): Promise<string> {
        return Promise.reject(notSupported(undefined, WORTAL_API.SESSION_GET_ENTRY_POINT_ASYNC, API_URL.SESSION_GET_ENTRY_POINT_ASYNC));
    }

    protected getEntryPointDataImpl(): Record<string, unknown> {
        return {};
    }

    protected getLocaleImpl(): string {
        // Telegram app locale doesn't always match navigator.language. They have an async API to get the locale, but
        // getLocale is not asyc. So we fetch the locale on initialization and store it in the session object so that
        // we can return it synchronously later.
        return Wortal.session._internalSession.locale;
    }

    protected getTrafficSourceImpl(): TrafficSource {
        return {};
    }

    protected happyTimeImpl(): void {
        return;
    }

    protected setSessionDataImpl(data: Record<string, unknown>): void {
        return;
    }

    protected switchGameAsyncImpl(gameID: string, data?: object): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.SESSION_SWITCH_GAME_ASYNC, API_URL.SESSION_SWITCH_GAME_ASYNC));
    }

    protected _gameLoadingStartImpl(): void {
        return Wortal.session._internalGameState.startGameLoadTimer();
    }

    protected _gameLoadingStopImpl(): void {
        return Wortal.session._internalGameState.stopGameLoadTimer();
    }

}
