// ==UserScript==
// @name         [C-I] Self Ship Tag
// @description  Adds an ship tag under your ship like under other ships
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Self Ship Tag";
//if setting not found, set by default on
if (localStorage.getItem("selftag") == null) localStorage.setItem("selftag", "true");
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

async function injector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
        if (src == prevSrc) throw new Error("src didn't change");
        prevSrc = src;
    }

    src = src.replace(/shake:\{[^{}]*\},/, '$&selftag:{name:"Self Ship Tag",value:!0,skipauto:!0,filter:"default,app,mobile"},');
    checkSrcChange();

    log(`Mod injected`);
    return src;
}

async function injector1() {
    setTimeout(function () {
        ! function () {
            let e, t;
            for (let n in window) try {
                let i = window[n].prototype;
                if (null != i)
                    for (let o in i) {
                        let s = i[o];
                        if ("function" == typeof s && s.toString().match(/([^,]+)("hsla\(180,100%,75%,\.75\)")/)) {
                            let l;
                            e = n, i[t = Object.keys(i).find(e => "function" == typeof i[e] && (l = (i[e].toString().match(/===(\w+\.[^,]+)\.hue/) || [])[1]))] = Function("return " + i[t].toString().replace(/(\.id)/, "$1, this.selfShip = this.shipid == " + l + ".id"))(), i[o] = Function("return " + s.toString().replace(/([^,]+)("hsla\(180,100%,75%,\.75\)")/, "$1 this.selfShip ? 'hsla(180,100%,75%,.75)' : $2"))()
                        }
                    }
            } catch (r) { }
            let a = Object.getPrototypeOf(Object.values(Object.values(window.module.exports.settings).find(e => e && e.mode)).find(e => e && e.background)),
                d = a.constructor,
                c = d.prototype,
                u = d.toString(),
                hue = u.match(/(\w+)\.hue/)[1],
                f = u.match(/(\w+)\.add\(/)[1],
                h = u.match(/chat_bubble\.(\w+)/)[1];
            (d = Function("return " + u.replace(/}$/, ", this.welcome || (this.ship_tag = new " + e + "(Math.floor(360 * 0)), this." + f + ".add(this.ship_tag." + h + "))}"))()).prototype = c, d.prototype.constructor = d, a.constructor = d, d.prototype.updateShipTag = function () {
                if (null != this.ship_tag) {
                    if (!this.shipKey) {
                        this.shipKey = Object.keys(this).find(e => this[e] && this[e].ships);
                        let e = this[this.shipKey];
                        this.statusKey = Object.keys(e).find(t => e[t] && e[t].status)
                    }
                    let n = this[hue],
                        i = this[this.shipKey][this.statusKey];
                    this.ship_tag[t](n, n.names.get(i.status.id), i.status, i.instance);
                    let o = this.ship_tag[h].position;
                    o.x = i.status.x, o.y = i.status.y - 2 - i.type.radius, o.z = 1, this.ship_tag[h].visible = "true" == localStorage.getItem("selftag") && i.status.alive && !i.status.guided
                }
            };
            let m = Object.keys(c).find(e => "function" == typeof c[e] && c[e].toString().includes("render"));
            d.prototype[m] = Function("return " + d.prototype[m].toString().replace(/(\w+\.render)/, "this.updateShipTag(), $1"))();
            let g = function (...e) {
                return window.module.exports.translate(...e)
            };
            for (let $ in window) try {
                let y = window[$];
                if ("function" == typeof y.prototype.refused)
                    for (let v in y.prototype) {
                        let b = y.prototype[v];
                        "function" == typeof b && b.toString().includes("new Scene") && (y.prototype[v] = Function("Scene", "t", "return " + b.toString())(d, g))
                    }
            } catch (_) { }
        }()
    }, 1100);
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
