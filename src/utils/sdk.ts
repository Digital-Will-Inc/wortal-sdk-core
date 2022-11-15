import AdConfig from "../models/ad-config";
import Player from "../models/player";
import Session from "../models/session";
import GameState from "../models/game-data";

/** @hidden */
export default class SDKData {
    // We can't instantiate these in the constructor because that gets called before the Wortal backend script
    // is downloaded. These rely on some functions in that script to initialize, so we delay until Wortal.init
    // to initialize these.
    private _adConfig!: AdConfig;
    private _game!: GameState;
    private _player!: Player;
    private _session!: Session;

    private _isIAPEnabled: boolean = false;
    private _isInit: boolean = false;

    /** @hidden */
    init(): void {
        this._session = new Session();
        this._game = new GameState();
        this._isInit = true;
    }

    /** @hidden */
    lateInit(): void {
        // We call these late because they sometimes depend on a platform SDK to be initialized already so that we
        // can use the platform's API.
        this._player = new Player().init();
        this._adConfig = new AdConfig();
    }

    /** @hidden */
    get adConfig(): AdConfig {
        return this._adConfig;
    }

    /** @hidden */
    get game(): GameState {
        return this._game;
    }

    /** @hidden */
    get player(): Player {
        return this._player;
    }

    /** @hidden */
    get session(): Session {
        return this._session;
    }

    /** @hidden */
    get isIAPEnabled(): boolean {
        return this._isIAPEnabled;
    }

    /** @hidden */
    enableIAP(): void {
        this._isIAPEnabled = true;
    }

    /** @hidden */
    get isInit(): boolean {
        return this._isInit;
    }
}
