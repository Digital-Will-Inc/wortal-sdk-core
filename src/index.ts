import * as _Wortal from './api';
import { exception } from "./utils/logger";

/** Wortal API */
const Wortal = _Wortal;
window.Wortal = Wortal;

// Check if the SDK should be automatically initialized or not.
let isAutoInit: boolean = true;
const scriptElement = document.currentScript;
const manualInitFlag = scriptElement?.getAttribute("data-manual-init");
if (manualInitFlag === "true") {
    isAutoInit = false;
}

Wortal._initializeInternal({autoInitialize: isAutoInit})
    .catch((error: any) => {
        exception("SDK failed to initialize.", error);
    });

export default Wortal;
