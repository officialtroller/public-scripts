// ==UserScript==
// @name         [C-I] Disable Explosions
// @description  When disabling Explosion Lights, it disables the entire Explosions.
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Disable Explosions";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

async function injector1() {
    let explolight = setInterval(() => {
        if (window.Explosions != null) {
            clearInterval(explolight);
            let oldExplosion = Explosions.prototype.explode, oldBlast = Explosions.prototype.blast;

            let globalVal = oldExplosion.toString().match(/this\.([0OlI1\.]+)\.settings\.check/)[1].split(".");


            Explosions.prototype.isEnabled = function () {
                let _this = this;
                for (let i of globalVal) _this = _this[i];
                return _this.settings.check("explolight")
            };

            Explosions.prototype.explode = function () {
                return this.isEnabled() && oldExplosion.apply(this, arguments)
            };

            Explosions.prototype.blast = function () {
                return this.isEnabled() && oldBlast.apply(this, arguments)
            };
        }
    }, 100);
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
