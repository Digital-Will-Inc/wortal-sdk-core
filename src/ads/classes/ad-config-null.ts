import { debug } from "../../utils/logger";
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
        debug("Initializing AdConfig..");
        debug("AdConfig initialized.", this._data);
        return Promise.resolve();
    }
}
