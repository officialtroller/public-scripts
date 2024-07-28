// ==UserScript==
// @name         [C-I] Lowercase Name
// @description  Lets you use lowercase name
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Lowercase Name";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

function injector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
        if (src == prevSrc) throw new Error("src didn't change");
        prevSrc = src;
    }

    src = src.replace(/\.toUpperCase\(\)/g, "");
    checkSrcChange();
    src = src.replace(/text-transform:\s*uppercase;/gim, "");
    checkSrcChange();

    log(`Mod injected`);
    return src;
}

if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
window.sbCodeInjectors.push((sbCode) => {
    try {
        return injector(sbCode);
    } catch (error) {
        alert(`${modName} failed to load`);
        throw error;
    }
});
log(`Mod loaded`);
