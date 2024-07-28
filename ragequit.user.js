// ==UserScript==
// @name         [C-I] Rage Quit
// @description  Adds a Keybind to quit faster.
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Rage Quit";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

function injector1() {
    document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey && e.key === "s")) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.onbeforeunload = function () { };
            location.reload();
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
