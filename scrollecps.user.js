// ==UserScript==
// @name         [C-I] Scroll ECP's
// @description  Lets you choose your ecp with mouse wheel.
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Scroll ECP's";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

window.scroll = new class {
    bar() {
        document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td.ecpverifiedlogo.frozenbg").addEventListener("wheel", e => {
            e.deltaY < 1 ? document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-right").click() : e.deltaY > 1 && document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-left").click();
            e.stopPropagation();
        });
        document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div").addEventListener("wheel", e => {
            e.deltaY < 1 ? document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-right").click() : e.deltaY > 1 && document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-left").click();
            e.stopPropagation();
        });
        document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td.shippreview.frozenbg").addEventListener("wheel", e => {
            e.deltaY < 1 ? document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-right").click() : e.deltaY > 1 && document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-left").click();
            e.stopPropagation();
        });
        document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > div").addEventListener("wheel", e => {
            e.deltaY < 1 ? document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-right").click() : e.deltaY > 1 && document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-left").click();
            e.stopPropagation();
        });
        document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > div").addEventListener("wheel", e => {
            e.deltaY < 1 ? document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > i.fa.fa-caret-right").click() : e.deltaY > 1 && document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > i.fa.fa-caret-left").click();
            e.stopPropagation();
        })
    }
};

async function injector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
        if (src == prevSrc) throw new Error("src didn't change");
        prevSrc = src;
    }

    src = src.replace(/\(\),this.showModal\("donate"\)/g, '(), this.showModal("donate"), scroll.bar()');
    checkSrcChange();

    log(`Mod injected`);
    return src;
}

if (!window.sbCodeRunners) window.sbCodeRunners = [];
window.sbCodeRunners.push((sbCode) => {
    try {
        return injector(sbCode);
    } catch (error) {
        alert(`${modName} failed to load`);
        throw error;
    }
});
log(`Mod loaded`);
