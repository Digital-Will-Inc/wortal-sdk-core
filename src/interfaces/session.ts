/**
 * Options to pass when initializing the Wortal SDK.
 */
export interface InitializationOptions {
    /** Enable or disable debug mode. Default is disabled. */
    debugMode?: boolean,
}

/** @hidden */
export interface TrafficSource {
    ['utm_source']?: string;
    ['r_entrypoint']?: string;
}

/** @hidden */
export interface GameData {
    gameTimer: number;
    levelName: string;
    levelTimer: number;
    levelTimerHandle: number;
}
