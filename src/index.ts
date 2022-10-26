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

// Make sure we have the loading cover added to prevent the game canvas from being shown before the preroll ad finishes.
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', addLoadingCover);
} else {
    addLoadingCover();
}

function addLoadingCover(): void {
    let cover = document.createElement("div");
    cover.id = "loading-cover";
    cover.style.cssText = "background: #000000; width: 100%; height: 100%; position: fixed; z-index: 100;";
    document.body.prepend(cover);
}

export default Wortal;
