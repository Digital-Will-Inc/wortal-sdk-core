import * as _Wortal from './api';

/**
 * Wortal API
 */
const Wortal = _Wortal;

// We need to include the Wortal SDK backend interface. Nothing should run until this is loaded.
let script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://storage.googleapis.com/html5gameportal.com/embeds/wortal-1.4.0.js";
script.onload = () => Wortal._initInternal();
document.head.appendChild(script);

export default Wortal;
