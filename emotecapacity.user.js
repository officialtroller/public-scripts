// ==UserScript==
// @name         [C-I] Emote Capacity
// @description  Adds a new Setting to the game where you can change your emote capacity from 1 to 5.
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Emote Capacity";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

if (!window.ClientStorage) {
    window.ClientStorage = new class {
        gem1 = function () {
            return JSON.parse(localStorage.getItem("gemindeed")) || JSON.stringify('#ff0000');
        };
        gem2 = function () {
            return JSON.parse(localStorage.getItem("gemindeed1")) || JSON.stringify("#ff8080");
        };
        emotes = function () {
            return JSON.parse(localStorage.getItem("emopacity")) || JSON.stringify("4");
        };
    };
};

async function injector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
        if (src == prevSrc) throw new Error("src didn't change");
        prevSrc = src;
    }

    let settingsregex = src.match(/music:\{[^{}]*\},/);
    let settingsmatch = settingsregex[0].match(/[iI10OlL]{4,6}/g);
    let newrgs = src.match(/function\(i\)\{if\(i\.addEventListener\("input",function\(s\)\{.*?\}\),i\.dispatchEvent\(new Event\("input"\)\),"sounds"===i\.id\)return i\.addEventListener\("change",function\(t\)\{.*?\}\)\}/s);
    let newnewrgs = newrgs[0].match(/[iI10OlL]{4,6}/g);
    let query = src.match(/for\(f=document\.queryselectorall\("\.option\s*input\[type=range\]"\),i=function\(e\)\{.*?,1\)\}\)\}\}/gi);
    let reegtest = src.match(/if\("select"!==\w+\.type\)e\+='<div\s*class="option">'\+t\(\w+\.name\)\+'<label\s*class="switch"><input\s*type="checkbox"\s*'\+\(\w+\.value\?'checked="checked"':""\)\+'\s*id="'\+s\+'""><div\s*class="slider"><\/div><\/label><\/div>';/);
    if (reegtest) {
        let reeegtest = reegtest[0].match(/\w+\.type/)[0].match(/\w+\./)[0];
        src = src.replace(reegtest, `if ("select" !== ${reeegtest}type) if ("color" === ${reeegtest}type) {e += '<div class="option">' + t(${reeegtest}name) + '<div class="range" style=\\"cursor: pointer;\\">\\n  <input id=\\'\' + s + "' type=\\"color\\" style=\\"-webkit-appearance:none;width:130px;border:transparent;background:transparent\\">\\n<span id='" + s + "_value'>" + ${reeegtest}value + "</span>\\n  </div>\\n</div>";} else {e+='<div class="option">'+t(${reeegtest}name)+'<label class="switch"><input type="checkbox" '+(${reeegtest}value?'checked="checked"':"")+' id="'+s+'""><div class="slider"></div></label></div>'}`);
        checkSrcChange();
    }
    src = src.replace(settingsregex, `$&emopacity:{name:"Emote Capacity",value:4,skipauto:!0,type:"range",min:1,max:5,${settingsmatch}:1,filter:"default,app,mobile"},`);
    checkSrcChange();
    if (query !== null) {
        src = src.replace(/for\(f=document\.queryselectorall\("\.option\s*input\[type=range\]"\),i=function\(e\)\{.*?,1\)\}\)\}\}/gi, `for (f = document.querySelectorAll(".option input[type=range], .option input[type=color]"), i = function(e) {
        return function(i) {
            if (i.type === "range") {
                if (i.id === "emopacity") {
                    i.addEventListener("input", function(s) {
                        return x = document.querySelector("#" + i.getAttribute("id") + "_value"), x.innerText = parseInt(i.value, 10), e.updateSettings(s, !0)
                    })
                } else {
                    if (i.addEventListener("input", function(s) {
                            return x = document.querySelector("#" + i.getAttribute("id") + "_value"), x.innerText = "0" === i.value ? t("Off") : Math.round(50 * i.value) + " %", e.updateSettings(s, !0)
                        }), i.dispatchEvent(new Event("input")), "sounds" === i.id) return i.addEventListener("change", function(t) {
                        return e.${newnewrgs[0]}.${newnewrgs[1]}.beep(4 + .2 * Math.random(), 1)
                    })
                }
            } else if (i.type === "color") {
                if (i.id === "gemindeed") {
                    i.addEventListener("input", function(s) {
                        return x = document.querySelector("#" + i.getAttribute("id") + "_value"), x.innerText = i.value, e.updateSettings(s, !0);
                    });
                    i.addEventListener("change", function(s) {
                        i.value = ClientStorage.gem1();
                        x = document.querySelector("#" + i.getAttribute("id") + "_value").innerText = i.value;

                    })
                    i.value = ClientStorage.gem1();
                } else if (i.id === "gemindeed1") {
                    i.addEventListener("input", function(s) {
                        return x = document.querySelector("#" + i.getAttribute("id") + "_value"), x.innerText = i.value, e.updateSettings(s, !0);
                    });
                    i.addEventListener("change", function(s) {
                        i.value = ClientStorage.gem2();
                        x = document.querySelector("#" + i.getAttribute("id") + "_value").innerText = i.value;

                    })
                    i.value = ClientStorage.gem2();
                }
            }
        }
    }`);
        checkSrcChange();
    }

    log(`Mod injected`);
    return src;
}

async function injector1() {
    let panel = setInterval(() => {
        if (window.ChatPanel != null) {
            clearInterval(panel);
            ChatPanel.prototype.typed = new Function("return " + ChatPanel.prototype.typed.toString().replace(">=4", ">=ClientStorage.emotes()"))();
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
        return injector1();
    } catch (error) {
        alert(`${modName} failed to load`);
        throw error;
    }
});
log(`Mod loaded`);