// ==UserScript==
// @name         [C-I] Custom Weapon Modules
// @description  Adds Custom Weapon Modules to the game.
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Custom Weapon Modules";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");
function injector1() {
    let sbibt = document.createElement("script");
    sbibt.src = "https://cdn.jsdelivr.net/gh/officialtroller/starblast-things/weaponmodels.user.js";
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
