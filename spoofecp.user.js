// ==UserScript==
// @name         [C-I] Spoof ECP
// @description  Replaces your ECP Code client-side to prevent from getting it stolen
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @match        https://starblast.io/modding.html
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Spoof ECP";
//if setting not found set by default off
if (localStorage.getItem("noturecp") == null) localStorage.setItem("noturecp", "false");
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");
function showOneTimeNotification() {
    const hasNotified = localStorage.getItem('CIspooferhasNotified');
    if (!hasNotified) {
        alert(`[${modName}] Mod notifies you and asks you to search for the key-word “CHANGEME” in capital letters in the code of this mod and change it to a hard-to-think-of key-word immediately before turning this mod on in the game settings. This mod is for the security of your ECP code to prevent it from being stolen. Do not share this made-up key-word with anyone. \n\nThis Message gets shown only once!`);
        localStorage.setItem('CIspooferhasNotified', true);
    }
}
async function injector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
        if (src == prevSrc) throw new Error("src didn't change");
        prevSrc = src;
    }

    src = src.replace(/shake:\{[^{}]*\},/, '$&noturecp:{name:"Spoof ECP",value:!0,skipauto:!0,filter:"default,app,mobile"},');
    checkSrcChange();

    log(`Mod injected`);
    return src;
}

async function injector1() {
    let spoofecp = setInterval(() => {
        if (window.WebSocket != null) {
            clearInterval(spoofecp);
            let t = WebSocket.prototype.send;
            WebSocket.prototype.send = function (msg) {
                try {
                    let parsed = JSON.parse(msg);
                    if (!parsed.data || !parsed.data.hasOwnProperty("ecp_key")) throw "Invalid message structure";

                    if (localStorage.getItem('noturecp') == 'true') {
                        if (localStorage.getItem("CHANGEME") !== null) {
                            parsed.data.ecp_key = localStorage.getItem("CHANGEME");
                            parsed.data.steamid = null;
                        } else return t.apply(this, arguments);
                    } else if (localStorage.getItem('noturecp') == 'false') {
                        if (localStorage.getItem("CHANGEME") !== null) {
                            parsed.data.ecp_key = localStorage.getItem("CHANGEME");
                            parsed.data.steamid = null;
                        } else return t.apply(this, arguments);
                    }
                    arguments[0] = JSON.stringify(parsed);
                } catch (e) { }
                return t.apply(this, arguments);
            }
        }
    }, 100);
    setInterval(() => {
        let frecp = localStorage.getItem("ECPKey"),
            realecp = localStorage.getItem("CHANGEME"),
            getecp = document.getElementById("ECPKey");

        if (localStorage.getItem('noturecp') == 'true') {
            if (localStorage.getItem("CHANGEME") === null) {
                localStorage.setItem("CHANGEME", localStorage.getItem("ECPKey"));
            }
            localStorage.setItem("ECPKey", "My Secret Key");

            if (getecp !== null && getecp.getAttribute('data-value') != localStorage.getItem("ECPKey")) {
                getecp.setAttribute('data-value', localStorage.getItem("ECPKey"));
            }
        } else if (localStorage.getItem('noturecp') == 'false') {
            if (localStorage.getItem("CHANGEME") !== null && localStorage.getItem("ECPKey") == "My Secret Key") {
                localStorage.setItem("ECPKey", localStorage.getItem("CHANGEME"));

                if (getecp !== null && getecp.getAttribute('data-value') != localStorage.getItem("CHANGEME")) {
                    getecp.setAttribute('data-value', localStorage.getItem("CHANGEME"));
                }
            }
        }
    }, 100);
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
        return injector1(), showOneTimeNotification();
    } catch (error) {
        alert(`${modName} failed to load`);
        throw error;
    }
});

let ModdingClient = new class {
    log(msg) {
        console.log(`%c[Modding Client] ${msg}`, "color: #c4bf9f");
    }
}
function ModdingLoader() {
    'use strict';
    document.open();
    document.write(`<html><head><title>Loading...</title></head><body style="background-color:#293449;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;">Loading client</h1><h1 style="text-align: center;">Please wait</h1></div></body></html>`);
    document.close();
    var url = "https://starblast.io/modding.html";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var src = xhr.responseText;
            const start_time = performance.now();
            if (localStorage.getItem("ECPKey") === "My Secret Key" && localStorage.getItem("0xsbicool") !== null) src = src.replace("ecp_key: new ECP().key", 'ecp_key:localStorage.getItem("0xsbicool"),');
            const end_time = performance.now();
            ModdingClient.log(`Patched src successfully (${(end_time - start_time).toFixed(0)}ms)`);
            document.open();
            document.write(src);
            document.close();
        }
    };
    xhr.send();
}
if (window.location.pathname == "/modding.html") {
    setTimeout(ModdingLoader, 1);
}
log(`Mod loaded`);
