// ==UserScript==
// @name         [C-I] Blur Page
// @description  Adds a Blur Page to the home page
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Blur Page";
//if setting not found, set by default off
if (localStorage.getItem("blorus") == null) localStorage.setItem("blorus", "false");
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

async function injector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
        if (src == prevSrc) throw new Error("src didn't change");
        prevSrc = src;
    }

    src = src.replace(/shake:\{[^{}]*\},/, '$&blorus:{name:"Blur Page",value:!0,skipauto:!0,filter:"default,app,mobile"},');
    checkSrcChange();

    log(`Mod injected`);
    return src;
}

let Client = new class {
    checkgame() {
        return "/" == window.location.pathname && "welcome" != Object.values(window.module.exports.settings).find(e => e && e.mode).mode.id && "https://starblast.io/#" != window.location.href
    }
};

async function injector1() {
    var d = document.createElement("div");
    d.id = "blur";
    d.style.position = "absolute";
    d.style.top = "0";
    d.style.left = "0";
    d.style.width = "100%";
    d.style.height = "100%";
    d.style.background = "hsla(200, 72%, 61%, 0.14)";
    d.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
    d.style.backdropFilter = "blur(7.1px)";
    d.style.webkitBackdropFilter = "blur(7.1px)";
    d.style.pointerEvents = "none";
    d.style.zIndex = "0";
    function blur() {
        if (localStorage.blorus === "true" && !document.getElementById("blur") && !Client.checkgame()) {
            document.body.appendChild(d);
            return setInterval(function () {
                null != window.module && "welcome" != Object.values(window.module.exports.settings).find(e => e && e.mode).mode.id && (document.getElementById("blur") && document.getElementById("blur").remove(), clearInterval())
            });
        } else if (localStorage.blorus === "false" && document.getElementById("blur")) {
            return document.getElementById("blur").remove();
        }
    }
    let urval = setInterval(function () {
        blur();
        if (null != window.module && "welcome" != Object.values(window.module.exports.settings).find(e => e && e.mode).mode.id) {
            clearInterval(urval);
        }
    }, 10);
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
