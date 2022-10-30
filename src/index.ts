import * as _Wortal from './sdk';

/**
 * Wortal API
 */
const Wortal = _Wortal;

// We need to include the Wortal SDK backend interface. Nothing should run until this is loaded.
let script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://html5gameportal.com/embeds/wortal-1.2.0.js";
script.onload = () => Wortal.init();
document.head.appendChild(script);

export default Wortal;
