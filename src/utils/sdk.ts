import AdConfig from "../models/ad-config";
import Player from "../models/player";
import Session from "../models/session";
import GameState from "../models/game-data";

/**
 * SDK data for the current session. Access to adConfig, game state, player and session properties are given
 * via this class.
 */
export default class SDKData {
    // We can't instantiate these in the constructor because that gets called before the Wortal backend script
    // is downloaded. These rely on some functions in that script to initialize, so we delay until Wortal.init
    // to initialize these.
    private _adConfig!: AdConfig;
    private _game!: GameState;
    private _player!: Player;
    private _session!: Session;

    /**
     * Initializes the SDKData.
     */
    init(): void {
        this._session = new Session();
        this._game = new GameState();
    }

    /**
     * Late initialization call that is platform dependent. We call this late because we need to give the platform
     * SDKs time to be initialized before we can access their API.
     */
    lateInit(): void {
        this._player = new Player().init();
        this._adConfig = new AdConfig();
    }

    /**
     * AdConfig API
     */
    get adConfig(): AdConfig {
        return this._adConfig;
    }

    /**
     * GameState API
     */
    get game(): GameState {
        return this._game;
    }

    /**
     * Player data API
     */
    get player(): Player {
        return this._player;
    }

    /**
     * Session data API
     */
    get session(): Session {
        return this._session;
    }
}
