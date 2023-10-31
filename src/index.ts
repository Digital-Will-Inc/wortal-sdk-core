import { CoreAPI } from "./core/core-api";
import { InitializationOptions } from "./core/interfaces/initialization-options";
import { PLATFORM_DOMAINS } from "./data/core-data";
import { Platform } from "./session/types/session-types";
import { exception } from "./utils/logger";
import { getParameterByName } from "./utils/wortal-utils";

const Wortal = new CoreAPI();
window.Wortal = Wortal;

const options: InitializationOptions = {
    autoInitialize: isAutoInitEnabled(),
    platform: determinePlatform(),
}

Wortal._loadCoreAsync(options)
    .catch((error: any) => {
        exception("SDK failed to initialize.", error);
    });

function isAutoInitEnabled(): boolean {
    let isAutoInit: boolean = true;
    const scriptElement = document.currentScript;
    const manualInitFlag = scriptElement?.getAttribute("data-manual-init");
    if (manualInitFlag === "true") {
        isAutoInit = false;
    }
    return isAutoInit;
}

function determinePlatform(): Platform {
    const host = window.location.host;
    for (const platform of Object.keys(PLATFORM_DOMAINS)) {
        if (PLATFORM_DOMAINS[platform].some(domain => host.includes(domain))) {
            if (platform === "wortal") {
                // Some builds are hosted on Wortal domain but embedded elsewhere. These should include a query param
                // with the platform name to determine the correct platform.
                if (getParameterByName("telegram")) {
                    return "telegram";
                } else {
                    return "wortal";
                }
            } else {
                return platform as Platform;
            }
        }
    }

    return "debug";
}

export default Wortal;
