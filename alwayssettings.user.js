// ==UserScript==
// @name         [C-I] Always Settings
// @description  Adds a Keybind to always open the settings.
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Always Settings";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

function injector1() {
    document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.key === "e") {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            document.querySelector(".social .sbg-gears").click();
            return false;
        }
    });
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
