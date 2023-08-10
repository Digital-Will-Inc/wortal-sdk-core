import * as _Wortal from './api';
import { debug, exception } from "./utils/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////
// This was directly ported over from the deprecated wortal.js. We should probably find a better way to do this,
// but the deadline to ship the v1.6 update is really tight and our motto is "just ship the shit" so, hopefully
// I have time to come back and clean this up later. -Tim
(window as any).adsbygoogle = (window as any).adsbygoogle || [];
(window as any).wortalSessionId = "";
(window as any).adBreak = (window as any).adConfig = function (o: any) {
    (window as any).adsbygoogle.push(o);
}
///////////////////////////////////////////////////////////////////////////////////////////////////

/** Wortal API */
const Wortal = _Wortal;

//TODO: check data attribute to determine if we should auto-initialize the SDK or not

Wortal._initializeInternal().then(() => {
    // This returns before the SDK is fully initialized due to some async calls and late initialization after
    // the platform SDKs finish loading. Do not rely on this for anything mission-critical.
    debug("SDK initializeInternal returned");
}).catch((error: any) => {
    exception("SDK failed to initialize.", error);
});

export default Wortal;
