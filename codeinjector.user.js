// ==UserScript==
// @name         Code Injector - Starblast.io
// @version      1.0.8
// @description  Allows different userscripts to define functions that modify the game's code
// @author       Pixelmelt & Excigma & kklkkj
// @namespace    https://greasyfork.org/en/users/226344
// @license      GPL-3.0
// @match        https://starblast.io/
// @run-at       document-end
// @grant        none
// ==/UserScript==

/* Create a logger */
const log = (msg) => console.log(`%c[Mod injector] ${msg}`, "color: #06c26d");

console.clear()

/* Stop non modified scripts from executing */
document.open();
/* little message telling the user to wait for mods to load */
document.write(`<html><head><title>Loading...</title></head><body style="background-color:#293449;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;">Loading mods</h1><h1 style="text-align: center;">Please wait</h1></div></body></html>`);
document.close();
log(`Started`)
function injectLoader() {
    /* dont inject into anything but the main page */
    if (window.location.pathname != "/") { log(`Injection not needed`); return }
    /*
    Set to a specific vesion of sb because of rotating var names.
    If you want to use the most recent version of sb for your mod-
    BE WARNED your mod could break at any time due to rotating variable names

    Changing this URL could lead to your ECP being stolen, be careful!
    */
    var url = "https://starblast.io";

    /* Grab the contents of the link*/
    var xhr = new XMLHttpRequest();
    log("Fetching starblast src...");
    xhr.open("GET", url);

    /* When the request finishes... */
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var starSRC = xhr.responseText;
            if (starSRC != undefined) {
                log(`Src fetched successfully`)
            } else {
                log(`Src fetch failed`)
                alert("An error occurred whilst fetching game code");
            }

            const start_time = performance.now();

            log("Patching src...");
            starSRC = starSRC
                .replace("LEADERBOARD", "Leaderboard")
                .replace(/(\.modal\s\.modecp\s*\{\s*[^}]*bottom:\s*)0\b/, '$1auto')
                .replace("html5.api.gamedistribution.com/libs/gd/api.js", "ads.blocked")
                .replace("https://admax.space/static/js/include.js", "https://ads.blocked")
                .replace("https://services.vlitag.com/adv1/?q=d793231a9b4f6e8faec120e19a2c5578", "https://ads.blocked")
                .replace("https://sdk.crazygames.com/crazygames-sdk-v1.js", "https://ads.blocked")
                .replace("api.adinplay.com/libs/aiptag/pub/NRN/starblast.io/tag.min.js", "ads.blocked");

            if (!window.sbCodeInjectors) {
                log("Did not find any Starblast.io userscripts to load. This may be an error, make sure you have scripts installed.");
                log(`Proceeded to load normally.`)
            } else {
                /* Loop through `sbCodeInjectors` and pass src code in for them to modify */
                let error_notified = false;
                for (const injector of window.sbCodeInjectors) {
                    try {
                        /* Run injector from other userscripts */
                        if (typeof injector === "function") starSRC = injector(starSRC);
                        else {
                            log("Injector was not a function");
                            console.log(injector);
                        }
                    } catch (error) {
                        /* Only notify the user once if any userscript fails to load
                        helpful to prevent spamming alerts() */

                        if (!error_notified) {
                            /* An injector from one of the other userscripts failed to load */
                            alert("One of your Starblast.io userscripts was unable to be loaded");
                            error_notified = true;
                        }

                        console.error(error);
                    }
                }
            }

            const end_time = performance.now();
            log(`Patched src successfully (${(end_time - start_time).toFixed(0)}ms)`);

            /* Finish up and write the modified code to the docuent */
            document.open();
            document.write(starSRC);
            document.close();
            log("Document loaded");
            setTimeout(() => {
                let listenerAttached = false;
                function setupEcpToggle() {
                    const viewEcp = document.getElementById("viewEcp");
                    if (viewEcp) {
                        const eyeIcon = viewEcp.querySelector("i");
                        if (eyeIcon && !listenerAttached) {
                            viewEcp.addEventListener("click", toggleEyeIcon);
                            listenerAttached = true;
                        }
                    } else if (listenerAttached) {
                        listenerAttached = false;
                    }
                }
                function toggleEyeIcon(event) {
                    const eyeIcon = event.currentTarget.querySelector("i");
                    if (eyeIcon) {
                        eyeIcon.classList.toggle("fa-eye");
                        eyeIcon.classList.toggle("fa-eye-slash");
                    }
                }
                setInterval(setupEcpToggle, 100);
                let MUIP = ModdingUIComponent.prototype, hide = MUIP.hide, set = ModdingMode.prototype.setUIComponent, specs = ModdingUIComponent.toString().match(/,\s*this.([^=]+?\s*).add/)[1].split("."),
                    getGroup = function (_this) {
                        for (let spec of specs) _this = _this[spec];
                        return _this;
                    }, isHidden = function (ui) {
                        return (!Array.isArray(ui.components) || ui.components.filter(i => ["round", "box", "player", "text"].includes((i || {}).type)).length == 0) && !ui.clickable;
                    };

                GenericMode.prototype.setUIComponent = ModdingMode.prototype.setUIComponent = function (ui) {
                    if (ui == null) ui = { visible: false };
                    if (!Array.isArray(ui.position)) ui.position = [];
                    let idealPos = [0, 0, 100, 100], pos = [];
                    if (ui.visible != null && !ui.visible) pos = [0, 0, 0, 0];
                    else for (let i = 0; i < idealPos.length; ++i) pos.push(ui.position[i] == null || isNaN(ui.position[i]) ? idealPos[i] : +ui.position[i]);
                    ui.position = pos;
                    if (!(ui.visible != null && !ui.visible || isHidden(ui)) || (this.ui_components != null && this.ui_components[ui.id])) return set.call(this, ui);
                };

                MUIP.interfaceHidden = function () {
                    return this.interface_hidden = !0, hide.apply(this, arguments);
                };

                MUIP.hide = function () {
                    if (!this.firstHide) {
                        this.shown = this.firstHide = true;
                    }
                    let shown = this.shown, result = hide.apply(this, arguments);
                    if (shown) {
                        return setTimeout(function (t) {
                            if (!t.shown) {
                                getGroup(t).remove(t);
                                if (t[specs[0]].mode.ui_components != null) delete t[specs[0]].mode.ui_components[t.component.id];
                            }
                        }, 1e3, this);
                    }
                    return result;
                };

                let key = Object.keys(MUIP).find(key => "function" == typeof MUIP[key] && MUIP[key].toString().includes("this.shown=!0")), show = MUIP[key];
                MUIP[key] = function () {
                    if (isHidden(this.component)) return this.hide();
                    let group = getGroup(this);
                    if (!this.shown) return !group.children.includes(this) && group.add(this, this.component.position), show.call(this, arguments);
                };
                if (!window.sbCodeRunners) {
                    log("No CodeRunners found")
                } else {
                    log("CodeRunners found")
                    for (const runner of window.sbCodeRunners) {
                        try {
                            if (typeof runner === "function") {
                                runner();
                            } else {
                                log("CodeRunner was not a function");
                                console.log(runner);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }
                };
            }, 30);


        }
    };
    /* Send the request */
    xhr.send();
}
/* ms before trying to inject mods */
setTimeout(injectLoader, 1);