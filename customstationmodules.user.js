// ==UserScript==
// @name         [C-I] Custom Station Modules
// @description  Adds Custom Station Modules to the game.
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Custom Station Modules";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

function injector1() {
    let sbibt = document.createElement("script");
    sbibt.src = "https://cdn.jsdelivr.net/gh/officialtroller/starblast-things/stationmodels.user.js";
    document.body.appendChild(sbibt);
    log(`Mod injected`);
}

if (!window.sbCodeRunners) window.sbCodeRunners = [];
window.sbCodeRunners.push(() => {
    try {
        return injector1();
    } catch (error) {
        alert(`${modName} failed to load`);
        throw error;
    }
});
log(`Mod loaded`);
