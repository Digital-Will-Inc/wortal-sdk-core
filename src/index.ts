import { CoreAPI } from "./core/core-api";
import { InitializationOptions } from "./core/interfaces/initialization-options";
import { PLATFORM_DOMAINS } from "./data/core-data";
import { Platform } from "./session/types/session-types";
import { getParameterByName } from "./utils/wortal-utils";

const Wortal = new CoreAPI();
window.Wortal = Wortal;

const options: InitializationOptions = {
    autoInitialize: isAutoInitEnabled(),
    platform: determinePlatform(),
    debugMode: isDebugMode(),
}

Wortal._loadCoreAsync(options)
    .catch((error: any) => {
        console.error("SDK failed to initialize.", error);
    });

function isAutoInitEnabled(): boolean {
    const scriptElement = document.currentScript;
    const manualInitFlag = scriptElement?.getAttribute("data-manual-init");
    return manualInitFlag !== "true";
}

function isDebugMode(): boolean {
    const scriptElement = document.currentScript;
    const debugFlag = scriptElement?.getAttribute("data-debug-mode");
    return debugFlag === "true";
}

function determinePlatform(): Platform {
    const host = window.location.host;
    for (const platform of Object.keys(PLATFORM_DOMAINS)) {
        if (PLATFORM_DOMAINS[platform].some(domain => host.includes(domain))) {
            if (platform === "wortal") {
                return parseURLParamsForPlatform();
            } else {
                return platform as Platform;
            }
        }
    }

    return "debug";
}

function parseURLParamsForPlatform(): Platform {
    // Some builds are hosted on Wortal domain but embedded elsewhere, such as a WART bot.
    // These should include a query param with the platform name to determine the correct platform.
    if (getParameterByName("telegram")) {
        return "telegram";
    } else if (getParameterByName("telegram_bot")) {
        // This is the WART bot on Telegram. It's a special case because the normal Telegram platform
        // uses the Playdeck SDK, but WART does not. We'll initialize this as Wortal for now, but we
        // need to sort out the details of this implementation.
        //
        // Update (11/28/23): Brian says it should run as a Wortal session, so I guess we can leave this. -Tim
        return "wortal";
    } else if (getParameterByName("viber")) {
        return "viber";
    } else {
        return "wortal";
    }
}

export default Wortal;
