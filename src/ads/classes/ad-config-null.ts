import Wortal from "../../index";
import { AdConfig } from "./ad-config";

/**
 * Null implementation of AdConfig. This is used when a platform does not need ad unit IDs or any specific ad config
 * to display ads.
 * @hidden
 */
export class AdConfigNull extends AdConfig {
    constructor() {
        super();
    }

    public initialize(): Promise<void> {
        Wortal._log.debug("Initializing AdConfig..");
        Wortal._log.debug("AdConfig initialized.", this._data);
        return Promise.resolve();
    }
}
